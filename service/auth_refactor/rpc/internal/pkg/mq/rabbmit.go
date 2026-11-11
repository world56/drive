package mq

import rabbitmq "common/rabbitmq"

func InitRabbitMQ(url string) (*rabbitmq.Client, error) {
	return rabbitmq.Open(url, "auth", []rabbitmq.Binding{
		{Kind: "direct", Exchange: "log", Queue: "write", RoutingKey: "write"},
	})
}
