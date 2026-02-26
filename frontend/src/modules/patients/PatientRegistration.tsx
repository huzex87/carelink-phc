import React, { useState } from 'react';
import { db } from '../../db';
import { UserPlus, Search, Calendar, Phone, MapPin } from 'lucide-react';

const PatientRegistration: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        sex: 'M',
        dob: '',
        phone: '',
        ward: '',
        lga: ''
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const patientId = `PHC-${Date.now()}`;
            const newPatient = {
                _id: patientId,
                type: 'patient',
                unique_id: patientId,
                ...formData,
                created_at: new Date().toISOString()
            };

            await db.put(newPatient);
            setStatus({ type: 'success', message: `Patient registered successfully! ID: ${patientId}` });
            setFormData({ name: '', sex: 'M', dob: '', phone: '', ward: '', lga: '' });
        } catch (error: any) {
            console.error(error);
            setStatus({ type: 'error', message: 'Failed to register patient. Please try again.' });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 animate-fade-in">
            <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <UserPlus size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Patient Registration</h2>
                        <p className="text-text-muted">Create a new longitudinal patient record</p>
                    </div>
                </div>

                {status.type && (
                    <div className={`p-4 rounded-xl mb-6 ${status.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                Full Name <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Gender</label>
                            <select
                                className="input-field"
                                value={formData.sex}
                                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                            >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Calendar size={16} /> Date of Birth
                            </label>
                            <input
                                type="date"
                                required
                                className="input-field"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Phone size={16} /> Phone Number
                            </label>
                            <input
                                type="tel"
                                className="input-field"
                                placeholder="+234..."
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <MapPin size={16} /> Ward
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Enter ward"
                                value={formData.ward}
                                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <MapPin size={16} /> LGA
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Enter LGA"
                                value={formData.lga}
                                onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
                        <UserPlus size={18} /> Register Patient
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PatientRegistration;
