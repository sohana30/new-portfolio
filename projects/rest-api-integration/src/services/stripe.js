const axios = require('axios');
const logger = require('../utils/logger');

class StripeService {
    constructor() {
        this.apiKey = process.env.STRIPE_API_KEY;
        this.baseURL = 'https://api.stripe.com/v1';
        this.client = axios.create({
            baseURL: this.baseURL,
            auth: {
                username: this.apiKey,
                password: ''
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    async createCharge({ amount, currency, source, description }) {
        try {
            const params = new URLSearchParams({
                amount: amount * 100, // Convert to cents
                currency,
                source,
                description
            });

            const response = await this.client.post('/charges', params);
            return response.data;
        } catch (error) {
            logger.error('Stripe charge failed', { error: error.message });
            throw new Error(`Stripe API Error: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    async getChargeStatus(chargeId) {
        try {
            const response = await this.client.get(`/charges/${chargeId}`);
            return {
                id: response.data.id,
                amount: response.data.amount / 100,
                currency: response.data.currency,
                status: response.data.status,
                paid: response.data.paid
            };
        } catch (error) {
            logger.error('Failed to get Stripe charge status', { chargeId, error: error.message });
            throw error;
        }
    }

    async createRefund(chargeId, amount) {
        try {
            const params = new URLSearchParams({
                charge: chargeId
            });

            if (amount) {
                params.append('amount', amount * 100);
            }

            const response = await this.client.post('/refunds', params);
            return {
                id: response.data.id,
                amount: response.data.amount / 100,
                status: response.data.status
            };
        } catch (error) {
            logger.error('Stripe refund failed', { chargeId, error: error.message });
            throw error;
        }
    }
}

module.exports = new StripeService();
