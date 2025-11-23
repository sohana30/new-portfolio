const express = require('express');
const eventBus = require('../../shared/eventBus');
const logger = require('../../shared/logger');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// In-memory order storage
const orders = new Map();

// Create order endpoint
app.post('/orders', async (req, res) => {
    try {
        const { customerId, items, total } = req.body;

        const order = {
            id: uuidv4(),
            customerId,
            items,
            total,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };

        orders.set(order.id, order);

        // Publish OrderCreated event
        await eventBus.publish('OrderCreated', {
            orderId: order.id,
            customerId,
            items,
            total
        });

        logger.info('Order created', { orderId: order.id });

        res.status(201).json(order);
    } catch (error) {
        logger.error('Failed to create order', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get order status
app.get('/orders/:id', (req, res) => {
    const order = orders.get(req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
});

// Subscribe to events
async function setupEventHandlers() {
    await eventBus.connect();

    // Handle payment completed
    await eventBus.subscribe('PaymentCompleted', async (event) => {
        const order = orders.get(event.data.orderId);
        if (order) {
            order.status = 'CONFIRMED';
            order.paymentId = event.data.paymentId;
            logger.info('Order confirmed', { orderId: order.id });
        }
    });

    // Handle payment failed
    await eventBus.subscribe('PaymentFailed', async (event) => {
        const order = orders.get(event.data.orderId);
        if (order) {
            order.status = 'FAILED';
            order.failureReason = event.data.reason;
            logger.warn('Order failed', { orderId: order.id });

            // Publish compensation event
            await eventBus.publish('CancelInventoryReservation', {
                orderId: order.id
            });
        }
    });
}

const PORT = process.env.ORDER_SERVICE_PORT || 3001;

app.listen(PORT, async () => {
    logger.info(`Order Service running on port ${PORT}`);
    await setupEventHandlers();
});

module.exports = app;
