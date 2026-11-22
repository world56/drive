package idgen

import (
	"github.com/bwmarrin/snowflake"
)

const (
	NodeAuth    int64 = 1
	NodeStorage int64 = 2
	NodeAsset   int64 = 3
	NodeAssetMQ int64 = 4
)

var snowflakeNode *snowflake.Node

func InitSnowflake(nodeID int64) error {
	node, err := snowflake.NewNode(nodeID)
	if err != nil {
		return err
	}
	snowflakeNode = node
	return nil
}

func SnowflakeIDNext() int64 {
	if snowflakeNode == nil {
		return 0
	}
	return snowflakeNode.Generate().Int64()
}
