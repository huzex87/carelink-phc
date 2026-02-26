import React, { useState } from 'react';
import PatientRegistration from './PatientRegistration';
import PatientSearch from './PatientSearch';
import EncounterDashboard from '../encounters/EncounterDashboard';
import { UserPlus, Search as SearchIcon, Users } from 'lucide-react';

const PatientDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'search' | 'register'>('search');
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

    if (selectedPatient) {
        return (
            <EncounterDashboard
                patient={selectedPatient}
                onBack={() => setSelectedPatient(null)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Dashboard Header */}
            <header className="bg-surface border-b border-border sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary text-white rounded-lg">
                            <Users size={24} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Patient Management</h1>
                    </div>

                    <nav className="flex gap-2 p-1 bg-background rounded-xl border border-border">
                        <button
                            onClick={() => setActiveTab('search')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'search'
                                ? 'bg-surface text-primary shadow-sm'
                                : 'text-text-muted hover:text-text-main'
                                }`}
                        >
                            <SearchIcon size={16} /> Search
                        </button>
                        <button
                            onClick={() => setActiveTab('register')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'register'
                                ? 'bg-surface text-primary shadow-sm'
                                : 'text-text-muted hover:text-text-main'
                                }`}
                        >
                            <UserPlus size={16} /> Register
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="py-8">
                {activeTab === 'search' ? (
                    <PatientSearch onSelect={(p) => setSelectedPatient(p)} />
                ) : (
                    <PatientRegistration />
                )}
            </main>
        </div>
    );
};

export default PatientDashboard;
