import React, { useState } from 'react';
import { Microscope, Activity, CheckCircle, Clock } from 'lucide-react';

const LabDashboard = () => {
    const [activeTab, setActiveTab] = useState<'orders' | 'results'>('orders');

    const pendingTests = [
        { id: 'LAB-001', patient: 'Ahmad Musa', test: 'Malaria RDT', requestedBy: 'Dr. Fatima', time: '10 mins ago' },
        { id: 'LAB-002', patient: 'Grace Okafor', test: 'Hemoglobin (Hb)', requestedBy: 'Nurse Bili', time: '25 mins ago' },
    ];

    const completedResults = [
        { id: 'LAB-000', patient: 'John Doe', test: 'HIV Rapid Test', result: 'Negative', verified: true },
        { id: 'LAB-999', patient: 'Sarah James', test: 'Malaria RDT', result: 'Positive (+)', verified: true },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
                        <Microscope className="text-primary" size={32} />
                        Diagnostic Lab
                    </h1>
                    <p className="text-text-muted mt-2">Manage clinical test orders and verification</p>
                </div>

                <div className="flex gap-2 bg-background p-1 rounded-xl shadow-inner border border-white/20">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        Pending Orders ({pendingTests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('results')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'results' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        Recent Results
                    </button>
                </div>
            </header>

            <div className="grid gap-6">
                {activeTab === 'orders' ? (
                    pendingTests.map(test => (
                        <div key={test.id} className="glass-card p-6 flex items-center justify-between animate-fade-in border-l-4 border-amber-400">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-main">{test.patient}</h3>
                                    <p className="text-sm text-text-muted">{test.test} • Requested by {test.requestedBy}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono text-text-muted">{test.id}</span>
                                <button className="btn-primary py-2 px-6">Process Test</button>
                            </div>
                        </div>
                    ))
                ) : (
                    completedResults.map(res => (
                        <div key={res.id} className="glass-card p-6 flex items-center justify-between animate-fade-in border-l-4 border-emerald-400">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-main">{res.patient}</h3>
                                    <p className="text-sm text-text-muted">{res.test} • <span className="font-bold text-emerald-600">Result: {res.result}</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono text-text-muted">{res.id}</span>
                                <button className="text-primary font-semibold hover:underline">View Details</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button className="fixed bottom-12 right-12 w-16 h-16 rounded-full bg-primary text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center">
                <Activity size={28} />
            </button>
        </div>
    );
};

export default LabDashboard;
