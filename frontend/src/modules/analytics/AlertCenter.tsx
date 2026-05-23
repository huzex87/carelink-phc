import React, { useCallback, useEffect, useState } from 'react';
import {
    AlertTriangle, Bell, Shield, Package,
    Microscope, Users, RefreshCw, CheckCircle2,
} from 'lucide-react';
import { getDashboardStats, DashboardStats } from '../../services/dashboardService';
import { getPharmacyItems, getStockRisk, getMOS } from '../../services/pharmacyService';
import { useAuth } from '../../context/AuthContext';

// ── Alert model ───────────────────────────────────────────────────────────────

type AlertSeverity = 'critical' | 'high' | 'medium' | 'info';

interface Alert {
    id: string;
    severity: AlertSeverity;
    category: string;
    title: string;
    detail: string;
    icon: React.ReactNode;
}

const SEV_CONFIG: Record<AlertSeverity, { label: string; text: string; bg: string; border: string; badge: string }> = {
    critical: { label: 'Critical', text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-300',    badge: 'bg-red-100 text-red-700'    },
    high:     { label: 'High',     text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-300', badge: 'bg-orange-100 text-orange-700'},
    medium:   { label: 'Medium',   text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-300',  badge: 'bg-amber-100 text-amber-700'  },
    info:     { label: 'Info',     text: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700'    },
};

// ── Alert generation from live PouchDB data ───────────────────────────────────

async function buildAlerts(facilityName: string): Promise<Alert[]> {
    const [stats, items] = await Promise.all([
        getDashboardStats(),
        getPharmacyItems(),
    ]);

    const alerts: Alert[] = [];

    // Critical pharmacy stock
    const criticalItems = items.filter(i => getStockRisk(i) === 'critical');
    for (const item of criticalItems) {
        alerts.push({
            id: `pharm-crit-${item._id}`,
            severity: 'critical',
            category: 'Pharmacy',
            title: `Critical Stock: ${item.name}`,
            detail: `${item.quantity} ${item.unit} remaining — ${getMOS(item) === '∞' ? '∞' : getMOS(item) + ' month'} of stock`,
            icon: <Package size={18} />,
        });
    }

    // Low stock (high risk) items
    const highItems = items.filter(i => getStockRisk(i) === 'high');
    if (highItems.length > 0) {
        alerts.push({
            id: 'pharm-high',
            severity: 'high',
            category: 'Pharmacy',
            title: `${highItems.length} Item${highItems.length > 1 ? 's' : ''} at Low Stock`,
            detail: highItems.slice(0, 3).map(i => i.name).join(', ') + (highItems.length > 3 ? ` +${highItems.length - 3} more` : ''),
            icon: <Package size={18} />,
        });
    }

    // Lab backlog
    if (stats.labPending > 0) {
        alerts.push({
            id: 'lab-pending',
            severity: stats.labPending >= 5 ? 'high' : 'medium',
            category: 'Laboratory',
            title: `${stats.labPending} Lab Test${stats.labPending > 1 ? 's' : ''} Pending`,
            detail: 'Results awaited in the laboratory queue',
            icon: <Microscope size={18} />,
        });
    }

    // Queue backlog
    if (stats.todayWaiting > 10) {
        alerts.push({
            id: 'queue-backlog',
            severity: 'medium',
            category: 'OPD Queue',
            title: `${stats.todayWaiting} Patients Waiting`,
            detail: 'Consider opening an additional consultation room',
            icon: <Users size={18} />,
        });
    }

    // Rx pending
    if (stats.rxPending > 5) {
        alerts.push({
            id: 'rx-pending',
            severity: 'medium',
            category: 'Pharmacy',
            title: `${stats.rxPending} Prescriptions Pending Dispensing`,
            detail: 'Patients waiting for medicines to be dispensed',
            icon: <Package size={18} />,
        });
    }

    // All clear — no issues
    if (alerts.length === 0) {
        alerts.push({
            id: 'all-clear',
            severity: 'info',
            category: 'System',
            title: 'All Systems Normal',
            detail: `${facilityName} is operating within normal parameters`,
            icon: <CheckCircle2 size={18} />,
        });
    }

    return alerts;
}

// ── Alert Card ────────────────────────────────────────────────────────────────

const AlertCard: React.FC<{ alert: Alert }> = ({ alert }) => {
    const c = SEV_CONFIG[alert.severity];
    return (
        <div className={`rounded-2xl border ${c.border} ${c.bg} p-4`}>
            <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-0.5 ${c.text}`}>{alert.icon}</div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>
                            {c.label}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">
                            {alert.category}
                        </span>
                    </div>
                    <p className={`text-sm font-bold ${c.text}`}>{alert.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{alert.detail}</p>
                </div>
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────

const AlertCenter: React.FC = () => {
    const { user } = useAuth();
    const [alerts, setAlerts]     = useState<Alert[]>([]);
    const [stats, setStats]       = useState<DashboardStats | null>(null);
    const [loading, setLoading]   = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async (silent = false) => {
        if (silent) setRefreshing(true); else setLoading(true);
        try {
            const [generated, s] = await Promise.all([
                buildAlerts(user?.phcName ?? 'Facility'),
                getDashboardStats(),
            ]);
            setAlerts(generated);
            setStats(s);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.phcName]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const highCount     = alerts.filter(a => a.severity === 'high').length;

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto flex items-center justify-center py-24">
                <RefreshCw size={28} className="animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2.5">
                        <Bell size={26} className="text-primary" />
                        Alert Center
                    </h1>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        {user?.phcName} &middot; Live monitoring
                    </p>
                </div>
                <button
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                    className="p-2.5 rounded-xl border border-border hover:bg-zinc-50 transition-colors disabled:opacity-60 self-start sm:self-auto"
                    aria-label="Refresh alerts"
                >
                    <RefreshCw size={16} className={`text-zinc-500 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Alert Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Critical',  value: criticalCount,                                    border: 'border-red-500',    text: 'text-red-600'    },
                    { label: 'High',      value: highCount,                                         border: 'border-orange-400', text: 'text-orange-600' },
                    { label: 'Total',     value: alerts.filter(a => a.severity !== 'info').length,  border: 'border-amber-400',  text: 'text-amber-700'  },
                    { label: 'Systems OK',value: criticalCount === 0 && highCount === 0 ? 'Yes':'No', border: 'border-primary',  text: criticalCount === 0 && highCount === 0 ? 'text-primary' : 'text-red-600' },
                ].map(card => (
                    <div key={card.label} className={`bg-white rounded-2xl border border-border/50 shadow-sm p-4 border-l-4 ${card.border}`}>
                        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">{card.label}</p>
                        <p className={`text-2xl font-black leading-none mt-1 ${card.text}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alert List — 2/3 */}
                <div className="lg:col-span-2 space-y-3">
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
                        Active Alerts ({alerts.length})
                    </h2>
                    {alerts.map(a => <AlertCard key={a.id} alert={a} />)}
                </div>

                {/* Side Panel — 1/3 */}
                <div className="space-y-4">
                    {/* System Status */}
                    <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center gap-2">
                            <Shield size={16} className="text-emerald-500" />
                            System Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-500">Database</span>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Online</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-500">Sync Mode</span>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Offline-First</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-500">Total Patients</span>
                                <span className="text-sm font-bold text-zinc-800 font-mono">{stats?.totalPatients ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-500">Lab Queue</span>
                                <span className={`text-sm font-bold font-mono ${(stats?.labPending ?? 0) > 0 ? 'text-orange-600' : 'text-zinc-500'}`}>
                                    {stats?.labPending ?? '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Facility Info */}
                    <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center gap-2">
                            <AlertTriangle size={16} className="text-primary" />
                            Facility
                        </h3>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-zinc-800">{user?.phcName}</p>
                            <p className="text-xs text-zinc-400 font-mono">{user?.phcCode}</p>
                            <p className="text-xs text-zinc-400">{user?.role}</p>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="bg-zinc-50 rounded-2xl border border-border/40 p-5">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">Severity Guide</p>
                        <div className="space-y-2">
                            {(['critical', 'high', 'medium', 'info'] as AlertSeverity[]).map(sev => {
                                const c = SEV_CONFIG[sev];
                                return (
                                    <div key={sev} className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${sev === 'critical' ? 'bg-red-500' : sev === 'high' ? 'bg-orange-400' : sev === 'medium' ? 'bg-amber-400' : 'bg-blue-400'}`} aria-hidden="true" />
                                        <span className="text-xs text-zinc-600 font-medium">{c.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertCenter;
