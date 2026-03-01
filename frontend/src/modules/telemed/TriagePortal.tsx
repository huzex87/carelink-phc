import React, { useState } from 'react';
import { User, Activity, AlertCircle, CheckCircle2, MessageSquare, Video, Phone, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

interface TriageCase {
    id: string;
    patientName: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    sourceFacility: string;
    vitalSummary: string;
    status: 'pending' | 'reviewed';
    timestamp: string;
}

const TriagePortal: React.FC = () => {
    const [selectedCase, setSelectedCase] = useState<TriageCase | null>(null);

    const cases: TriageCase[] = [
        { id: '1', patientName: 'Sani Abba', priority: 'HIGH', sourceFacility: 'Kano Municipal PHC', vitalSummary: 'NEWS2: 7 | RR: 26, SpO2: 91%', status: 'pending', timestamp: '2026-03-01T10:30:00Z' },
        { id: '2', patientName: 'Fatima Yusuf', priority: 'MEDIUM', sourceFacility: 'Fagge PHC', vitalSummary: 'NEWS2: 4 | Temp: 38.5°C', status: 'pending', timestamp: '2026-03-01T11:15:00Z' },
        { id: '3', patientName: 'Ibrahim Musa', priority: 'LOW', sourceFacility: 'Dala PHC', vitalSummary: 'Routine follow-up for NCD', status: 'reviewed', timestamp: '2026-03-01T09:00:00Z' }
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
            {/* Case List */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <h4 className="text-lg font-bold mb-2">Incoming Triage Queue</h4>
                {cases.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => setSelectedCase(c)}
                        className={clsx(
                            "glass-card p-4 text-left transition-all hover:border-primary/50 border-l-4",
                            selectedCase?.id === c.id ? "border-primary bg-primary/5" : "border-transparent",
                            c.priority === 'HIGH' ? "border-l-red-500" : c.priority === 'MEDIUM' ? "border-l-amber-500" : "border-l-emerald-500"
                        )}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold">{c.patientName}</span>
                            <span className={clsx(
                                "text-[10px] px-2 py-0.5 rounded-full font-bold",
                                c.priority === 'HIGH' ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                            )}>
                                {c.priority}
                            </span>
                        </div>
                        <div className="text-xs text-text-muted mb-1">{c.sourceFacility}</div>
                        <div className="text-[10px] text-text-muted">{new Date(c.timestamp).toLocaleTimeString()}</div>
                    </button>
                ))}
            </div>

            {/* Case Detail View */}
            <div className="w-full lg:w-2/3 glass-card p-8 flex flex-col justify-between">
                {selectedCase ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex gap-4">
                                <div className="p-4 bg-primary/10 text-primary rounded-2xl h-fit">
                                    <User size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{selectedCase.patientName}</h3>
                                    <p className="text-sm text-text-muted">{selectedCase.sourceFacility}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-md">
                                    <Video size={18} />
                                </button>
                                <button className="p-3 bg-background text-text rounded-xl border hover:border-primary transition-all">
                                    <Phone size={18} />
                                </button>
                                <button className="p-3 bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-all shadow-md">
                                    <MessageSquare size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-background/50 p-4 rounded-2xl border">
                                <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Activity size={12} /> Clinical Summary
                                </h5>
                                <p className="text-sm font-medium">{selectedCase.vitalSummary}</p>
                            </div>
                            <div className="bg-background/50 p-4 rounded-2xl border">
                                <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <AlertCircle size={12} /> Pending Decision
                                </h5>
                                <p className="text-sm font-medium italic">Require sign-off for Secondary Care Referral</p>
                            </div>
                        </div>

                        <div className="flex-1 border-2 border-dashed border-background rounded-3xl p-6 flex items-center justify-center text-text-muted mb-8">
                            <div className="text-center">
                                <ExternalLink size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm font-medium italic">Longitudinal Patient Timeline Syncing...</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-auto">
                            <button className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2">
                                <CheckCircle2 size={18} /> Approve Clinical Protocol
                            </button>
                            <button className="flex-1 bg-red-50 text-red-700 py-4 rounded-2xl font-bold border border-red-100 hover:bg-red-100 transition-all">
                                Flag for Urgent Review
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted text-center italic">
                        <Activity size={48} className="mb-4 opacity-20" />
                        <p>Select a case from the queue to start triage</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TriagePortal;
