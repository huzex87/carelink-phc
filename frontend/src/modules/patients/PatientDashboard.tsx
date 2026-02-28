import React, { useState } from 'react';
import PatientRegistration from './PatientRegistration';
import PatientSearch from './PatientSearch';
import EncounterDashboard from '../encounters/EncounterDashboard';
import { UserPlus, Search as SearchIcon, Users, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const PatientDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'search' | 'register'>('search');
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

    // If a patient is selected, transition to the Encounter Dashboard
    if (selectedPatient) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
            >
                <EncounterDashboard
                    patient={selectedPatient}
                    onBack={() => setSelectedPatient(null)}
                />
            </motion.div>
        );
    }

    const tabs = [
        { id: 'search', label: 'Patient Search', icon: SearchIcon },
        { id: 'register', label: 'New Registration', icon: UserPlus }
    ] as const;

    return (
        <div className="min-h-screen bg-transparent max-w-6xl mx-auto flex flex-col pt-4">
            {/* Dashboard Header */}
            <header className="mb-10 px-2 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10 relative">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-primary font-bold tracking-widest text-[11px] uppercase mb-3"
                    >
                        <span>Core Modules</span>
                        <ChevronRight size={12} className="opacity-50" />
                        <span>Population Health</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-4"
                    >
                        <div className="p-3 bg-white shadow-soft rounded-2xl text-primary border border-primary/10">
                            <Users size={28} className="stroke-[2.5]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-text-main">
                                Patient HQ
                            </h1>
                            <p className="text-text-muted mt-1 font-medium">Manage longitudinal records and clinical encounters</p>
                        </div>
                    </motion.div>
                </div>

                {/* Animated Tabs */}
                <motion.nav
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex p-1.5 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-sm"
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors z-10",
                                    isActive ? "text-primary-dark" : "text-text-muted hover:text-text-main"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-border/40"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Icon size={18} className={clsx("stroke-[2.5]", isActive && "text-primary")} />
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </motion.nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative">
                <AnimatePresence exitBeforeEnter>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {activeTab === 'search' ? (
                            <PatientSearch onSelect={(p) => setSelectedPatient(p)} />
                        ) : (
                            <PatientRegistration />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default PatientDashboard;
