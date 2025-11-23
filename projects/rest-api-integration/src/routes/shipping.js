const express = require('express');
const router = express.Router();
const fedexService = require('../services/fedex');
const upsService = require('../services/ups');
const cacheMiddleware = require('../middleware/cache');
const logger = require('../utils/logger');

// Get shipping rates
router.post('/rates', async (req, res, next) => {
    try {
        const { carrier, origin, destination, package: pkg } = req.body;

        let rates;
        if (carrier === 'fedex') {
            rates = await fedexService.getRates(origin, destination, pkg);
        } else if (carrier === 'ups') {
            rates = await upsService.getRates(origin, destination, pkg);
        } else {
            return res.status(400).json({ error: 'Invalid carrier' });
        }

        res.json({ carrier, rates });
    } catch (error) {
        next(error);
    }
});

// Create shipment
router.post('/create', async (req, res, next) => {
    try {
        const { carrier, shipment } = req.body;

        let result;
        if (carrier === 'fedex') {
            result = await fedexService.createShipment(shipment);
        } else if (carrier === 'ups') {
            result = await upsService.createShipment(shipment);
        } else {
            return res.status(400).json({ error: 'Invalid carrier' });
        }

        logger.info('Shipment created', { carrier, trackingNumber: result.trackingNumber });

        res.json({
            success: true,
            trackingNumber: result.trackingNumber,
            label: result.label,
            cost: result.cost
        });
    } catch (error) {
        next(error);
    }
});

// Track shipment (with caching)
router.get('/track/:carrier/:trackingNumber', cacheMiddleware(60), async (req, res, next) => {
    try {
        const { carrier, trackingNumber } = req.params;

        let tracking;
        if (carrier === 'fedex') {
            tracking = await fedexService.trackShipment(trackingNumber);
        } else if (carrier === 'ups') {
            tracking = await upsService.trackShipment(trackingNumber);
        } else {
            return res.status(400).json({ error: 'Invalid carrier' });
        }

        res.json({ carrier, trackingNumber, tracking });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
