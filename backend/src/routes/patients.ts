import { Router } from 'express';
import { Patient } from '../models/index.js';

const router = Router();

// Register Patient
router.post('/', async (req, res) => {
    try {
        const patient = await Patient.create(req.body);
        res.status(201).json(patient);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Get Patient by ID
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        res.json(patient);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Search Patients (Server-side fallback)
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        // Basic search implementation
        const patients = await Patient.findAll({
            where: {
                name: {
                    [Symbol.for('raw')]: `LIKE '%${query}%'`
                }
            }
        });
        res.json(patients);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
