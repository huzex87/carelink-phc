import { Router, type Request, type Response } from 'express';
import { AIAssistantService } from '../services/aiAssistantService.js';
import { Encounter, Patient } from '../models/index.js';
import logger from '../config/logger.js';

const router = Router();

/**
 * @openapi
 * /api/v1/ai/summary:
 *   post:
 *     description: Generate a professional AI-driven clinical discharge summary.
 *     responses:
 *       200:
 *         description: Summary generated successfully.
 */
router.post('/summary', async (req: Request, res: Response) => {
    try {
        const { patientId } = req.body;
        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        const patient = await Patient.findByPk(patientId);
        const encounters = await Encounter.findAll({
            where: { patient_id: patientId },
            order: [['date', 'DESC']],
            limit: 10
        });

        const summary = await AIAssistantService.generateDischargeSummary(patient, encounters);
        res.json({ summary });
    } catch (error: any) {
        logger.error(`[AI-ROUTE] Summary Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
});

/**
 * @openapi
 * /api/v1/ai/icd10-suggest:
 *   post:
 *     description: Suggest top 3 ICD-10 codes based on clinical symptoms.
 *     responses:
 *       200:
 *         description: ICD-10 suggestions returned.
 */
router.post('/icd10-suggest', async (req: Request, res: Response) => {
    try {
        const { note } = req.body;
        if (!note) {
            return res.status(400).json({ error: 'Clinical note is required' });
        }

        const suggestions = await AIAssistantService.suggestICD10Code(note);
        res.json({ suggestions });
    } catch (error: any) {
        logger.error(`[AI-ROUTE] ICD10 Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to get suggestions' });
    }
});

export default router;
