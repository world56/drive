package idgen

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"log"
	"math/big"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

const (
	nodeCount     = 1024
	nodeKeyPrefix = "drive:snowflake:node:"
	nodeLease     = 30 * time.Second
	nodeRenew     = 10 * time.Second
)

var renewScript = redis.NewScript(`
if redis.call("GET", KEYS[1]) == ARGV[1] then
	return redis.call("PEXPIRE", KEYS[1], ARGV[2])
end
return 0
`)

// HoldSnowflake 空闲节点
func HoldSnowflake(ctx context.Context, rdb *redis.Client) error {
	if rdb == nil {
		return errors.New("redis is nil")
	}

	holder, err := holderID()
	if err != nil {
		return err
	}
	start, err := rand.Int(rand.Reader, big.NewInt(nodeCount))
	if err != nil {
		return err
	}

	var nodeID int64 = -1
	for i := int64(0); i < nodeCount; i++ {
		id := (start.Int64() + i) % nodeCount
		ok, err := rdb.SetNX(ctx, nodeKey(id), holder, nodeLease).Result()
		if err != nil {
			return err
		}
		if ok {
			nodeID = id
			break
		}
	}
	if nodeID < 0 {
		return errors.New("snowflake node exhausted")
	}

	if err := InitSnowflake(nodeID); err != nil {
		_ = rdb.Del(ctx, nodeKey(nodeID)).Err()
		return err
	}
	go renewNode(rdb, nodeID, holder)
	log.Printf("snowflake node %d", nodeID)
	return nil
}

func renewNode(rdb *redis.Client, nodeID int64, holder string) {
	ticker := time.NewTicker(nodeRenew)
	defer ticker.Stop()
	key := nodeKey(nodeID)
	ttl := nodeLease.Milliseconds()
	for range ticker.C {
		n, err := renewScript.Run(context.Background(), rdb, []string{key}, holder, ttl).Int64()
		if err != nil || n == 0 {
			log.Fatalf("snowflake node %d lease lost: %v", nodeID, err)
		}
	}
}

func nodeKey(id int64) string {
	return fmt.Sprintf("%s%d", nodeKeyPrefix, id)
}

func holderID() (string, error) {
	host, err := os.Hostname()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s:%d", host, os.Getpid()), nil
}
