const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Mock user database
const users = new Map();
users.set('user@example.com', {
    id: '1',
    email: 'user@example.com',
    password: '$2b$10$XqjY8Z.N5vZ8Z8Z8Z8Z8ZuK8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', // 'password123'
    permissions: ['read', 'write']
});

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || 'your-private-key';

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.get(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate access token
        const accessToken = jwt.sign(
            {
                sub: user.id,
                email: user.email,
                permissions: user.permissions
            },
            PRIVATE_KEY,
            {
                algorithm: 'RS256',
                expiresIn: '15m',
                issuer: 'api-gateway',
                jti: uuidv4()
            }
        );

        // Generate refresh token
        const refreshToken = jwt.sign(
            { sub: user.id },
            PRIVATE_KEY,
            {
                algorithm: 'RS256',
                expiresIn: '30d',
                jti: uuidv4()
            }
        );

        res.json({
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: 'Bearer',
            expires_in: 900
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Token refresh endpoint
router.post('/refresh', async (req, res) => {
    try {
        const { refresh_token } = req.body;

        const decoded = jwt.verify(refresh_token, process.env.JWT_PUBLIC_KEY || 'your-public-key');

        const user = Array.from(users.values()).find(u => u.id === decoded.sub);
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Generate new access token
        const accessToken = jwt.sign(
            {
                sub: user.id,
                email: user.email,
                permissions: user.permissions
            },
            PRIVATE_KEY,
            {
                algorithm: 'RS256',
                expiresIn: '15m',
                jti: uuidv4()
            }
        );

        res.json({
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: 900
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

module.exports = router;
