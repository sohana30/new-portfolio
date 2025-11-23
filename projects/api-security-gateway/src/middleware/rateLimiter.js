const { RateLimiterRedis } = require('rate-limiter-flexible');
const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect();

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit',
    points: 100, // Number of requests
    duration: 60, // Per 60 seconds
    blockDuration: 60 // Block for 60 seconds if exceeded
});

module.exports = async (req, res, next) => {
    try {
        const key = req.ip;
        const rateLimitRes = await rateLimiter.consume(key);

        res.set({
            'X-RateLimit-Limit': 100,
            'X-RateLimit-Remaining': rateLimitRes.remainingPoints,
            'X-RateLimit-Reset': new Date(Date.now() + rateLimitRes.msBeforeNext).toISOString()
        });

        next();
    } catch (error) {
        res.set({
            'Retry-After': Math.ceil(error.msBeforeNext / 1000)
        });

        res.status(429).json({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded',
            retryAfter: Math.ceil(error.msBeforeNext / 1000)
        });
    }
};
