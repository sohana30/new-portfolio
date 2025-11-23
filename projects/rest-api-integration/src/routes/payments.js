const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripe');
const paypalService = require('../services/paypal');
const cacheMiddleware = require('../middleware/cache');
const logger = require('../utils/logger');

// Process Stripe payment
router.post('/stripe/charge', async (req, res, next) => {
    try {
        const { amount, currency, source, description } = req.body;

        const charge = await stripeService.createCharge({
            amount,
            currency: currency || 'usd',
            source,
            description
        });

        logger.info('Stripe charge created', { chargeId: charge.id, amount });

        res.json({
            success: true,
            chargeId: charge.id,
            amount: charge.amount,
            currency: charge.currency,
            status: charge.status
        });
    } catch (error) {
        next(error);
    }
});

// Process PayPal payment
router.post('/paypal/payment', async (req, res, next) => {
    try {
        const { amount, currency, description } = req.body;

        const payment = await paypalService.createPayment({
            amount,
            currency: currency || 'USD',
            description
        });

        logger.info('PayPal payment created', { paymentId: payment.id });

        res.json({
            success: true,
            paymentId: payment.id,
            approvalUrl: payment.links.find(link => link.rel === 'approval_url').href
        });
    } catch (error) {
        next(error);
    }
});

// Get payment status (with caching)
router.get('/status/:provider/:paymentId', cacheMiddleware(300), async (req, res, next) => {
    try {
        const { provider, paymentId } = req.params;

        let status;
        if (provider === 'stripe') {
            status = await stripeService.getChargeStatus(paymentId);
        } else if (provider === 'paypal') {
            status = await paypalService.getPaymentStatus(paymentId);
        } else {
            return res.status(400).json({ error: 'Invalid payment provider' });
        }

        res.json({ provider, paymentId, status });
    } catch (error) {
        next(error);
    }
});

// Refund payment
router.post('/refund', async (req, res, next) => {
    try {
        const { provider, paymentId, amount } = req.body;

        let refund;
        if (provider === 'stripe') {
            refund = await stripeService.createRefund(paymentId, amount);
        } else if (provider === 'paypal') {
            refund = await paypalService.createRefund(paymentId, amount);
        } else {
            return res.status(400).json({ error: 'Invalid payment provider' });
        }

        logger.info('Refund processed', { provider, paymentId, amount });

        res.json({
            success: true,
            refundId: refund.id,
            amount: refund.amount,
            status: refund.status
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
