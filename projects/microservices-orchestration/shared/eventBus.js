const amqp = require('amqplib');
const logger = require('./logger');

class EventBus {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.exchange = 'microservices_events';
    }

    async connect() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
            this.channel = await this.connection.createChannel();

            await this.channel.assertExchange(this.exchange, 'topic', { durable: true });

            logger.info('Connected to RabbitMQ');

            // Handle connection errors
            this.connection.on('error', (err) => {
                logger.error('RabbitMQ connection error', err);
            });

            this.connection.on('close', () => {
                logger.warn('RabbitMQ connection closed');
                setTimeout(() => this.connect(), 5000);
            });

        } catch (error) {
            logger.error('Failed to connect to RabbitMQ', error);
            setTimeout(() => this.connect(), 5000);
        }
    }

    async publish(eventType, data) {
        if (!this.channel) {
            throw new Error('Event bus not connected');
        }

        const message = {
            eventType,
            data,
            timestamp: new Date().toISOString(),
            eventId: require('uuid').v4()
        };

        this.channel.publish(
            this.exchange,
            eventType,
            Buffer.from(JSON.stringify(message)),
            { persistent: true }
        );

        logger.info(`Published event: ${eventType}`, { eventId: message.eventId });
    }

    async subscribe(eventType, handler) {
        if (!this.channel) {
            throw new Error('Event bus not connected');
        }

        const queue = await this.channel.assertQueue('', { exclusive: true });

        await this.channel.bindQueue(queue.queue, this.exchange, eventType);

        this.channel.consume(queue.queue, async (msg) => {
            if (msg) {
                try {
                    const event = JSON.parse(msg.content.toString());
                    logger.info(`Received event: ${eventType}`, { eventId: event.eventId });

                    await handler(event);

                    this.channel.ack(msg);
                } catch (error) {
                    logger.error(`Error handling event: ${eventType}`, error);
                    this.channel.nack(msg, false, false); // Dead letter queue
                }
            }
        });

        logger.info(`Subscribed to event: ${eventType}`);
    }

    async close() {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }
}

module.exports = new EventBus();
