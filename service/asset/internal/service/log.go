package service

import (
	authpb "api/auth"
	"asset/internal/dto"
	"asset/internal/model"
	rabbitmq "common/rabbitmq"
	"context"
	"encoding/json"
	"strconv"
	"time"
)

type LogService struct {
	rabbitmq *rabbitmq.Client
}

func newLogService(mq *rabbitmq.Client) *LogService {
	return &LogService{rabbitmq: mq}
}

type logResource struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	FullName    string    `json:"fullName"`
	Size        int64     `json:"size"`
	Type        int8      `json:"type"`
	Suffix      *string   `json:"suffix"`
	ParentID    *string   `json:"parentId"`
	Remark      *string   `json:"remark"`
	Count       int64     `json:"count"`
	ObjectName  string    `json:"objectName"`
	CreatorID   string    `json:"creatorId"`
	Remove      int8      `json:"remove"`
	CreateTime  time.Time `json:"createTime"`
	CreatorName string    `json:"creatorName,omitempty"`
}

func (s *LogService) Write(c context.Context, event, operatorID string, desc any) {
	if s == nil || s.rabbitmq == nil || operatorID == "" {
		return
	}

	body, err := json.Marshal(toLogDesc(desc))
	if err != nil {
		return
	}

	_ = s.rabbitmq.Publish(c, rabbitmq.PublishOptions{
		Exchange:    "log",
		RoutingKey:  "write",
		ContentType: "application/protobuf",
		Message: &authpb.Log{
			Event:      event,
			OperatorId: operatorID,
			Desc:       string(body),
		},
	})
}

func toLogDesc(desc any) any {
	switch v := desc.(type) {
	case model.Resource:
		return fromModelResource(v)
	case *model.Resource:
		if v == nil {
			return nil
		}
		return fromModelResource(*v)
	case []model.Resource:
		list := make([]logResource, 0, len(v))
		for _, item := range v {
			list = append(list, fromModelResource(item))
		}
		return list
	case dto.ReposesResourceDetail:
		return fromResourceDetail(v)
	case *dto.ReposesResourceDetail:
		if v == nil {
			return nil
		}
		return fromResourceDetail(*v)
	case dto.Resource:
		return fromDTOResource(v, "")
	case *dto.Resource:
		if v == nil {
			return nil
		}
		return fromDTOResource(*v, "")
	default:
		return desc
	}
}

func fromModelResource(r model.Resource) logResource {
	return logResource{
		ID:         strconv.FormatInt(r.ID, 10),
		Name:       r.Name,
		FullName:   r.FullName,
		Size:       r.Size,
		Type:       r.Type,
		Suffix:     r.Suffix,
		ParentID:   formatParentID(r.ParentID),
		Remark:     r.Remark,
		Count:      r.Count,
		ObjectName: r.ObjectName,
		CreatorID:  r.CreatorID,
		Remove:     r.Remove,
		CreateTime: r.CreateTime,
	}
}

func fromResourceDetail(r dto.ReposesResourceDetail) logResource {
	return fromDTOResource(r.Resource, r.CreatorName)
}

func fromDTOResource(r dto.Resource, creatorName string) logResource {
	var count int64
	if r.Count != nil {
		count = *r.Count
	}
	var suffix *string
	if r.Suffix != "" {
		s := r.Suffix
		suffix = &s
	}
	var createTime time.Time
	if r.CreateTime != "" {
		if t, err := time.Parse(time.RFC3339Nano, r.CreateTime); err == nil {
			createTime = t
		} else if t, err := time.Parse(time.RFC3339, r.CreateTime); err == nil {
			createTime = t
		}
	}
	return logResource{
		ID:          strconv.FormatInt(r.ID, 10),
		Name:        r.Name,
		FullName:    r.FullName,
		Size:        r.Size,
		Type:        r.Type,
		Suffix:      suffix,
		ParentID:    formatParentID(r.ParentID),
		Remark:      r.Remark,
		Count:       count,
		ObjectName:  r.ObjectName,
		CreatorID:   r.CreatorID,
		CreateTime:  createTime,
		CreatorName: creatorName,
	}
}

func formatParentID(parentID *int64) *string {
	if parentID == nil {
		return nil
	}
	s := strconv.FormatInt(*parentID, 10)
	return &s
}
