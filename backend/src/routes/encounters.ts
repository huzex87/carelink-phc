import { Router, type Request, type Response } from 'express';
import { Encounter } from '../models/index.js';

const router = Router();

// Record Encounter
router.post('/', async (req: Request, res: Response) => {
    try {
        const encounter = await Encounter.create(req.body);
        res.status(201).json(encounter);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Get Encounters by Patient
router.get('/patient/:id', async (req: Request, res: Response) => {
    try {
        const encounters = await Encounter.findAll({
            where: { patient_id: req.params.id },
            order: [['date', 'DESC']]
        });
        res.json(encounters);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
