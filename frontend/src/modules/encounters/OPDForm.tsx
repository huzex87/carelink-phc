import React, { useState } from 'react';
import { db } from '../../db';
import { Stethoscope, ClipboardList, Thermometer, Activity, Send, Sparkles, Loader2, CheckCircle } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const ICD10_SUBSET = [
    { code: 'B50.9', name: 'Plasmodium falciparum malaria, unspecified' },
    { code: 'B54', name: 'Unspecified malaria' },
    { code: 'J06.9', name: 'Acute upper respiratory infection, unspecified' },
    { code: 'A09', name: 'Infectious gastroenteritis and colitis, unspecified' },
    { code: 'I10', name: 'Essential (primary) hypertension' },
    { code: 'E11.9', name: 'Type 2 diabetes mellitus without complications' },
    { code: 'Z00.00', name: 'Encounter for general adult medical examination' },
    { code: 'J20.9', name: 'Acute bronchitis, unspecified' },
    { code: 'N39.0', name: 'Urinary tract infection, site not specified' },
    { code: 'L23.9', name: 'Allergic contact dermatitis, unspecified cause' },
];

interface OPDFormProps {
    patientId: string;
    onComplete: () => void;
}

const OPDForm: React.FC<OPDFormProps> = ({ patientId, onComplete }) => {
    const [formData, setFormData] = useState({
        complaint: '',
        diagnosis: '',
        treatment: '',
        bloodPressure: '',
        temperature: '',
        weight: ''
    });
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<{ code: string; description: string; confidence: number }[]>([]);

    const handleMagicSuggest = async () => {
        if (!formData.complaint) return;
        setIsSuggesting(true);
        try {
            const response = await fetch('/api/v1/ai/icd10-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note: formData.complaint }),
            });
            const data = await response.json();
            setAiSuggestions(data.suggestions || []);
            setDropdownOpen(true);
        } catch (error) {
            console.error('AI Suggest Error:', error);
        } finally {
            setIsSuggesting(false);
        }
    };

    const filteredDiagnoses = ICD10_SUBSET.filter(dx =>
        dx.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dx.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const encounterId = `ENC-${Date.now()}`;
            const encounter = {
                _id: encounterId,
                type: 'encounter',
                patient_id: patientId,
                service_type: 'OPD',
                data: formData,
                created_at: new Date().toISOString()
            };

            await db.put(encounter);
            onComplete();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <Thermometer size={16} /> Temp (°C)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        className="input-field"
                        placeholder="36.5"
                        value={formData.temperature}
                        onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <Activity size={16} /> Blood Pressure
                    </label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="120/80"
                        value={formData.bloodPressure}
                        onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        Weight (kg)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        className="input-field"
                        placeholder="70"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                    <ClipboardList size={16} /> Chief Complaint
                </label>
                <textarea
                    required
                    rows={3}
                    className="input-field py-3"
                    placeholder="What is the patient experiencing?"
                    value={formData.complaint}
                    onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                />
            </div>

            <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <Stethoscope size={16} /> Diagnosis (ICD-10 Subset)
                    </label>
                    <button
                        type="button"
                        onClick={handleMagicSuggest}
                        disabled={!formData.complaint || isSuggesting}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                    >
                        {isSuggesting ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:animate-pulse" />}
                        Magic Suggest
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        required
                        className="input-field w-full"
                        placeholder="Search diagnosis (e.g. Malaria, URI)"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setDropdownOpen(true);
                            // Clear exact diagnosis if user modifies the search text
                            if (formData.diagnosis && e.target.value !== formData.diagnosis) {
                                setFormData({ ...formData, diagnosis: '' });
                            }
                        }}
                        onFocus={() => setDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                    />

                    <AnimatePresence>
                        {dropdownOpen && searchQuery && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-glass overflow-hidden"
                            >
                                <ul className="max-h-60 overflow-y-auto custom-scrollbar py-2">
                                    {aiSuggestions.length > 0 && (
                                        <div className="px-4 py-2 border-b border-border/40 bg-primary/5 mb-1">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                                                <Sparkles size={10} /> AI Recommendations
                                            </span>
                                        </div>
                                    )}
                                    {aiSuggestions.map((suggestion) => (
                                        <li
                                            key={suggestion.code}
                                            className="px-4 py-2.5 hover:bg-primary/10 cursor-pointer flex items-center justify-between group transition-colors border-l-4 border-primary"
                                            onClick={() => {
                                                setFormData({ ...formData, diagnosis: `${suggestion.code} - ${suggestion.description}` });
                                                setSearchQuery(`${suggestion.code} - ${suggestion.description}`);
                                                setDropdownOpen(false);
                                                setAiSuggestions([]);
                                            }}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-text-main flex items-center gap-2">
                                                    {suggestion.description}
                                                    <CheckCircle size={12} className="text-primary" />
                                                </span>
                                                <span className="text-[10px] text-text-muted">Confidence: {Math.round(suggestion.confidence * 100)}%</span>
                                            </div>
                                            <span className="text-xs font-bold font-mono text-primary bg-white px-2 py-0.5 rounded shadow-sm">{suggestion.code}</span>
                                        </li>
                                    ))}
                                    {aiSuggestions.length > 0 && <div className="h-px bg-border/40 my-1 mx-2" />}

                                    {filteredDiagnoses.length > 0 ? (
                                        filteredDiagnoses.map((dx) => (
                                            <li
                                                key={dx.code}
                                                className="px-4 py-2.5 hover:bg-primary/5 cursor-pointer flex items-center justify-between group transition-colors"
                                                onClick={() => {
                                                    setFormData({ ...formData, diagnosis: `${dx.code} - ${dx.name}` });
                                                    setSearchQuery(`${dx.code} - ${dx.name}`);
                                                    setDropdownOpen(false);
                                                    setAiSuggestions([]);
                                                }}
                                            >
                                                <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">{dx.name}</span>
                                                <span className="text-xs font-bold font-mono text-text-muted bg-surface-muted px-2 py-0.5 rounded group-hover:bg-primary/10 group-hover:text-primary-dark transition-colors">{dx.code}</span>
                                            </li>
                                        ))
                                    ) : (
                                        !aiSuggestions.length && <li className="px-4 py-3 text-sm text-text-muted text-center italic">No matching ICD-10 codes found</li>
                                    )}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                    Treatment/Prescription
                </label>
                <textarea
                    rows={3}
                    className="input-field py-3"
                    placeholder="Prescribed drugs and dosages"
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 h-14 text-lg"
            >
                <Send size={20} /> {loading ? 'Saving...' : 'Record OPD Encounter'}
            </button>
        </form>
    );
};

export default OPDForm;
