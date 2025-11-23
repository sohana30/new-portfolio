const express = require('express');
const router = express.Router();

// Protected endpoint example
router.get('/data', (req, res) => {
    res.json({
        message: 'This is protected data',
        user: req.user
    });
});

router.get('/profile', (req, res) => {
    res.json({
        id: req.user.id,
        email: req.user.email,
        permissions: req.user.permissions
    });
});

module.exports = router;
