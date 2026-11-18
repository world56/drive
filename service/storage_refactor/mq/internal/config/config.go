package config

type Config struct {
	RedisUrl            string
	RabbitMqUrl         string
	MINIO_ADDR          string
	MINIO_BUCKET        string
	MINIO_ACCESS_KEY    string
	MINIO_ACCESS_SECRET string
}
