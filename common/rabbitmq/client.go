package mq

import (
	"context"
	"errors"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"google.golang.org/protobuf/proto"
)

var ErrPublishNack = errors.New("mq: publish not acknowledged by broker")

type RabbitMQ struct {
	connection *amqp.Connection
}

type Publisher struct {
	channel *amqp.Channel
}

type Consumer struct {
	channel *amqp.Channel
}

type PublishOptions struct {
	Headers     amqp.Table
	Exchange    string
	RoutingKey  string
	ContentType string
	Body        []byte
	Message     proto.Message
}

// 连接mq
func Initialize(url, name string) (*RabbitMQ, error) {
	conn, err := amqp.DialConfig(url, amqp.Config{
		Heartbeat: 10 * time.Second,
		Locale:    "en_US",
		Properties: amqp.Table{
			"connection_name": name,
		},
		Dial: amqp.DefaultDial(5 * time.Second),
	})

	if err != nil {
		return nil, err
	}

	return &RabbitMQ{connection: conn}, nil
}

func (r *RabbitMQ) Close() error {
	if r == nil || r.connection == nil || r.connection.IsClosed() {
		return nil
	}

	return r.connection.Close()
}

// 绑定交换机队列
func (r *RabbitMQ) Ensure(kind, exchange, queue, routingKey string) error {
	ch, err := r.connection.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	if err := ch.ExchangeDeclare(exchange, kind, true, false, false, false, nil); err != nil {
		return err
	}

	if _, err := ch.QueueDeclare(queue, true, false, false, false, nil); err != nil {
		return err
	}

	return ch.QueueBind(queue, routingKey, exchange, false, nil)
}

// 生产
func (r *RabbitMQ) NewPublisher() (*Publisher, error) {
	ch, err := r.connection.Channel()
	if err != nil {
		return nil, err
	}

	if err := ch.Confirm(false); err != nil {
		ch.Close()
		return nil, err
	}

	return &Publisher{channel: ch}, nil
}

func (p *Publisher) Publish(c context.Context, opt PublishOptions) error {
	body, err := proto.Marshal(opt.Message)
	if err != nil {
		return err
	}
	opt.Body = body

	dc, err := p.channel.PublishWithDeferredConfirmWithContext(
		c,
		opt.Exchange,
		opt.RoutingKey,
		false,
		false,
		amqp.Publishing{
			Body:         opt.Body,
			Headers:      opt.Headers,
			DeliveryMode: amqp.Persistent,
			ContentType:  opt.ContentType,
			MessageId:    time.Now().Format("20060102150405.000000"),
		},
	)

	if err != nil {
		return err
	}

	ack, err := dc.WaitContext(c)
	if err != nil {
		return err
	}

	if !ack {
		return ErrPublishNack
	}

	return nil
}

func (p *Publisher) Close() error {
	if p == nil || p.channel == nil || p.channel.IsClosed() {
		return nil
	}

	return p.channel.Close()
}

// 消费
func (r *RabbitMQ) NewConsumer() (*Consumer, error) {
	ch, err := r.connection.Channel()
	if err != nil {
		return nil, err
	}

	// 公平分发
	if err := ch.Qos(1, 0, false); err != nil {
		ch.Close()
		return nil, err
	}

	return &Consumer{channel: ch}, nil
}

func (c *Consumer) Consume(queue, consumerTag string) (<-chan amqp.Delivery, error) {
	return c.channel.Consume(
		queue,
		consumerTag,
		false, false, false, false, nil,
	)
}

func (c *Consumer) Close() error {
	if c == nil || c.channel == nil || c.channel.IsClosed() {
		return nil
	}

	return c.channel.Close()
}
