import React, { useState } from 'react';
import { db } from '../../db';
import { Stethoscope, ClipboardList, Thermometer, Activity, Send } from 'lucide-react';

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
                <label className="text-sm font-semibold flex items-center gap-2">
                    <Stethoscope size={16} /> Diagnosis (ICD-10 Subset)
                </label>
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
                                    {filteredDiagnoses.length > 0 ? (
                                        filteredDiagnoses.map((dx) => (
                                            <li
                                                key={dx.code}
                                                className="px-4 py-2.5 hover:bg-primary/5 cursor-pointer flex items-center justify-between group transition-colors"
                                                onClick={() => {
                                                    setFormData({ ...formData, diagnosis: `${dx.code} - ${dx.name}` });
                                                    setSearchQuery(`${dx.code} - ${dx.name}`);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">{dx.name}</span>
                                                <span className="text-xs font-bold font-mono text-text-muted bg-surface-muted px-2 py-0.5 rounded group-hover:bg-primary/10 group-hover:text-primary-dark transition-colors">{dx.code}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-3 text-sm text-text-muted text-center italic">No matching ICD-10 codes found</li>
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
