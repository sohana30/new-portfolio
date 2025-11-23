const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const logger = require('./utils/logger');
const { redisClient } = require('./config/redis');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Import route handlers
const paymentRoutes = require('./routes/payments');
const shippingRoutes = require('./routes/shipping');
const crmRoutes = require('./routes/crm');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        redis: redisClient.isReady ? 'connected' : 'disconnected'
    });
});

// API Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await redisClient.quit();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    logger.info(`REST API Integration Hub running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
