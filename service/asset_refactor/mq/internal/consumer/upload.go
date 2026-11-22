package consumer

import (
	"context"
	"errors"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"asset/mq/internal/enum"
	"asset/mq/internal/model"
	"asset/mq/internal/pkg/filetype"
	"asset/mq/internal/svc"
	"asset/rpc/pb"
	logclient "auth/rpc/client/log"
	"common/databases"
	rabbitmq "common/rabbitmq"
	utils "common/utils/jsonstring"
	statsclient "stats/rpc/client/stats"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/zeromicro/go-zero/core/logx"
	"google.golang.org/protobuf/proto"
	"gorm.io/gorm"
)

type UploadConsumer struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUploadConsumer(ctx context.Context, svcCtx *svc.ServiceContext) *UploadConsumer {
	return &UploadConsumer{
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UploadConsumer) Consume(ctx context.Context, d amqp.Delivery) error {
	var req pb.CreateResourceReq
	if err := proto.Unmarshal(d.Body, &req); err != nil {
		logx.Errorf("UploadConsumer Unmarshal err: %v", err)
		return rabbitmq.ErrInvalidMessage
	}

	creatorID, _ := d.Headers["UserID"].(string)
	if creatorID == "" {
		creatorID = req.GetCreatorId()
	}
	if creatorID == "" {
		return rabbitmq.ErrInvalidMessage
	}
	req.CreatorId = creatorID

	_, err := l.CreateResource(ctx, &req)
	return err
}

func (l *UploadConsumer) CreateResource(c context.Context, req *pb.CreateResourceReq) (*model.Resource, error) {
	fullName := req.GetFullName()
	objectName := req.GetObjectName()
	size := req.GetSize()
	path := req.GetPath()
	parentID := req.ParentId
	creatorID := req.GetCreatorId()

	ext := filepath.Ext(fullName)
	suffix := strings.TrimPrefix(ext, ".")
	baseName := strings.TrimSuffix(fullName, ext)
	pID := parentID

	if path != "" {
		folderID, err := l.createFolders(c, parentID, path, creatorID)
		if err == nil {
			pID = folderID
		}
	}

	for n := 1; n <= 64; n++ {
		name := baseName
		if n > 1 {
			name = baseName + " " + strconv.Itoa(n)
		}
		resourceType := filetype.DetectBySuffix(suffix)
		resource := &model.Resource{
			Size:       size,
			Suffix:     &suffix,
			Name:       name,
			FullName:   name + ext,
			ParentId:   pID,
			CreatorId:  creatorID,
			ObjectName: objectName,
			Type:       resourceType,
		}
		err := l.svcCtx.DB.WithContext(c).Create(resource).Error
		if err == nil {
			go func() {
				_, _ = l.svcCtx.StatsRpc.UpdateStorageCount(context.Background(), &statsclient.UpdateResourceReq{
					Calculation: "ADD",
					Count:       map[int32]int32{int32(resourceType): 1},
				})
			}()
			_, _ = l.svcCtx.LogRpc.CreateLog(c, &logclient.CreateLogReq{
				OperatorId: creatorID,
				Desc:       utils.ToDescString(resource),
				Event:      enum.LogEventResourceUpload,
			})
			return resource, nil
		}
		if !databases.IsUniqueViolation(err) {
			return nil, err
		}
		if objectName != "" {
			var existing model.Resource
			err := l.svcCtx.DB.WithContext(c).Where("object_name = ?", objectName).Take(&existing).Error
			if err == nil {
				return &existing, nil
			}
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, err
			}
		}
	}
	return nil, errors.New("resource name conflict")
}

func (l *UploadConsumer) createFolders(c context.Context, parentID *int64, path string, creatorID string) (*int64, error) {
	dir := filepath.Dir(path)
	paths := strings.Split(dir, "/")

	parentKey := "root"
	if parentID != nil {
		parentKey = strconv.FormatInt(*parentID, 10)
	}

	cacheKey := "drive:folder:" + parentKey
	if val, err := l.svcCtx.Redis.HGet(c, cacheKey, dir).Result(); err == nil {
		id, err := strconv.ParseInt(val, 10, 64)
		if err == nil {
			return &id, nil
		}
	}

	cur := parentID
	var last *int64
	for _, name := range paths {
		id, err := l.createFolder(c, cur, name, creatorID)
		if err != nil {
			return nil, err
		}
		last = &id
		cur = &id
	}
	if last != nil {
		if err := l.svcCtx.Redis.HSet(c, cacheKey, dir, strconv.FormatInt(*last, 10)).Err(); err == nil {
			_ = l.svcCtx.Redis.Expire(c, cacheKey, 3*time.Minute).Err()
		}
	}
	return last, nil
}

func (l *UploadConsumer) createFolder(c context.Context, parentId *int64, name, creatorID string) (int64, error) {
	db := l.svcCtx.DB.WithContext(c)

	folder := model.Resource{
		Name:      name,
		FullName:  name,
		ParentId:  parentId,
		CreatorId: creatorID,
		Type:      enum.ResourceTypeFolder,
	}

	err := db.Create(&folder).Error
	if err == nil {
		return folder.Id, nil
	}
	if !databases.IsUniqueViolation(err) {
		return 0, err
	}

	var exist model.Resource
	if err := db.Where("name = ?", name).
		Where("parent_id IS NOT DISTINCT FROM ?", parentId).
		Where("type = ?", enum.ResourceTypeFolder).
		Where("remove = ?", enum.ResourceNormal).
		First(&exist).Error; err != nil {
		return 0, err
	}
	return exist.Id, nil
}
