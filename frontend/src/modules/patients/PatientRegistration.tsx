import React, { useState } from 'react';
import { db } from '../../db';
import { UserPlus, Calendar, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        try {
            // Simulated network delay for UX feedback
            await new Promise(res => setTimeout(res, 800));

            const patientId = `PHC-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
            const newPatient = {
                _id: patientId,
                type: 'patient',
                unique_id: patientId,
                ...formData,
                created_at: new Date().toISOString()
            };

            await db.put(newPatient);
            setStatus({ type: 'success', message: `Record created successfully! ID: ${patientId}` });
            setFormData({ name: '', sex: 'M', dob: '', phone: '', ward: '', lga: '' });
        } catch (error: any) {
            console.error(error);
            setStatus({ type: 'error', message: 'Failed to register patient. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card p-1 border-t-4 border-t-secondary relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <UserPlus size={200} />
            </div>

            <div className="p-7 relative z-10">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-text-main mb-2 tracking-tight">New Patient Registration</h2>
                    <p className="text-text-muted font-medium">Create a new longitudinal record for the central facility database.</p>
                </div>

                <AnimatePresence exitBeforeEnter>
                    {status.type && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            className={`mb-8 p-4 rounded-xl border flex items-start gap-4 shadow-sm ${status.type === 'success'
                                ? 'bg-success/10 border-success/20 text-success-dark'
                                : 'bg-error/10 border-error/20 text-error-dark'
                                }`}
                        >
                            <div className="mt-0.5">
                                {status.type === 'success' ? <CheckCircle2 size={20} className="text-success" /> : <AlertCircle size={20} className="text-error" />}
                            </div>
                            <div>
                                <h4 className={`font-bold ${status.type === 'success' ? 'text-success' : 'text-error'}`}>
                                    {status.type === 'success' ? 'Registration Complete' : 'Registration Failed'}
                                </h4>
                                <p className="text-sm font-medium opacity-90">{status.message}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        {/* Section: Personal Details */}
                        <div className="md:col-span-2">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Personal Details</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="input-label">Full Legal Name <span className="text-error">*</span></label>
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
                            <label className="input-label">Date of Birth <span className="text-error">*</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Calendar className="text-text-muted" size={18} />
                                </div>
                                <input
                                    type="date"
                                    required
                                    className="input-field pl-12"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="input-label">Biological Sex</label>
                            <div className="relative">
                                <select
                                    className="input-field appearance-none cursor-pointer"
                                    value={formData.sex}
                                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                                >
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-t-[6px] border-t-text-muted border-r-[5px] border-r-transparent"></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="input-label">Contact Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Phone className="text-text-muted" size={18} />
                                </div>
                                <input
                                    type="tel"
                                    className="input-field pl-12"
                                    placeholder="e.g. 08012345678"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Section: Residence */}
                        <div className="md:col-span-2 pt-4">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Residence Mapping (GIS)</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="input-label">Catchment Ward</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <MapPin className="text-text-muted" size={18} />
                                </div>
                                <input
                                    type="text"
                                    className="input-field pl-12"
                                    placeholder="Enter political ward"
                                    value={formData.ward}
                                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="input-label">Local Government Area</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <MapPin className="text-text-muted" size={18} />
                                </div>
                                <input
                                    type="text"
                                    className="input-field pl-12"
                                    placeholder="Enter LGA"
                                    value={formData.lga}
                                    onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary min-w-[200px]"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus size={20} className="stroke-[2.5]" />
                                    <span>Register Patient</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientRegistration;
