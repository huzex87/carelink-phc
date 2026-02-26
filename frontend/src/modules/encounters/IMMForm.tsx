import React, { useState } from 'react';
import { db } from '../../db';
import { Baby, ShieldCheck, Send } from 'lucide-react';

interface IMMFormProps {
    patientId: string;
    onComplete: () => void;
}

const IMMForm: React.FC<IMMFormProps> = ({ patientId, onComplete }) => {
    const [formData, setFormData] = useState({
        vaccineType: '',
        doseNumber: '1',
        batchNumber: '',
        adverseEvent: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await db.put({
            _id: `IMM-${Date.now()}`,
            type: 'encounter',
            patient_id: patientId,
            service_type: 'IMM',
            data: formData,
            created_at: new Date().toISOString()
        });
        onComplete();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <label className="text-sm font-bold">Vaccine Type</label>
                <select className="input-field" value={formData.vaccineType} onChange={e => setFormData({ ...formData, vaccineType: e.target.value })}>
                    <option value="">Select Vaccine</option>
                    <option value="BCG">BCG</option>
                    <option value="OPV">OPV</option>
                    <option value="Pentavalent">Pentavalent</option>
                    <option value="Measles">Measles</option>
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-bold">Dose No.</label>
                    <input type="number" className="input-field" value={formData.doseNumber} onChange={e => setFormData({ ...formData, doseNumber: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-bold">Batch Number</label>
                    <input type="text" className="input-field" value={formData.batchNumber} onChange={e => setFormData({ ...formData, batchNumber: e.target.value })} />
                </div>
            </div>
            <button type="submit" className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2">
                <Baby size={20} /> Record Immunization
            </button>
        </form>
    );
};

export default IMMForm;
