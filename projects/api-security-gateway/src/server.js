const express = require('express');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const rateLimiter = require('./middleware/rateLimiter');
const jwtMiddleware = require('./middleware/jwt');

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json());

// Rate limiting
app.use(rateLimiter);

// Routes
app.use('/auth', authRoutes);
app.use('/api', jwtMiddleware, protectedRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🔒 API Security Gateway running on port ${PORT}`);
});

module.exports = app;
