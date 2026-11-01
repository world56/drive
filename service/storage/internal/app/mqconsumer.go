package app

import mqconsumer "storage/internal/transport/mq/consumer"

func (a *App) RunMQConsumer() error {
	return mqconsumer.RegisterMqConsumers(a.RabbitMQ, a.Service)
}
