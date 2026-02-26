import React, { useState } from 'react';
import { Home, Users, MapPin, Clipboard, Send, Search, Plus, CheckCircle2 } from 'lucide-react';

const CHVDashboard = () => {
    const [activeView, setActiveView] = useState<'roster' | 'registration'>('roster');

    const households = [
        { id: 'HH-001', head: 'Musa Ibrahim', members: 6, status: 'visited', lastVisit: '2026-02-20' },
        { id: 'HH-002', head: 'Aisha Yusuf', members: 4, status: 'pending', lastVisit: '2026-01-15' },
        { id: 'HH-003', head: 'Habibu Lawan', members: 7, status: 'overdue', lastVisit: '2025-12-10' },
    ];

    return (
        <div className="max-w-md mx-auto min-h-screen bg-background pb-20 font-sans">
            {/* Mobile-First Header */}
            <header className="p-6 bg-surface border-b border-border sticky top-0 z-50">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <Clipboard className="text-primary" size={24} />
                        Field Outreach
                    </h1>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        CH
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Search Households..."
                        className="w-full bg-background border border-border pl-10 pr-4 py-2 text-sm rounded-xl outline-none"
                    />
                </div>
            </header>

            {/* Quick Action Stats */}
            <div className="p-6 grid grid-cols-2 gap-4">
                <div className="glass-card p-4 text-center border-b-2 border-primary">
                    <span className="text-2xl font-black text-text-main">24</span>
                    <p className="text-[10px] font-bold text-text-muted uppercase mt-1">Visits Today</p>
                </div>
                <div className="glass-card p-4 text-center border-b-2 border-orange-500">
                    <span className="text-2xl font-black text-text-main">8</span>
                    <p className="text-[10px] font-bold text-text-muted uppercase mt-1">Pending Sync</p>
                </div>
            </div>

            {/* Household Roster */}
            <div className="px-6 space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xs font-black text-text-muted uppercase tracking-widest">Active Household Roster</h2>
                    <button className="text-primary text-xs font-bold flex items-center gap-1">
                        <Plus size={14} /> New Entry
                    </button>
                </div>

                {households.map(hh => (
                    <div key={hh.id} className="glass-card p-4 flex justify-between items-center group active:scale-95 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${hh.status === 'visited' ? 'bg-emerald-100 text-emerald-600' :
                                    hh.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                                }`}>
                                <Home size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main">{hh.head}</h4>
                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                    <span className="font-mono text-[10px] bg-background px-1 rounded border border-border">{hh.id}</span>
                                    <span>• {hh.members} Members</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-[10px] font-black uppercase tracking-wider block ${hh.status === 'visited' ? 'text-emerald-500' : 'text-text-muted'
                                }`}>
                                {hh.status}
                            </span>
                            <span className="text-[10px] text-text-muted">{hh.lastVisit}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Nav Bar */}
            <nav className="fixed bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-2 flex justify-around items-center z-50">
                <button className="flex flex-col items-center gap-1 p-2 text-primary">
                    <Home size={20} />
                    <span className="text-[8px] font-black uppercase">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 text-text-muted">
                    <Users size={20} />
                    <span className="text-[8px] font-black uppercase">Households</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 text-text-muted">
                    <MapPin size={20} />
                    <span className="text-[8px] font-black uppercase">Map</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 text-text-muted relative">
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-surface">8</div>
                    <Send size={20} />
                    <span className="text-[8px] font-black uppercase">Sync</span>
                </button>
            </nav>
        </div>
    );
};

export default CHVDashboard;
