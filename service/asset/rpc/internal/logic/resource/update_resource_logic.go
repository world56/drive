package resourcelogic

import (
	rabbitmq "common/rabbitmq"
	utils "common/utils/jsonstring"
	"context"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"asset/rpc/internal/enum"
	"asset/rpc/internal/model"
	"asset/rpc/internal/svc"
	"asset/rpc/pb"
	authpb "auth/rpc/pb"
	"common/ctxdata"

	"google.golang.org/protobuf/types/known/emptypb"
	"gorm.io/gorm"

	"github.com/zeromicro/go-zero/core/logx"

	statsclient "stats/rpc/client/stats"
)

type UpdateResourceLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewUpdateResourceLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateResourceLogic {
	return &UpdateResourceLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *UpdateResourceLogic) UpdateResource(in *pb.UpdateResourceReq) (*emptypb.Empty, error) {
	db := l.svcCtx.DB.WithContext(l.ctx)

	var target model.Resource
	if err := db.Where("id = ?", in.Id).First(&target).Error; err != nil {
		return nil, err
	}

	fullName := in.Name
	if target.Type != enum.ResourceTypeFolder && target.Suffix != nil && *target.Suffix != "" {
		fullName = in.Name + "." + *target.Suffix
	}

	update := map[string]interface{}{
		"full_name": fullName,
		"name":      in.Name,
		"remark":    in.Remark,
		"parent_id": in.ParentId,
	}

	if err := db.Model(&model.Resource{}).Where("id = ?", in.Id).Updates(update).Error; err != nil {
		return nil, err
	}

	var updated model.Resource
	if err := db.Where("id = ?", in.Id).First(&updated).Error; err == nil {
		l.svcCtx.RabbitMQ.Publish(l.ctx, rabbitmq.PublishOptions{
			RoutingKey:  "create",
			Exchange:    "log",
			ContentType: "application/protobuf",
			Message: &authpb.CreateLogReq{
				CreateTime: time.Now().UnixMilli(),
				OperatorId: ctxdata.UserInfo(l.ctx).Id,
				Desc:       utils.ToDescString(update),
				Event:      enum.LogEventResourceUpdate,
			},
		})
	}

	return &emptypb.Empty{}, nil
}

func (l *UpdateResourceLogic) UpdateResourceStatus(
	c context.Context,
	db *gorm.DB,
	resourceIDs []int64,
	removeStatus enum.ResourceRecycleStatus,
) ([]model.Resource, error) {
	fromStatus := enum.ResourceRecycled
	if removeStatus == enum.ResourceRecycled {
		fromStatus = enum.ResourceNormal
	}

	var resources []model.Resource
	if err := db.Raw(`
		WITH RECURSIVE tree AS (
			SELECT id, type, size, full_name, parent_id, creator_id, object_name, suffix
			FROM resources WHERE id IN ? AND remove = ?
			UNION ALL
			SELECT r.id, r.type, r.size, r.full_name, r.parent_id, r.creator_id, r.object_name, r.suffix
			FROM resources AS r
			INNER JOIN tree AS t ON r.parent_id = t.id AND t.type = ?
			WHERE r.remove = ?
		)
		SELECT id, type, size, full_name, parent_id, creator_id, object_name, suffix FROM tree
	`, resourceIDs, fromStatus, enum.ResourceTypeFolder, fromStatus).Scan(&resources).Error; err != nil {
		return nil, err
	}
	if len(resources) == 0 {
		return nil, nil
	}

	ids := make([]int64, len(resources))
	counts := make(map[int8]int32, len(resources))
	for i, v := range resources {
		ids[i] = v.Id
		counts[v.Type]++
	}

	// 恢复时先处理孤儿数据
	if removeStatus == enum.ResourceNormal {
		if err := l.reOrphansToRoot(db, ids); err != nil {
			return nil, err
		}
	}

	if err := db.Model(&model.Resource{}).
		Where("id IN ?", ids).
		Update("remove", removeStatus).Error; err != nil {
		return nil, err
	}

	CALC := "ADD"
	if removeStatus == enum.ResourceRecycled {
		CALC = "REDUCE"
	}
	count := make(map[int32]int32, len(counts))
	for k, v := range counts {
		count[int32(k)] = v
	}
	go func() {
		if _, err := l.svcCtx.StatsRpc.UpdateStorageCount(context.Background(), &statsclient.UpdateResourceReq{
			Calculation: CALC,
			Count:       count,
		}); err != nil {
			l.Errorf("update storage count: %v", err)
		}
	}()
	return resources, nil
}

func (l *UpdateResourceLogic) reOrphansToRoot(db *gorm.DB, ids []int64) error {
	var orphans []model.Resource
	if err := db.Raw(`
		SELECT r.id, r.full_name, r.type
		FROM resources r
		WHERE r.id IN ?
		  AND r.parent_id IS NOT NULL
		  AND NOT EXISTS (
			SELECT 1 FROM resources p
			WHERE p.id = r.parent_id AND (p.remove = ? OR p.id IN ?)
		  )
	`, ids, enum.ResourceNormal, ids).Scan(&orphans).Error; err != nil || len(orphans) == 0 {
		return err
	}

	var rootNames []string
	if err := db.Model(&model.Resource{}).Where("parent_id IS NULL").Pluck("full_name", &rootNames).Error; err != nil {
		return err
	}
	used := make(map[string]struct{}, len(rootNames)+len(orphans))
	for _, n := range rootNames {
		used[n] = struct{}{}
	}

	for _, o := range orphans {
		name, fullName := l.allocRootName(o.FullName, o.Type, used)
		used[fullName] = struct{}{}
		if err := db.Exec(
			`UPDATE resources SET name = ?, full_name = ?, parent_id = NULL WHERE id = ?`,
			name, fullName, o.Id,
		).Error; err != nil {
			return err
		}
	}
	return nil
}

func (l *UpdateResourceLogic) allocRootName(fullName string, typ int8, used map[string]struct{}) (string, string) {
	ext := ""
	base := fullName
	if typ != enum.ResourceTypeFolder {
		ext = filepath.Ext(fullName)
		base = strings.TrimSuffix(fullName, ext)
	}
	for n := 1; ; n++ {
		name := base
		if n > 1 {
			name = base + " " + strconv.Itoa(n)
		}
		out := name + ext
		if _, ok := used[out]; !ok {
			return name, out
		}
	}
}
