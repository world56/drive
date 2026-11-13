package mq

import rabbitmq "common/rabbitmq"

func InitRabbitMQ(url string) (*rabbitmq.Client, error) {
	return rabbitmq.Open(url, "asset", []rabbitmq.Binding{
		{Kind: "direct", Exchange: "resource", Queue: "upload", RoutingKey: "upload"},
		{Kind: "direct", Exchange: "resource", Queue: "remove", RoutingKey: "remove"},
		{Kind: "direct", Exchange: "log", Queue: "write", RoutingKey: "write"},
	})
}
