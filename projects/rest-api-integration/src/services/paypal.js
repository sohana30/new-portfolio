const axios = require('axios');
const logger = require('../utils/logger');

class PayPalService {
    constructor() {
        this.clientId = process.env.PAYPAL_CLIENT_ID;
        this.secret = process.env.PAYPAL_SECRET;
        this.baseURL = process.env.PAYPAL_MODE === 'live'
            ? 'https://api.paypal.com'
            : 'https://api.sandbox.paypal.com';
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async getAccessToken() {
        if (this.accessToken && this.tokenExpiry > Date.now()) {
            return this.accessToken;
        }

        try {
            const response = await axios.post(
                `${this.baseURL}/v1/oauth2/token`,
                'grant_type=client_credentials',
                {
                    auth: {
                        username: this.clientId,
                        password: this.secret
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

            return this.accessToken;
        } catch (error) {
            logger.error('Failed to get PayPal access token', { error: error.message });
            throw error;
        }
    }

    async createPayment({ amount, currency, description }) {
        try {
            const token = await this.getAccessToken();

            const response = await axios.post(
                `${this.baseURL}/v1/payments/payment`,
                {
                    intent: 'sale',
                    payer: { payment_method: 'paypal' },
                    transactions: [{
                        amount: {
                            total: amount.toFixed(2),
                            currency
                        },
                        description
                    }],
                    redirect_urls: {
                        return_url: process.env.PAYPAL_RETURN_URL || 'http://localhost:3000/success',
                        cancel_url: process.env.PAYPAL_CANCEL_URL || 'http://localhost:3000/cancel'
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            logger.error('PayPal payment creation failed', { error: error.message });
            throw new Error(`PayPal API Error: ${error.response?.data?.message || error.message}`);
        }
    }

    async getPaymentStatus(paymentId) {
        try {
            const token = await this.getAccessToken();

            const response = await axios.get(
                `${this.baseURL}/v1/payments/payment/${paymentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            return {
                id: response.data.id,
                state: response.data.state,
                amount: response.data.transactions[0].amount.total,
                currency: response.data.transactions[0].amount.currency
            };
        } catch (error) {
            logger.error('Failed to get PayPal payment status', { paymentId, error: error.message });
            throw error;
        }
    }

    async createRefund(saleId, amount) {
        try {
            const token = await this.getAccessToken();

            const refundData = amount ? { amount: { total: amount.toFixed(2), currency: 'USD' } } : {};

            const response = await axios.post(
                `${this.baseURL}/v1/payments/sale/${saleId}/refund`,
                refundData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                id: response.data.id,
                amount: response.data.amount.total,
                status: response.data.state
            };
        } catch (error) {
            logger.error('PayPal refund failed', { saleId, error: error.message });
            throw error;
        }
    }
}

module.exports = new PayPalService();
