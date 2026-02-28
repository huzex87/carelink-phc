import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { Search, UserCircle, ArrowRight, Sparkles, Fingerprint, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface Patient {
    _id: string;
    name: string;
    sex: string;
    dob: string;
    unique_id: string;
}

interface PatientSearchProps {
    onSelect: (patient: Patient) => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ onSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Patient[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const searchPatients = async () => {
            if (query.length < 2) {
                setResults([]);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                const result = await db.find({
                    selector: {
                        type: 'patient',
                        name: { $regex: new RegExp(query, 'i') }
                    }
                });
                setResults(result.docs as unknown as Patient[]);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(searchPatients, 400); // 400ms debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Calculate age helper
    const getAge = (dobString: string) => {
        const today = new Date();
        const birthDate = new Date(dobString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="glass-card p-8 border-t-4 border-t-primary">

            <div className="relative mb-10 group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className={`transition-colors duration-300 ${query ? 'text-primary' : 'text-text-muted/50'}`} size={24} />
                </div>
                <input
                    type="text"
                    className="w-full bg-white/80 backdrop-blur-md border-2 border-border/80 rounded-2xl h-16 pl-14 pr-6 text-xl font-medium text-text-main shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-text-muted/50"
                    placeholder="Search master index by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    {isSearching && (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                </div>
            </div>

            <div className="space-y-4 min-h-[400px]">
                {results.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                        }}
                        className="grid gap-4"
                    >
                        {results.map((patient) => (
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                key={patient._id}
                                onClick={() => onSelect(patient)}
                                className="group relative flex items-center justify-between p-5 bg-white border border-border/60 rounded-2xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden"
                            >
                                {/* Hover background gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="flex items-center gap-5 relative z-10">
                                    <div className={`p-4 rounded-2xl ${patient.sex === 'M' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'} shadow-inner-light`}>
                                        <UserCircle size={32} className="stroke-[2]" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-extrabold text-xl text-text-main group-hover:text-primary transition-colors">{patient.name}</h4>
                                            {patient.sex === 'F' && getAge(patient.dob) >= 15 && getAge(patient.dob) <= 49 && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-600 px-2.5 py-1 rounded-full">
                                                    WRA <Sparkles size={10} />
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-text-muted">
                                            <span className="flex items-center gap-1.5 bg-background border border-border/50 px-2.5 py-1 rounded-lg font-mono text-primary-dark shadow-sm">
                                                <Fingerprint size={14} /> {patient.unique_id}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Activity size={14} className="opacity-50" />
                                                {getAge(patient.dob)} yrs • {patient.sex === 'M' ? 'Male' : 'Female'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-white border border-border/50 text-text-muted rounded-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-md transition-all duration-300 relative z-10">
                                    <ArrowRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : query.length >= 2 && !isSearching ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-24 h-24 bg-surface-muted rounded-full flex items-center justify-center mb-6 border border-border border-dashed">
                            <Search size={40} className="text-text-muted/40" />
                        </div>
                        <h3 className="text-xl font-bold text-text-main mb-2">No patients found</h3>
                        <p className="text-text-muted pb-6">We couldn't find anyone matching "{query}" in the index.</p>
                        <button className="btn-secondary" onClick={() => {/* Future: switch to register tab logic */ }}>
                            Register New Patient
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center opacity-60">
                        <UserCircle size={64} className="text-text-muted/30 mb-6" />
                        <h3 className="text-xl font-bold text-text-muted mb-2">Patient Index</h3>
                        <p className="text-text-muted/70 max-w-sm">Enter at least 2 characters to search the federated clinical index.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientSearch;
