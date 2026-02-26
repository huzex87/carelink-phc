import { Router, type Request, type Response } from 'express';
import { Encounter } from '../models/index.js';
import { processIndicators } from '../../../indicator-engine/src/engine.js';
import { syncManager, ADXTransformer } from '../services/dhis2.js';

const router = Router();

// Get Facility Analytics
router.get('/facility', async (req: Request, res: Response) => {
    try {
        const encounters = await Encounter.findAll();
        const stats = processIndicators(encounters);

        // Simulate trend data
        const analyticsData = {
            summary: stats,
            trends: [
                { day: 'Mon', value: 12 },
                { day: 'Tue', value: 19 },
                { day: 'Wed', value: 15 },
                { day: 'Thu', value: 22 },
                { day: 'Fri', value: 30 },
                { day: 'Sat', value: 10 },
                { day: 'Sun', value: 8 },
            ]
        };

        res.json(analyticsData);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Trigger DHIS2 Sync
router.post('/sync/dhis2', async (req: Request, res: Response) => {
    try {
        const encounters = await Encounter.findAll();
        const stats = processIndicators(encounters);

        // Transform to ADX
        const adxPayload = ADXTransformer.toADX(stats, 'FACILITY-001', '202602');

        // Queue for sync
        await syncManager.addToQueue(adxPayload);

        res.json({
            message: 'Sync job queued successfully',
            payloadPreview: adxPayload.substring(0, 150) + '...'
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
