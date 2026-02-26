import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { Search, User, ArrowRight, Baby, UserCircle } from 'lucide-react';

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

    useEffect(() => {
        const searchPatients = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            try {
                const result = await db.find({
                    selector: {
                        type: 'patient',
                        name: { $regex: new RegExp(query, 'i') }
                    }
                });
                setResults(result.docs as Patient[]);
            } catch (error) {
                console.error('Search error:', error);
            }
        };

        const timeoutId = setTimeout(searchPatients, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fade-in">
            <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                        <Search size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Patient Search</h2>
                        <p className="text-text-muted">Find existing longitudinal records</p>
                    </div>
                </div>

                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                        type="text"
                        className="input-field pl-12 h-14 text-lg"
                        placeholder="Search by name or Patient ID..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    {results.length > 0 ? (
                        results.map((patient) => (
                            <div
                                key={patient._id}
                                onClick={() => onSelect(patient)}
                                className="flex items-center justify-between p-4 bg-surface border border-border rounded-2xl hover:border-primary/50 transition-colors group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-background rounded-full">
                                        {patient.sex === 'M' ? <UserCircle className="text-primary" size={24} /> : <UserCircle className="text-accent" size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{patient.name}</h4>
                                        <div className="flex items-center gap-3 text-sm text-text-muted">
                                            <span className="bg-primary/5 text-primary px-2 py-0.5 rounded font-mono font-bold">{patient.unique_id}</span>
                                            <span>{patient.sex === 'M' ? 'Male' : 'Female'}</span>
                                            <span>•</span>
                                            <span>DOB: {new Date(patient.dob).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 bg-primary/5 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        ))
                    ) : query.length >= 2 ? (
                        <div className="text-center py-12 text-text-muted">
                            <User size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No patients found matching "{query}"</p>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-text-muted">
                            <Search size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Start typing to search for patients</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientSearch;
