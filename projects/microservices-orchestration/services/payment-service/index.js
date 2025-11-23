const express = require('express');
const eventBus = require('../../shared/eventBus');
const logger = require('../../shared/logger');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// In-memory payment storage
const payments = new Map();

async function setupEventHandlers() {
    await eventBus.connect();

    // Handle OrderCreated event
    await eventBus.subscribe('OrderCreated', async (event) => {
        const { orderId, customerId, total } = event.data;

        logger.info('Processing payment for order', { orderId, total });

        // Simulate payment processing
        const success = Math.random() > 0.2; // 80% success rate

        const payment = {
            id: uuidv4(),
            orderId,
            customerId,
            amount: total,
            status: success ? 'COMPLETED' : 'FAILED',
            timestamp: new Date().toISOString()
        };

        payments.set(payment.id, payment);

        // Publish result event
        if (success) {
            await eventBus.publish('PaymentCompleted', {
                orderId,
                paymentId: payment.id,
                amount: total
            });
            logger.info('Payment completed', { paymentId: payment.id });
        } else {
            await eventBus.publish('PaymentFailed', {
                orderId,
                reason: 'Insufficient funds'
            });
            logger.warn('Payment failed', { orderId });
        }
    });
}

const PORT = process.env.PAYMENT_SERVICE_PORT || 3002;

app.listen(PORT, async () => {
    logger.info(`Payment Service running on port ${PORT}`);
    await setupEventHandlers();
});

module.exports = app;
