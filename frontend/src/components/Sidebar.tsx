import React from 'react';
import {
    Users,
    BarChart2,
    Settings,
    LogOut,
    Activity,
    Microscope,
    Package,
    AlertTriangle,
    Shield
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
    activeView: 'patients' | 'analytics' | 'lab' | 'pharmacy' | 'alerts';
    onViewChange: (view: 'patients' | 'analytics' | 'lab' | 'pharmacy' | 'alerts') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
    const navItems = [
        { id: 'patients', label: 'Patient HQ', icon: <Users size={22} className="stroke-[2.5]" /> },
        { id: 'lab', label: 'Diagnostics', icon: <Microscope size={22} className="stroke-[2.5]" /> },
        { id: 'pharmacy', label: 'Dispensary', icon: <Package size={22} className="stroke-[2.5]" /> },
        { id: 'analytics', label: 'EPI Analytics', icon: <BarChart2 size={22} className="stroke-[2.5]" /> },
        { id: 'alerts', label: 'NCDC Alerts', icon: <AlertTriangle size={22} className="stroke-[2.5]" /> },
    ];

    return (
        <aside className="w-72 bg-white/70 backdrop-blur-2xl border-r border-border/80 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-[10px_0_30px_-10px_rgba(0,0,0,0.05)]">
            <div className="p-8 pb-4 flex items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 blur-md rounded-xl" />
                    <div className="relative p-2.5 bg-gradient-to-tr from-primary to-primary-light text-white rounded-xl shadow-soft">
                        <Activity size={26} className="stroke-[2.5]" />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-text-main leading-none">CareLink</h1>
                    <span className="text-xs font-bold text-primary tracking-widest uppercase">Federated PHC</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id as any)}
                        className={twMerge(
                            "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-bold transition-all group relative duration-300 outline-none",
                            activeView === item.id
                                ? 'bg-primary border border-primary text-white shadow-soft hover:shadow-lg hover:shadow-primary/30'
                                : 'text-text-muted hover:bg-surface-muted hover:text-text-main hover:shadow-sm border border-transparent'
                        )}
                    >
                        {/* Active Indicator Line */}
                        {activeView === item.id && (
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white/40 rounded-full" />
                        )}

                        <div className={clsx("transition-transform duration-300", activeView !== item.id && "group-hover:scale-110 group-hover:text-primary")}>
                            {item.icon}
                        </div>
                        {item.label}

                        {item.id === 'alerts' && (
                            <div className="ml-auto w-2.5 h-2.5 rounded-full bg-error ring-4 ring-error/20 animate-pulse" />
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 space-y-2">
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-bold text-text-muted hover:bg-surface hover:text-text-main border border-transparent hover:border-border transition-all group">
                    <Settings size={22} className="stroke-[2.5] group-hover:rotate-45 transition-transform duration-500" />
                    Platform Settings
                </button>
                <div className="h-px w-full bg-border/60 my-2" />
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-bold text-error/80 hover:bg-error/10 hover:text-error transition-all group">
                    <LogOut size={22} className="stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
                    Secure Logout
                </button>
            </div>

            {/* Status Footer */}
            <div className="p-5 bg-gradient-to-br from-surface to-surface-muted m-4 rounded-2xl border border-border/80 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors cursor-help">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Shield size={80} />
                </div>
                <div className="flex items-center gap-2 mb-1.5 relative">
                    <div className="w-2.5 h-2.5 bg-success rounded-full ring-4 ring-success/20 animate-pulse" />
                    <span className="text-[11px] font-extrabold text-success tracking-widest uppercase">Secure Link</span>
                </div>
                <p className="text-xs text-text-muted font-medium relative">Connected to DHIS2 Core</p>
                <p className="text-[10px] text-text-muted/60 mt-1 font-mono uppercase">Node: CHC-ABUJA-01</p>
            </div>
        </aside>
    );
};

export default Sidebar;
