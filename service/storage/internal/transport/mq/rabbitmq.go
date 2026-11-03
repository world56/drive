package mq

import rabbitmq "common/rabbitmq"

func InitRabbitMQ(url string) (*rabbitmq.Client, error) {
	return rabbitmq.Open(url, "storage", []rabbitmq.Binding{
		{Kind: "direct", Exchange: "resource", Queue: "upload", RoutingKey: "upload"},
		{Kind: "direct", Exchange: "resource", Queue: "remove", RoutingKey: "remove"},
	})
}
