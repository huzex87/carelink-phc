import React from 'react';
import { AlertTriangle, ShieldAlert, Activity, Info } from 'lucide-react';
import { clsx } from 'clsx';

export interface RiskAlert {
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    indicators: string[];
    timestamp: string;
}

interface RiskAlertSystemProps {
    alert?: RiskAlert;
}

const RiskAlertSystem: React.FC<RiskAlertSystemProps> = ({ alert }) => {
    if (!alert) {
        return (
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap">
                    <Activity size={14} /> Vital Signs Stable
                </div>
                <div className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap">
                    <Info size={14} /> Routine Screening Active
                </div>
            </div>
        );
    }

    const config = {
        LOW: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-100',
            icon: <Activity size={14} />,
            label: 'Stable (NEWS2: ' + alert.score + ')'
        },
        MEDIUM: {
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            border: 'border-amber-100',
            icon: <AlertTriangle size={14} />,
            label: 'Observation Required (NEWS2: ' + alert.score + ')'
        },
        HIGH: {
            bg: 'bg-red-50',
            text: 'text-red-700',
            border: 'border-red-100',
            icon: <ShieldAlert size={14} />,
            label: 'CRITICAL ALERT (NEWS2: ' + alert.score + ')'
        }
    };

    const current = config[alert.level];

    return (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <div className={clsx(
                "flex flex-col gap-2 p-4 rounded-2xl border shadow-sm transition-all",
                current.bg,
                current.text,
                current.border
            )}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                        {current.icon}
                        {current.label}
                    </div>
                    <span className="text-[10px] opacity-70">
                        Last Assessment: {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                </div>

                {alert.indicators.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {alert.indicators.map((ind, i) => (
                            <span key={i} className="bg-white/50 px-2 py-0.5 rounded-lg text-[10px] font-medium">
                                {ind}
                            </span>
                        ))}
                    </div>
                )}

                {alert.level === 'HIGH' && (
                    <div className="mt-2 text-xs font-bold flex gap-4">
                        <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                            Escalate to Medical Officer
                        </button>
                        <button className="bg-white/80 text-red-700 px-3 py-1.5 rounded-lg hover:bg-white transition-colors border border-red-200">
                            View Protocals
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiskAlertSystem;
