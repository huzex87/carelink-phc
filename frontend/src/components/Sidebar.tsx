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
    Shield,
    X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

export type ViewType = 'dashboard' | 'patients' | 'analytics' | 'lab' | 'pharmacy' | 'alerts';

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'patients' as ViewType, label: 'Patient Registry', icon: <Users size={20} /> },
    { id: 'analytics' as ViewType, label: 'EPI Analytics', icon: <HeartPulse size={20} /> },
    { id: 'lab' as ViewType, label: 'Laboratory', icon: <Beaker size={20} /> },
    { id: 'pharmacy' as ViewType, label: 'Pharmacy', icon: <Pill size={20} /> },
    { id: 'alerts' as ViewType, label: 'Intelligence Center', icon: <Bell size={20} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, mobileOpen = false, onMobileClose }) => {
    const { user, logout } = useAuth();

    const initials = user?.displayName
        ? user.displayName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : 'U';

    return (
        <aside className={clsx(
            'w-72 h-screen fixed left-0 top-0 bg-white border-r border-zinc-200 flex flex-col z-[100]',
            'transition-transform duration-300 ease-in-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
            'lg:translate-x-0',
        )}>
            {/* Brand header */}
            <div className="p-6 pb-4 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                            <HeartPulse className="text-primary" size={20} />
                        </div>
                        <span className="text-xl font-black tracking-tight text-zinc-900">
                            CareLink <span className="text-primary">PHC</span>
                        </span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-zinc-400 pl-0.5">
                        Clinical Intelligence
                    </p>
                </div>
                {/* Close button — mobile only */}
                <button
                    onClick={onMobileClose}
                    className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* PHC badge */}
            {user && (
                <div className="mx-4 mb-3 px-3 py-2 bg-primary/5 rounded-xl border border-primary/15">
                    <p className="text-[10px] font-extrabold text-primary uppercase tracking-wider truncate">{user.phcCode}</p>
                    <p className="text-xs font-semibold text-zinc-600 truncate mt-0.5">{user.phcName}</p>
                </div>
            )}

            {/* Nav */}
            <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={clsx(
                            'w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-bold transition-all duration-200 group relative',
                            activeView === item.id
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',
                        )}
                    >
                        {activeView === item.id && (
                            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/40 rounded-full" />
                        )}
                        <span className={clsx(
                            'transition-transform duration-200',
                            activeView !== item.id && 'group-hover:scale-110',
                        )}>
                            {item.icon}
                        </span>
                        {item.label}
                        {item.id === 'alerts' && activeView !== 'alerts' && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-500/20 animate-pulse" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Bottom section */}
            <div className="p-3 space-y-1 border-t border-zinc-100 mt-2">
                <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-all group">
                    <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
                    Settings
                </button>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-bold text-red-500/80 hover:bg-red-50 hover:text-red-600 transition-all group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Sign Out
                </button>
            </div>

            {/* User identity card */}
            {user && (
                <div className="m-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold text-zinc-900 truncate">{user.displayName}</p>
                        <p className="text-[11px] text-zinc-400 font-medium truncate">@{user.username} · {user.role}</p>
                    </div>
                </div>
            )}

            {/* DHIS2 status */}
            <div className="px-4 pb-4">
                <div className="p-3 bg-gradient-to-br from-zinc-50 to-white rounded-xl border border-zinc-200 relative overflow-hidden group hover:border-primary/30 transition-colors cursor-default">
                    <div className="absolute -right-3 -top-3 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Shield size={60} />
                    </div>
                    <div className="flex items-center gap-2 mb-0.5 relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full ring-4 ring-green-500/20 animate-pulse" />
                        <span className="text-[10px] font-extrabold text-green-600 tracking-widest uppercase">Secure Link</span>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium relative">Connected to DHIS2 Core</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5 font-mono uppercase">Node: CHC-KT-01</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
