import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import logger from '../config/logger.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * AI Assistant Service
 * Provides clinical intelligence using Gemini 1.5 Flash.
 */
export class AIAssistantService {
    /**
     * Generates a professional longitudinal discharge summary.
     */
    static async generateDischargeSummary(patientData: any, encounters: any[]): Promise<string> {
        if (!env.GEMINI_API_KEY) {
            return "AI Service Unavailable: Gemini API Key missing.";
        }

        const prompt = `
            You are a professional clinical assistant for CareLink PHC. 
            Generate a concise, longitudinal discharge summary for the following patient.
            
            Patient: ${JSON.stringify(patientData)}
            Encounter History: ${JSON.stringify(encounters)}
            
            The summary should include:
            - Reason for last visit
            - Brief clinical history
            - Current medications/treatments
            - Follow-up recommendations
            
            Format: Professional Medical Note Header.
        `;

        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            logger.error(`[AI-SUMMARY] Error: ${error}`);
            throw new Error('Failed to generate clinical summary');
        }
    }

    /**
     * Suggests ICD-10 codes based on symptoms and clinical notes.
     */
    static async suggestICD10Code(clinicalNote: string): Promise<{ code: string; description: string; confidence: number }[]> {
        if (!env.GEMINI_API_KEY) {
            return [];
        }

        const prompt = `
            Analyze the following clinical note and suggest the top 3 most relevant ICD-10-CM codes.
            Note: "${clinicalNote}"
            
            Return ONLY a JSON array of objects with keys: "code", "description", "confidence" (0-1).
        `;

        try {
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            // Clean markdown if present
            const jsonStr = responseText.replace(/```json|```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            logger.error(`[AI-ICD10] Error: ${error}`);
            return [];
        }
    }
}
