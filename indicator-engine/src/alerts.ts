import { Encounter } from './engine.js';

export interface EpidemicAlert {
    id: string;
    disease: string;
    count: number;
    threshold: number;
    facility_id: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * ML-lite Anomaly Detection Service
 * Analyzes encounter data for statistical spikes in morbidity categories.
 */
export class AnomalyDetector {
    private static THRESHOLDS: Record<string, number> = {
        'Malaria': 50,    // Cases per 24 hours per facility
        'Cholera': 1,     // Zero-tolerance
        'Measles': 2,
        'Meningitis': 1
    };

    static analyze(encounters: any[]): EpidemicAlert[] {
        const alerts: EpidemicAlert[] = [];
        const diseaseGroups: Record<string, any[]> = {};

        // Grouping by diagnosis (simulated extraction from encounter data)
        encounters.forEach(e => {
            const diagnosis = e.data?.diagnosis || 'Unknown';
            if (!diseaseGroups[diagnosis]) diseaseGroups[diagnosis] = [];
            diseaseGroups[diagnosis].push(e);
        });

        Object.entries(diseaseGroups).forEach(([disease, instances]) => {
            const threshold = this.THRESHOLDS[disease] || 100;
            if (instances.length >= threshold) {
                alerts.push({
                    id: `ALERT-${Date.now()}-${disease}`,
                    disease: disease,
                    count: instances.length,
                    threshold: threshold,
                    facility_id: instances[0].facility_id,
                    timestamp: new Date().toISOString(),
                    severity: this.calculateSeverity(instances.length, threshold)
                });
            }
        });

        return alerts;
    }

    private static calculateSeverity(count: number, threshold: number): 'low' | 'medium' | 'high' | 'critical' {
        const ratio = count / threshold;
        if (ratio >= 3) return 'critical';
        if (ratio >= 2) return 'high';
        if (ratio >= 1.5) return 'medium';
        return 'low';
    }
}
