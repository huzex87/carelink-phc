import React, { useState } from 'react';
import OPDForm from './OPDForm';
import ANCForm from './ANCForm';
import IMMForm from './IMMForm';
import NCDForm from './NCDForm';
import { User, ChevronLeft, Stethoscope, Baby, HeartPulse, ShieldCheck } from 'lucide-react';

interface Patient {
    _id: string;
    name: string;
    sex: string;
    dob: string;
    unique_id: string;
}

interface EncounterDashboardProps {
    patient: Patient;
    onBack: () => void;
}

const EncounterDashboard: React.FC<EncounterDashboardProps> = ({ patient, onBack }) => {
    const [activeModule, setActiveModule] = useState<'selection' | 'OPD' | 'ANC' | 'IMM' | 'NCD'>('selection');

    const modules = [
        { id: 'OPD', name: 'Outpatient (OPD)', icon: <Stethoscope size={24} />, color: 'text-primary', bg: 'bg-primary/10' },
        { id: 'ANC', name: 'Antenatal (ANC)', icon: <HeartPulse size={24} />, color: 'text-accent', bg: 'bg-accent/10' },
        { id: 'IMM', name: 'Immunization', icon: <Baby size={24} />, color: 'text-secondary', bg: 'bg-secondary/10' },
        { id: 'NCD', name: 'NCD Clinic', icon: <ShieldCheck size={24} />, color: 'text-orange-500', bg: 'bg-orange-50/50' },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fade-in">
            {/* Patient Header */}
            <div className="glass-card p-6 mb-8 flex items-center justify-between">
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
            ) : null}
        </div>
    );
};

export default EncounterDashboard;
