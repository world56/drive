package idgen

import (
	"errors"

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

func SnowflakeIDNext() (int64, error) {
	if snowflakeNode == nil {
		return 0, errors.New("Snowflake tot initialized")
	}
	return snowflakeNode.Generate().Int64(), nil
}
