import React, { useState } from 'react';
import OPDForm from './OPDForm';
import ANCForm from './ANCForm';
import IMMForm from './IMMForm';
import NCDForm from './NCDForm';
import ReferralModule from '../patients/ReferralModule';
import ClinicalTimeline from '../../components/ClinicalTimeline';
import { User, ChevronLeft, Stethoscope, Baby, HeartPulse, ShieldCheck, Share2, Sparkles, Copy, X, Loader2 } from 'lucide-react';
import RiskAlertSystem, { RiskAlert } from '../clinician/RiskAlertSystem';

interface Patient {
    _id: string;
    name: string;
    sex: string;
    dob: string;
    unique_id: string;
    riskAlert?: RiskAlert; // Added risk alert data
}

interface EncounterDashboardProps {
    patient: Patient;
    onBack: () => void;
}

const EncounterDashboard: React.FC<EncounterDashboardProps> = ({ patient, onBack }) => {
    const [activeModule, setActiveModule] = useState<'selection' | 'OPD' | 'ANC' | 'IMM' | 'NCD' | 'REF'>('selection');
    const [showSummary, setShowSummary] = useState(false);
    const [summary, setSummary] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateSummary = async () => {
        setIsGenerating(true);
        setShowSummary(true);
        try {
            const response = await fetch('/api/v1/ai/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientId: patient._id }),
            });
            const data = await response.json();
            setSummary(data.summary);
        } catch (error) {
            setSummary('Failed to generate summary. Please ensure the AI service is online.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Mock high-risk alert for demonstration if it's a specific patient or just for the UI showcase
    const demoAlert: RiskAlert = {
        score: 7,
        level: 'HIGH',
        indicators: ['RR: 26', 'SpO2: 91%', 'Temp: 38.5°C'],
        timestamp: new Date().toISOString()
    };

    const modules = [
        { id: 'OPD', name: 'Outpatient (OPD)', icon: <Stethoscope size={24} />, color: 'text-primary', bg: 'bg-primary/10' },
        { id: 'ANC', name: 'Antenatal (ANC)', icon: <HeartPulse size={24} />, color: 'text-accent', bg: 'bg-accent/10' },
        { id: 'IMM', name: 'Immunization', icon: <Baby size={24} />, color: 'text-secondary', bg: 'bg-secondary/10' },
        { id: 'NCD', name: 'NCD Clinic', icon: <ShieldCheck size={24} />, color: 'text-orange-500', bg: 'bg-orange-50/50' },
        { id: 'REF', name: 'Referral', icon: <Share2 size={24} />, color: 'text-primary', bg: 'bg-primary/10' },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fade-in">
            {/* Patient Header */}
            <div className="glass-card p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-background rounded-full transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <div className="p-3 bg-primary/10 text-primary rounded-full">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{patient.name}</h2>
                            <div className="flex gap-4 text-sm text-text-muted mt-1">
                                <span className="font-mono font-bold text-primary">{patient.unique_id}</span>
                                <span>{patient.sex === 'M' ? 'Male' : 'Female'}</span>
                                <span>DOB: {new Date(patient.dob).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={generateSummary}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all"
                    >
                        <Sparkles size={18} />
                        AI Discharge Summary
                    </button>
                </div>

                {/* Dynamic Patient Risk Alert System */}
                <RiskAlertSystem alert={patient.name.includes('Sani') ? demoAlert : undefined} />
            </div>

            {activeModule === 'selection' ? (
                <div>
                    <h3 className="text-xl font-bold mb-6">Select Service Module</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {modules.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setActiveModule(m.id as any)}
                                className="glass-card p-8 flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-all hover:scale-[1.02] cursor-pointer group"
                            >
                                <div className={`p-4 ${m.bg} ${m.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                                    {m.icon}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">{m.name}</h4>
                                    <p className="text-sm text-text-muted">Record clinical encounter for {m.id} module</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-12 scale-in">
                        <ClinicalTimeline
                            events={[
                                { id: 'evt-1', type: 'OPD', title: 'Malaria Treatment', subtitle: 'Dr. Isah Muhammed | Kano Municipal PHC', date: '2026-02-24', details: 'Positive RDT, Artemether/Lumefantrine prescribed' },
                                { id: 'evt-2', type: 'LAB', title: 'Malaria RDT', subtitle: 'Lab Tech Habu | Kano Municipal PHC', date: '2026-02-24', status: 'verified', details: 'Result: POSITIVE (+++)' },
                                { id: 'evt-3', type: 'RX', title: 'Antimalarial Dispensed', subtitle: 'Pharmacist Yusuf | Central Dispensary', date: '2026-02-24', details: 'Artemether/Lumefantrine (20/120mg)' },
                                { id: 'evt-4', type: 'REF', title: 'General Referral', subtitle: 'to Murtala Muhammad SH', date: '2026-02-20', status: 'accepted', details: 'Severe persistent symptoms for tertiary consultation' },
                            ]}
                        />
                    </div>
                </div>
            ) : activeModule === 'OPD' ? (
                <div className="glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold">OPD Encounter</h3>
                        <button onClick={() => setActiveModule('selection')} className="text-sm text-primary font-bold hover:underline">Change Module</button>
                    </div>
                    <OPDForm patientId={patient.unique_id} onComplete={() => setActiveModule('selection')} />
                </div>
            ) : activeModule === 'ANC' ? (
                <div className="glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold">ANC Visit</h3>
                        <button onClick={() => setActiveModule('selection')} className="text-sm text-primary font-bold hover:underline">Change Module</button>
                    </div>
                    <ANCForm patientId={patient.unique_id} onComplete={() => setActiveModule('selection')} />
                </div>
            ) : activeModule === 'IMM' ? (
                <div className="glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold">Immunization</h3>
                        <button onClick={() => setActiveModule('selection')} className="text-sm text-primary font-bold hover:underline">Change Module</button>
                    </div>
                    <IMMForm patientId={patient.unique_id} onComplete={() => setActiveModule('selection')} />
                </div>
            ) : activeModule === 'NCD' ? (
                <div className="glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold">NCD Clinic</h3>
                        <button onClick={() => setActiveModule('selection')} className="text-sm text-primary font-bold hover:underline">Change Module</button>
                    </div>
                    <NCDForm patientId={patient.unique_id} onComplete={() => setActiveModule('selection')} />
                </div>
            ) : activeModule === 'REF' ? (
                <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-8 px-6">
                        <h3 className="text-2xl font-bold">Patient Referral</h3>
                        <button onClick={() => setActiveModule('selection')} className="text-sm text-primary font-bold hover:underline">Change Module</button>
                    </div>
                    <ReferralModule />
                </div>
            ) : null}

            {/* AI Summary Modal */}
            {showSummary && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card w-full max-w-2xl overflow-hidden shadow-2xl scale-in">
                        <div className="p-6 border-b border-border/40 flex items-center justify-between bg-primary/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                    <Sparkles size={20} />
                                </div>
                                <h3 className="text-xl font-bold">AI Clinical Summary</h3>
                            </div>
                            <button onClick={() => setShowSummary(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto">
                            {isGenerating ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <Loader2 className="animate-spin text-primary" size={40} />
                                    <p className="text-text-muted font-medium animate-pulse">Analyzing clinical history and generating insights...</p>
                                </div>
                            ) : (
                                <div className="prose prose-slate max-w-none whitespace-pre-wrap font-medium text-text-main leading-relaxed">
                                    {summary}
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-border/40 bg-surface-muted flex justify-end gap-4">
                            {!isGenerating && (
                                <button 
                                    onClick={() => navigator.clipboard.writeText(summary)}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-lg transition-colors font-bold text-sm"
                                >
                                    <Copy size={16} /> Copy to Clipboard
                                </button>
                            )}
                            <button 
                                onClick={() => setShowSummary(false)}
                                className="px-6 py-2.5 bg-text-main text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EncounterDashboard;
