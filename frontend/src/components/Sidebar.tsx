import React from 'react';
import {
    Users,
    BarChart2,
    Settings,
    LogOut,
    Activity,
    Microscope,
    Package,
    AlertTriangle
} from 'lucide-react';

interface SidebarProps {
    activeView: 'patients' | 'analytics' | 'lab' | 'pharmacy' | 'alerts';
    onViewChange: (view: 'patients' | 'analytics' | 'lab' | 'pharmacy' | 'alerts') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
    const navItems = [
        { id: 'patients', label: 'Patients', icon: <Users size={20} /> },
        { id: 'lab', label: 'Diagnostic Lab', icon: <Microscope size={20} /> },
        { id: 'pharmacy', label: 'Pharmacy', icon: <Package size={20} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
        { id: 'alerts', label: 'Alert Center', icon: <AlertTriangle size={20} /> },
    ];

    return (
        <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen fixed left-0 top-0 z-20">
            <div className="p-6 flex items-center gap-3">
                <div className="p-2 bg-primary text-white rounded-lg shadow-lg shadow-primary/20">
                    <Activity size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-text-main uppercase tracking-widest">CareLink</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeView === item.id
                            ? 'bg-primary/10 text-primary shadow-sm border-l-4 border-primary'
                            : 'text-text-muted hover:bg-background hover:text-text-main'
                            }`}
                    >
                        {item.icon}
                        {item.label}
                        {item.id === 'alerts' && <div className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-border space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-text-muted hover:bg-background transition-all">
                    <Settings size={20} />
                    Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-all">
                    <LogOut size={20} />
                    Logout
                </button>
            </div>

            <div className="p-4 bg-background/50 m-4 rounded-2xl border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Global Link Active</span>
                </div>
                <p className="text-[10px] text-text-muted">Federated Health Sync...</p>
            </div>
        </aside>
    );
};

export default Sidebar;
