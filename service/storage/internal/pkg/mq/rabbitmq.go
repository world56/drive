package mq

import (
	rabbitmq "common/rabbitmq"
	"context"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Client struct {
	conn      *rabbitmq.RabbitMQ
	consumer  *rabbitmq.Consumer
	publisher *rabbitmq.Publisher
}

func InitRabbitMQ(url string) (client *Client, err error) {
	conn, err := rabbitmq.Initialize(url, "storage")
	if err != nil {
		return nil, err
	}

	if err := conn.Ensure("direct", "resource", "upload", "upload"); err != nil {
		conn.Close()
		return nil, err
	}

	publisher, err := conn.NewPublisher()
	if err != nil {
		conn.Close()
		return nil, err
	}

	consumer, err := conn.NewConsumer()
	if err != nil {
		publisher.Close()
		conn.Close()
		return nil, err
	}
	return &Client{
		conn:      conn,
		publisher: publisher,
		consumer:  consumer,
	}, nil
}

func (c *Client) Close() {
	if c.publisher != nil {
		c.publisher.Close()
	}

	if c.conn != nil {
		c.consumer.Close()
	}

	if c.conn != nil {
		c.conn.Close()
	}
}

func (c *Client) Publish(ctx context.Context, opt rabbitmq.PublishOptions) error {
	return c.publisher.Publish(ctx, opt)
}

func (c *Client) Consume(queue, consumerTag string) (<-chan amqp.Delivery, error) {
	return c.consumer.Consume(queue, consumerTag)
}
