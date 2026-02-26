import React, { useState } from 'react';
import { Share2, Hospital, Clipboard, ArrowRight, ExternalLink } from 'lucide-react';

const ReferralModule = () => {
    const [targetFacility, setTargetFacility] = useState('');
    const [priority, setPriority] = useState('routine');

    const facilities = [
        'Murtala Muhammad Specialist Hospital',
        'Aminu Kano Teaching Hospital',
        'Muhammad Abdullahi Wase Teaching Hospital',
    ];

    const recentReferrals = [
        { id: 'REF-881', patient: 'Zainab Yusuf', to: 'Murtala Muhammad SH', status: 'accepted', priority: 'urgent' },
        { id: 'REF-902', patient: 'Ibrahim Ali', to: 'Aminu Kano TH', status: 'pending', priority: 'emergency' },
    ];

    return (
        <div className="glass-card p-6 border-l-4 border-primary">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2 mb-6">
                <Share2 className="text-primary" size={24} />
                Initiate Care Referral
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-bold text-text-muted mb-2">Receiving Facility</label>
                    <select
                        value={targetFacility}
                        onChange={(e) => setTargetFacility(e.target.value)}
                        className="w-full bg-background border border-border p-3 rounded-xl text-text-main focus:ring-2 focus:ring-primary outline-none"
                    >
                        <option value="">Select Secondary/Tertiary Center</option>
                        {facilities.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-text-muted mb-2">Clinical Priority</label>
                    <div className="flex gap-2">
                        {['routine', 'urgent', 'emergency'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPriority(p)}
                                className={`flex-1 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${priority === p ? 'bg-primary text-white border-primary' : 'bg-transparent text-text-muted border-border'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-bold text-text-muted mb-2">Clinical Summary & Handover Notes</label>
                <textarea
                    placeholder="Presenting complaints, vitals, treatments administered and reason for referral..."
                    className="w-full h-32 bg-background border border-border p-4 rounded-xl text-text-main focus:ring-2 focus:ring-primary outline-none"
                />
            </div>

            <button className="w-full btn-primary py-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <Hospital size={20} />
                Transmit Digital Referral
                <ArrowRight size={18} />
            </button>

            <div className="mt-12 border-t border-border pt-8">
                <h4 className="text-sm font-bold text-text-muted mb-4 flex items-center gap-2">
                    <Clipboard size={16} />
                    Recently Transmitted Referrals
                </h4>
                <div className="space-y-3">
                    {recentReferrals.map(ref => (
                        <div key={ref.id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/50">
                            <div>
                                <span className="text-[10px] font-black uppercase text-primary mb-1 block tracking-widest">{ref.id}</span>
                                <p className="font-bold text-text-main">{ref.patient}</p>
                                <p className="text-xs text-text-muted">to {ref.to}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${ref.priority === 'emergency' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-primary'
                                    }`}>
                                    {ref.priority}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase">{ref.status}</span>
                                <ExternalLink size={14} className="text-text-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReferralModule;
