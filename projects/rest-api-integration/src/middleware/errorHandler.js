const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
            details: err.details
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or missing authentication'
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        error: err.name || 'Internal Server Error',
        message: process.env.NODE_ENV === 'production'
            ? 'An error occurred processing your request'
            : err.message
    });
};
