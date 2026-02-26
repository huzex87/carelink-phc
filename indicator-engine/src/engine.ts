import { Encounter } from '../../backend/src/models/encounter.js'; // Note: In a real project, these might be shared types

export interface IndicatorResult {
    id: string;
    name: string;
    value: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
    color: string;
}

export const IndicatorDefinitions = [
    {
        id: 'ANC_COVERAGE',
        name: 'ANC 1st Visit Coverage',
        calculate: (encounters: any[]) => encounters.filter(e => e.service_type === 'ANC' && e.data?.visitNumber === '1').length,
        target: 50
    },
    {
        id: 'OPD_UTILIZATION',
        name: 'Daily OPD Utilization',
        calculate: (encounters: any[]) => encounters.filter(e => e.service_type === 'OPD').length,
        target: 20
    },
    {
        id: 'IMM_COMPLETE',
        name: 'Immunization Completion',
        calculate: (encounters: any[]) => encounters.filter(e => e.service_type === 'IMM').length,
        target: 30
    }
];

export const processIndicators = (encounters: any[]): IndicatorResult[] => {
    return IndicatorDefinitions.map(def => {
        const value = def.calculate(encounters);
        return {
            id: def.id,
            name: def.name,
            value: value,
            target: def.target,
            trend: value > (def.target * 0.5) ? 'up' : 'stable',
            color: value >= def.target ? 'emerald' : 'sky'
        };
    });
};
