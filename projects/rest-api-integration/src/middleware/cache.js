const { redisClient } = require('../config/redis');
const logger = require('../utils/logger');

module.exports = (ttl = 300) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl}`;

        try {
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                logger.info('Cache hit', { key });
                return res.json(JSON.parse(cachedData));
            }

            // Store original res.json
            const originalJson = res.json.bind(res);

            // Override res.json to cache the response
            res.json = (data) => {
                redisClient.setEx(key, ttl, JSON.stringify(data))
                    .catch(err => logger.error('Cache set error', { error: err.message }));

                logger.info('Cache miss - storing', { key, ttl });
                return originalJson(data);
            };

            next();
        } catch (error) {
            logger.error('Cache middleware error', { error: error.message });
            next();
        }
    };
};
