package mq

import (
	"context"
	"errors"
	"sync"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

var (
	errClosed         = errors.New("mq closed")
	ErrInvalidMessage = errors.New("mq invalid message")
)

const maxRetry = 5

type Binding struct {
	Kind       string
	Exchange   string
	Queue      string
	RoutingKey string
}

type Client struct {
	url      string
	name     string
	bindings []Binding

	conn      *RabbitMQ
	publisher *Publisher
	consumer  *Consumer

	closed bool
	mu     sync.Mutex
	pubMu  sync.Mutex
	stop   chan struct{}
}

// 创建客户端
func Open(url, name string, bindings []Binding) (*Client, error) {
	client := &Client{
		url:      url,
		name:     name,
		bindings: bindings,
		stop:     make(chan struct{}),
	}
	if err := client.connect(); err != nil {
		return nil, err
	}

	return client, nil
}

func (c *Client) Serve(queue, consumerTag string, handle func(context.Context, amqp.Delivery) error) error {
	backoff := time.Second
	for {
		deliveries, err := c.consume(queue, consumerTag)
		if err != nil {
			if errors.Is(err, errClosed) || !c.wait(backoff) {
				return errClosed
			}
			backoff = grow(backoff)
			continue
		}
		backoff = time.Second
		for d := range deliveries {
			err := handle(context.Background(), d)
			if err == nil {
				_ = d.Ack(false)
				continue
			}
			if errors.Is(err, ErrInvalidMessage) || retries(d.Headers) >= maxRetry {
				_ = d.Nack(false, false)
				continue
			}
			if c.requeue(d) != nil {
				_ = d.Nack(false, true)
				continue
			}
			_ = d.Ack(false)
		}
		if !c.wait(time.Second) {
			return errClosed
		}
	}
}

func (c *Client) requeue(d amqp.Delivery) error {
	headers := make(amqp.Table, len(d.Headers)+1)
	for k, v := range d.Headers {
		headers[k] = v
	}
	headers["x-retry"] = int32(retries(d.Headers) + 1)

	if err := c.connect(); err != nil {
		return err
	}
	c.mu.Lock()
	publisher := c.publisher
	c.mu.Unlock()
	if publisher == nil {
		return amqp.ErrClosed
	}
	c.pubMu.Lock()
	defer c.pubMu.Unlock()
	return publisher.publish(context.Background(), d.Exchange, d.RoutingKey, amqp.Publishing{
		Body:         d.Body,
		Headers:      headers,
		DeliveryMode: amqp.Persistent,
		ContentType:  d.ContentType,
		MessageId:    d.MessageId,
	})
}

func retries(headers amqp.Table) int {
	switch n := headers["x-retry"].(type) {
	case int:
		return n
	case int32:
		return int(n)
	case int64:
		return int(n)
	default:
		return 0
	}
}

func (c *Client) Publish(ctx context.Context, opt PublishOptions) error {
	var err error
	for range 2 {
		if err := c.connect(); err != nil {
			return err
		}
		c.mu.Lock()
		conn, publish := c.conn, c.publisher
		c.mu.Unlock()
		if publish == nil {
			err = amqp.ErrClosed
		} else {
			c.pubMu.Lock()
			err = publish.Publish(ctx, opt)
			c.pubMu.Unlock()
		}
		if err == nil || !broke(err) {
			return err
		}
		c.drop(conn)
	}
	return err
}

// 关闭客户端，释放资源
func (c *Client) Close() {
	c.mu.Lock()
	if c.closed {
		c.mu.Unlock()
		return
	}
	c.closed = true
	close(c.stop)

	publisher, consumer, conn := c.publisher, c.consumer, c.conn
	c.publisher, c.consumer, c.conn = nil, nil, nil
	c.mu.Unlock()

	if publisher != nil {
		publisher.Close()
	}
	if consumer != nil {
		consumer.Close()
	}
	if conn != nil {
		conn.Close()
	}
}

func (c *Client) consume(queue, consumerTag string) (<-chan amqp.Delivery, error) {
	if err := c.connect(); err != nil {
		return nil, err
	}

	c.mu.Lock()
	conn := c.conn
	c.mu.Unlock()
	if conn == nil {
		return nil, amqp.ErrClosed
	}

	consumer, err := conn.NewConsumer()
	if err != nil {
		c.drop(conn)
		return nil, err
	}

	c.mu.Lock()
	if c.consumer != nil {
		c.consumer.Close()
	}

	c.consumer = consumer
	c.mu.Unlock()
	return consumer.Consume(queue, consumerTag)
}

func (c *Client) connect() error {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.closed {
		return errClosed
	}
	if c.conn != nil && c.publisher != nil {
		return nil
	}

	conn, err := Initialize(c.url, c.name)
	if err != nil {
		return err
	}
	for _, b := range c.bindings {
		if err := conn.Ensure(b.Kind, b.Exchange, b.Queue, b.RoutingKey); err != nil {
			conn.Close()
			return err
		}
	}

	publisher, err := conn.NewPublisher()
	if err != nil {
		conn.Close()
		return err
	}

	c.conn, c.publisher = conn, publisher
	go func() {
		<-conn.NotifyClose()
		c.drop(conn)
	}()

	return nil
}

func (c *Client) drop(conn *RabbitMQ) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.conn != conn {
		return
	}
	if c.publisher != nil {
		c.publisher.Close()
	}
	c.publisher, c.conn = nil, nil
	conn.Close()
}

func (c *Client) wait(d time.Duration) bool {
	timer := time.NewTimer(d)
	defer timer.Stop()
	select {
	case <-c.stop:
		return false
	case <-timer.C:
		return true
	}
}

func broke(err error) bool {
	var amqpErr *amqp.Error
	return errors.Is(err, amqp.ErrClosed) || errors.As(err, &amqpErr)
}

func grow(d time.Duration) time.Duration {
	if d *= 2; d > 30*time.Second {
		return 30 * time.Second
	}
	return d
}
