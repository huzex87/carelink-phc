import React, { useState } from 'react';
import { db } from '../../db';
import { Stethoscope, ClipboardList, Thermometer, Activity, Send } from 'lucide-react';

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

            <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                    <Stethoscope size={16} /> Diagnosis (ICD-10 Subset)
                </label>
                <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Malaria, URI, Gastroenteritis"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                />
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
