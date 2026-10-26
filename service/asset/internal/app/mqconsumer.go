package app

import mqconsumer "asset/internal/transport/mq/consumer"

func (a *App) RunMQConsumer() error {
	return mqconsumer.RegisterMQConsumers(a.RabbitMQ, a.Service)
}
