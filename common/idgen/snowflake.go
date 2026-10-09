package idgen

import (
	"github.com/bwmarrin/snowflake"
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
