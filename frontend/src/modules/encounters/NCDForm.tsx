import React, { useState } from 'react';
import { db } from '../../db';
import { Activity, ShieldCheck, Send } from 'lucide-react';

interface NCDFormProps {
    patientId: string;
    onComplete: () => void;
}

const NCDForm: React.FC<NCDFormProps> = ({ patientId, onComplete }) => {
    const [formData, setFormData] = useState({
        condition: '',
        bloodPressure: '',
        glucoseLevel: '',
        adherence: 'Good',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await db.put({
            _id: `NCD-${Date.now()}`,
            type: 'encounter',
            patient_id: patientId,
            service_type: 'NCD',
            data: formData,
            created_at: new Date().toISOString()
        });
        onComplete();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <label className="text-sm font-bold">Condition Type</label>
                <select className="input-field" value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })}>
                    <option value="">Select Condition</option>
                    <option value="Hypertension">Hypertension</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Asthma">Asthma</option>
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-bold">Blood Pressure</label>
                    <input type="text" className="input-field" placeholder="140/90" value={formData.bloodPressure} onChange={e => setFormData({ ...formData, bloodPressure: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-bold">Glucose (mg/dL)</label>
                    <input type="number" className="input-field" placeholder="110" value={formData.glucoseLevel} onChange={e => setFormData({ ...formData, glucoseLevel: e.target.value })} />
                </div>
            </div>
            <button type="submit" className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2">
                <Activity size={20} /> Record NCD Visit
            </button>
        </form>
    );
};

export default NCDForm;
