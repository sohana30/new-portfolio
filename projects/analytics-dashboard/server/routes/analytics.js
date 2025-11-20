const express = require('express');
const router = express.Router();
const Metric = require('../models/Metric');

// GET /api/metrics/summary
// Retrieve dashboard summary metrics
router.get('/summary', async (req, res) => {
    try {
        // Aggregation pipeline for real-time summary
        const summary = await Metric.aggregate([
            {
                $match: {
                    timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24h
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$revenue" },
                    activeUsers: { $max: "$activeUsers" },
                    avgResponseTime: { $avg: "$responseTime" },
                    totalTransactions: { $sum: 1 }
                }
            }
        ]);

        res.json(summary[0] || {
            totalRevenue: 0,
            activeUsers: 0,
            avgResponseTime: 0,
            totalTransactions: 0
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/metrics/revenue/:period
// Get revenue trends for visualization
router.get('/revenue/:period', async (req, res) => {
    try {
        const { period } = req.params;
        let groupBy;

        // Determine grouping based on period
        switch (period) {
            case 'day':
                groupBy = { $hour: "$timestamp" };
                break;
            case 'month':
                groupBy = { $dayOfMonth: "$timestamp" };
                break;
            default:
                groupBy = { $dayOfMonth: "$timestamp" };
        }

        const revenueTrend = await Metric.aggregate([
            {
                $group: {
                    _id: groupBy,
                    revenue: { $sum: "$revenue" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(revenueTrend);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
