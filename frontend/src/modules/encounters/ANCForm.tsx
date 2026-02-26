import React, { useState } from 'react';
import { db } from '../../db';
import { HeartPulse, Calendar, Send } from 'lucide-react';

interface ANCFormProps {
    patientId: string;
    onComplete: () => void;
}

const ANCForm: React.FC<ANCFormProps> = ({ patientId, onComplete }) => {
    const [formData, setFormData] = useState({
        gestationalAge: '',
        visitNumber: '1',
        weight: '',
        bloodPressure: '',
        ironSupplement: false,
        tetanusToxoid: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await db.put({
            _id: `ANC-${Date.now()}`,
            type: 'encounter',
            patient_id: patientId,
            service_type: 'ANC',
            data: formData,
            created_at: new Date().toISOString()
        });
        onComplete();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-bold">Gestational Age (Weeks)</label>
                    <input type="number" className="input-field" value={formData.gestationalAge} onChange={e => setFormData({ ...formData, gestationalAge: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-bold">Visit Number</label>
                    <select className="input-field" value={formData.visitNumber} onChange={e => setFormData({ ...formData, visitNumber: e.target.value })}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.ironSupplement} onChange={e => setFormData({ ...formData, ironSupplement: e.target.checked })} />
                    <span>Iron/Folic Acid Issued</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.tetanusToxoid} onChange={e => setFormData({ ...formData, tetanusToxoid: e.target.checked })} />
                    <span>Tetanus Given</span>
                </label>
            </div>
            <button type="submit" className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2">
                <HeartPulse size={20} /> Record ANC Visit
            </button>
        </form>
    );
};

export default ANCForm;
