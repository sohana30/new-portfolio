const { RateLimiterRedis } = require('rate-limiter-flexible');
const { redisClient } = require('../config/redis');
const logger = require('../utils/logger');

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit',
    points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 || 60,
    blockDuration: 60
});

module.exports = async (req, res, next) => {
    try {
        const key = req.ip;
        await rateLimiter.consume(key);
        next();
    } catch (rejRes) {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);

        res.set({
            'Retry-After': rejRes.msBeforeNext / 1000,
            'X-RateLimit-Limit': rateLimiter.points,
            'X-RateLimit-Remaining': rejRes.remainingPoints,
            'X-RateLimit-Reset': new Date(Date.now() + rejRes.msBeforeNext).toISOString()
        });

        res.status(429).json({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: rejRes.msBeforeNext / 1000
        });
    }
};
