const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect();

const verify = promisify(jwt.verify);

// Load keys from environment
const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY || 'your-public-key';
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || 'your-private-key';

module.exports = async (req, res, next) => {
    try {
        // Extract token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7);

        // Check if token is revoked
        const isRevoked = await redisClient.get(`revoked:${token}`);
        if (isRevoked) {
            return res.status(401).json({ error: 'Token has been revoked' });
        }

        // Verify token
        const decoded = await verify(token, PUBLIC_KEY, {
            algorithms: ['RS256']
        });

        // Attach user to request
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            permissions: decoded.permissions || []
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
};
