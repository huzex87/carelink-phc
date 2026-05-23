import React, { useCallback, useEffect, useState } from 'react';
import {
    TrendingUp, Activity, Users, RefreshCw,
    Heart, Shield, Microscope, Stethoscope, BedDouble,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    getDashboardStats, getMonthlyPerformance,
    DashboardStats, PerformanceMetric,
} from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';

// ── Icon map for monthly performance metrics ──────────────────────────────────

const METRIC_ICONS: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
    opd: { icon: <Activity    size={18} />, color: 'text-primary',    bg: 'bg-primary/10',  border: 'border-primary'    },
    anc: { icon: <Heart       size={18} />, color: 'text-pink-600',   bg: 'bg-pink-50',     border: 'border-pink-400'   },
    imm: { icon: <Shield      size={18} />, color: 'text-blue-600',   bg: 'bg-blue-50',     border: 'border-blue-400'   },
    lab: { icon: <Microscope  size={18} />, color: 'text-purple-600', bg: 'bg-purple-50',   border: 'border-purple-400' },
    del: { icon: <Stethoscope size={18} />, color: 'text-rose-600',   bg: 'bg-rose-50',     border: 'border-rose-400'   },
};

// ── Summary Card ──────────────────────────────────────────────────────────────

interface SummaryCardProps {
    label: string;
    value: number | string;
    sub: string;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    border: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, sub, icon, iconBg, iconColor, border }) => (
    <div className={`bg-white rounded-2xl border border-border/50 shadow-sm p-4 border-l-4 ${border}`}>
        <div className="flex items-center gap-3">
            <div className={`hidden sm:flex p-2 rounded-xl ${iconBg}`}>
                <span className={iconColor}>{icon}</span>
            </div>
            <div>
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-black text-zinc-900 leading-none mt-0.5">{value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>
            </div>
        </div>
    </div>
);

// ── Performance Row ───────────────────────────────────────────────────────────

const PerformanceRow: React.FC<{ metric: PerformanceMetric; delay: number }> = ({ metric, delay }) => {
    const cfg  = METRIC_ICONS[metric.icon] ?? METRIC_ICONS.opd;
    const pct  = Math.min(Math.round((metric.value / Math.max(metric.target, 1)) * 100), 100);
    const over = metric.value > metric.target;

    return (
        <div className="flex items-center gap-4 py-3 border-b border-border/40 last:border-0">
            <div className={`flex-shrink-0 p-2 rounded-xl ${cfg.bg}`}>
                <span className={cfg.color}>{cfg.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-zinc-800">{metric.label}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900 font-mono">{metric.value.toLocaleString()}</span>
                        <span className="text-xs text-zinc-400">/ {metric.target.toLocaleString()}</span>
                        {over ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                +{((metric.value / metric.target - 1) * 100).toFixed(0)}%
                            </span>
                        ) : (
                            <span className="text-[10px] font-medium text-zinc-400">{pct}%</span>
                        )}
                    </div>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay }}
                        className={`h-full rounded-full ${over ? 'bg-emerald-500' : 'bg-primary'}`}
                    />
                </div>
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────

const FacilityDashboard: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats]     = useState<DashboardStats | null>(null);
    const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
    const [loading, setLoading]   = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async (silent = false) => {
        if (silent) setRefreshing(true); else setLoading(true);
        try {
            const [s, m] = await Promise.all([getDashboardStats(), getMonthlyPerformance()]);
            setStats(s);
            setMetrics(m);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const month = new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' });

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto flex items-center justify-center py-24">
                <RefreshCw size={28} className="animate-spin text-primary" />
            </div>
        );
    }

    const s = stats!;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2.5">
                        <TrendingUp size={26} className="text-primary" />
                        Facility Analytics
                    </h1>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        {user?.phcName} &middot; {month}
                    </p>
                </div>
                <button
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                    className="p-2.5 rounded-xl border border-border hover:bg-zinc-50 transition-colors disabled:opacity-60 self-start sm:self-auto"
                    aria-label="Refresh analytics"
                >
                    <RefreshCw size={16} className={`text-zinc-500 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    label="Total Patients"
                    value={s.totalPatients.toLocaleString()}
                    sub="Registered"
                    icon={<Users size={18} />}
                    iconBg="bg-primary/10"
                    iconColor="text-primary"
                    border="border-primary"
                />
                <SummaryCard
                    label="Today Seen"
                    value={s.completed}
                    sub="Consultations"
                    icon={<Activity size={18} />}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                    border="border-emerald-400"
                />
                <SummaryCard
                    label="In Progress"
                    value={s.inProgress}
                    sub="Active encounters"
                    icon={<Stethoscope size={18} />}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                    border="border-blue-400"
                />
                <SummaryCard
                    label="Inpatients"
                    value={s.inpatients}
                    sub={`${s.bedsAvailable} beds available`}
                    icon={<BedDouble size={18} />}
                    iconBg="bg-violet-50"
                    iconColor="text-violet-600"
                    border="border-violet-400"
                />
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Performance — 2/3 width */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/40">
                        <h2 className="text-base font-bold text-zinc-900">Monthly Performance vs Target</h2>
                        <p className="text-xs text-zinc-400 mt-0.5">{month}</p>
                    </div>
                    <div className="px-5 py-2">
                        {metrics.length === 0 ? (
                            <div className="text-center py-10 text-zinc-400 text-sm">No encounter data for this month.</div>
                        ) : (
                            metrics.map((m, i) => (
                                <PerformanceRow key={m.label} metric={m} delay={i * 0.08} />
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Stats — 1/3 width */}
                <div className="space-y-4">
                    {/* Queue Summary */}
                    <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-zinc-700 mb-4">Today&rsquo;s Queue</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Waiting',     value: s.todayWaiting, color: 'text-amber-600',  dot: 'bg-amber-400'   },
                                { label: 'In Progress', value: s.inProgress,   color: 'text-blue-600',   dot: 'bg-blue-400'    },
                                { label: 'Completed',   value: s.completed,    color: 'text-emerald-700',dot: 'bg-emerald-500' },
                                { label: 'Referred',    value: s.referred,     color: 'text-violet-600', dot: 'bg-violet-400'  },
                            ].map(row => (
                                <div key={row.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${row.dot}`} aria-hidden="true" />
                                        <span className="text-sm text-zinc-600">{row.label}</span>
                                    </div>
                                    <span className={`text-sm font-bold font-mono ${row.color}`}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support Services */}
                    <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-zinc-700 mb-4">Support Services</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Lab Pending',   value: s.labPending,  color: 'text-purple-600' },
                                { label: 'Rx Pending',    value: s.rxPending,   color: 'text-orange-600' },
                                { label: 'Low Stock',     value: s.lowStock,    color: s.lowStock > 0 ? 'text-red-600 font-bold' : 'text-zinc-500' },
                            ].map(row => (
                                <div key={row.label} className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-600">{row.label}</span>
                                    <span className={`text-sm font-mono ${row.color}`}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admissions Today */}
                    <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-zinc-700 mb-4">Admissions Today</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Admitted',    value: s.admissionsToday  },
                                { label: 'Discharged',  value: s.dischargesToday  },
                            ].map(row => (
                                <div key={row.label} className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-600">{row.label}</span>
                                    <span className="text-sm font-bold font-mono text-zinc-800">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacilityDashboard;
