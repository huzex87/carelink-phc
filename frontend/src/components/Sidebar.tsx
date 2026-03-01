import React from 'react';
import {
    LayoutDashboard,
    Users,
    HeartPulse,
    Beaker,
    Pill,
    Bell,
    Settings,
    LogOut,
    ShieldCheck,
    Shield
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
    activeView: 'patients' | 'analytics' | 'lab' | 'pharmacy' | 'alerts';
    onViewChange: (view: 'patients' | 'analytics' | 'lab' | 'pharmacy' | 'alerts') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
    const menuItems = [
        { id: 'patients', label: 'Patient Registry', icon: <Users size={22} /> },
        { id: 'analytics', label: 'Facility Analytics', icon: <HeartPulse size={22} /> },
        { id: 'lab', label: 'Laboratory Hub', icon: <Beaker size={22} /> },
        { id: 'pharmacy', label: 'Pharmacy LMIS', icon: <Pill size={22} /> },
        { id: 'alerts', label: 'Intelligence Center', icon: <Bell size={22} /> },
    ] as const;

    return (
        <aside className="w-72 h-screen fixed left-0 top-0 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-[100]">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <HeartPulse className="text-blue-500" size={24} />
                    </div>
                    <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">CareLink <span className="text-blue-500">PHC</span></span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 pl-1">Clinical Intelligence</p>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={clsx(
                            "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-bold transition-all duration-300 group relative overflow-hidden",
                            activeView === item.id
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                        )}
                    >
                        {activeView === item.id && (
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white/40 rounded-full" />
                        )}
                        <div className={clsx("transition-transform duration-300", activeView !== item.id && "group-hover:scale-110")}>
                            {item.icon}
                        </div>
                        {item.label}
                        {item.id === 'alerts' && activeView !== 'alerts' && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-500/20 animate-pulse" />
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 space-y-2">
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all group">
                    <Settings size={22} className="stroke-[2.5] group-hover:rotate-45 transition-transform duration-500" />
                    Platform Settings
                </button>
                <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-2" />
                <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-bold text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all group">
                    <LogOut size={22} className="stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
                    Secure Logout
                </button>
            </div>

            <div className="p-5 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 m-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-colors cursor-help">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Shield size={80} />
                </div>
                <div className="flex items-center gap-2 mb-1.5 relative">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full ring-4 ring-green-500/20 animate-pulse" />
                    <span className="text-[11px] font-extrabold text-green-500 tracking-widest uppercase">Secure Link</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium relative">Connected to DHIS2 Core</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono uppercase">Node: CHC-ABUJA-01</p>
            </div>
        </aside>
    );
};

export default Sidebar;
