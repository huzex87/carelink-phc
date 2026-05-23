import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Activity, CheckCircle2, ArrowRightLeft,
    FlaskConical, Pill, Package, UserPlus,
    CalendarDays, Clock, UserX, CalendarCheck,
    BedDouble, Hospital, LogIn, LogOut,
    RefreshCw, ChevronRight, Stethoscope,
} from 'lucide-react';
import {
    getDashboardStats, getMonthlyPerformance, getLiveQueue,
    DashboardStats, PerformanceMetric, QueueEntry,
} from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

interface StatCardDef {
    key: keyof DashboardStats;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    border: string;
    bg: string;
    iconColor: string;
    numColor: string;
}

const STAT_CARDS: StatCardDef[] = [
    {
        key: 'todayWaiting', title: 'TODAY WAITING', subtitle: 'patients in queue',
        icon: <Users size={19} />,
        border: 'border-l-blue-500', bg: 'bg-blue-50', iconColor: 'text-blue-500', numColor: 'text-blue-600',
    },
    {
        key: 'inProgress', title: 'IN PROGRESS', subtitle: 'currently being seen',
        icon: <Activity size={19} />,
        border: 'border-l-orange-500', bg: 'bg-orange-50', iconColor: 'text-orange-500', numColor: 'text-orange-600',
    },
    {
        key: 'completed', title: 'COMPLETED', subtitle: 'today',
        icon: <CheckCircle2 size={19} />,
        border: 'border-l-green-500', bg: 'bg-green-50', iconColor: 'text-green-500', numColor: 'text-green-600',
    },
    {
        key: 'referred', title: 'REFERRED', subtitle: 'today',
        icon: <ArrowRightLeft size={19} />,
        border: 'border-l-purple-500', bg: 'bg-purple-50', iconColor: 'text-purple-500', numColor: 'text-purple-600',
    },
    {
        key: 'labPending', title: 'LAB PENDING', subtitle: 'tests outstanding',
        icon: <FlaskConical size={19} />,
        border: 'border-l-sky-500', bg: 'bg-sky-50', iconColor: 'text-sky-500', numColor: 'text-sky-600',
    },
    {
        key: 'rxPending', title: 'RX PENDING', subtitle: 'prescriptions',
        icon: <Pill size={19} />,
        border: 'border-l-emerald-500', bg: 'bg-emerald-50', iconColor: 'text-emerald-500', numColor: 'text-emerald-600',
    },
    {
        key: 'lowStock', title: 'LOW STOCK', subtitle: 'items below reorder',
        icon: <Package size={19} />,
        border: 'border-l-red-500', bg: 'bg-red-50', iconColor: 'text-red-500', numColor: 'text-red-600',
    },
    {
        key: 'totalPatients', title: 'TOTAL PATIENTS', subtitle: 'registered',
        icon: <UserPlus size={19} />,
        border: 'border-l-teal-500', bg: 'bg-teal-50', iconColor: 'text-teal-500', numColor: 'text-teal-600',
    },
    {
        key: 'appointmentsToday', title: 'APPOINTMENTS TODAY', subtitle: 'booked',
        icon: <CalendarDays size={19} />,
        border: 'border-l-blue-400', bg: 'bg-blue-50', iconColor: 'text-blue-400', numColor: 'text-blue-500',
    },
    {
        key: 'awaitingCheckIn', title: 'AWAITING CHECK-IN', subtitle: 'scheduled',
        icon: <Clock size={19} />,
        border: 'border-l-amber-500', bg: 'bg-amber-50', iconColor: 'text-amber-500', numColor: 'text-amber-600',
    },
    {
        key: 'noShows', title: 'NO-SHOWS', subtitle: 'today',
        icon: <UserX size={19} />,
        border: 'border-l-rose-500', bg: 'bg-rose-50', iconColor: 'text-rose-500', numColor: 'text-rose-600',
    },
    {
        key: 'totalAppointments', title: 'TOTAL APPOINTMENTS', subtitle: 'all time',
        icon: <CalendarCheck size={19} />,
        border: 'border-l-slate-400', bg: 'bg-slate-50', iconColor: 'text-slate-400', numColor: 'text-slate-600',
    },
    {
        key: 'inpatients', title: 'INPATIENTS', subtitle: 'currently admitted',
        icon: <BedDouble size={19} />,
        border: 'border-l-cyan-500', bg: 'bg-cyan-50', iconColor: 'text-cyan-500', numColor: 'text-cyan-600',
    },
    {
        key: 'bedsAvailable', title: 'BEDS AVAILABLE', subtitle: 'across all wards',
        icon: <Hospital size={19} />,
        border: 'border-l-cyan-400', bg: 'bg-cyan-50', iconColor: 'text-cyan-400', numColor: 'text-cyan-600',
    },
    {
        key: 'admissionsToday', title: 'ADMISSIONS TODAY', subtitle: 'new admissions',
        icon: <LogIn size={19} />,
        border: 'border-l-indigo-500', bg: 'bg-indigo-50', iconColor: 'text-indigo-500', numColor: 'text-indigo-600',
    },
    {
        key: 'dischargesToday', title: 'DISCHARGES TODAY', subtitle: 'discharged',
        icon: <LogOut size={19} />,
        border: 'border-l-gray-400', bg: 'bg-gray-50', iconColor: 'text-gray-400', numColor: 'text-gray-500',
    },
];

const PERF_COLORS: Record<string, string> = {
    opd: 'bg-blue-500',
    anc: 'bg-rose-500',
    imm: 'bg-orange-500',
    lab: 'bg-amber-500',
    del: 'bg-green-500',
};

const PRIORITY_CLASSES: Record<string, string> = {
    Emergency: 'bg-red-100 text-red-700 border border-red-200',
    Urgent: 'bg-orange-100 text-orange-700 border border-orange-200',
    Normal: 'bg-gray-100 text-gray-600 border border-gray-200',
    'Child Health': 'bg-blue-100 text-blue-700 border border-blue-200',
};

const STATUS_CLASSES: Record<string, string> = {
    Waiting: 'bg-amber-100 text-amber-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    Admitted: 'bg-purple-100 text-purple-700',
};

interface Props {
    onOpenQueue: () => void;
}

const cardVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const OverviewDashboard: React.FC<Props> = ({ onOpenQueue }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [performance, setPerformance] = useState<PerformanceMetric[]>([]);
    const [queue, setQueue] = useState<QueueEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const monthLabel = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

    const fetchAll = useCallback(async (silent = false) => {
        silent ? setRefreshing(true) : setLoading(true);
        const [s, p, q] = await Promise.all([
            getDashboardStats(),
            getMonthlyPerformance(),
            getLiveQueue(),
        ]);
        setStats(s);
        setPerformance(p);
        setQueue(q);
        setLoading(false);
        setRefreshing(false);
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">
                        Welcome, {user?.displayName || 'User'}
                    </h1>
                    <p className="text-text-muted font-medium text-sm mt-0.5">
                        Today is {dateStr} — {user?.role || 'PHC'} dashboard
                    </p>
                </div>
                <button
                    onClick={() => fetchAll(true)}
                    disabled={refreshing}
                    className="btn-secondary self-start sm:self-center gap-2 py-2 px-4 text-sm"
                >
                    <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stat Cards */}
            <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
            >
                {STAT_CARDS.map(card => (
                    <motion.div
                        key={card.key}
                        variants={cardVariants}
                        className={`bg-white rounded-2xl border border-border/50 border-l-4 ${card.border} p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-shadow cursor-default`}
                    >
                        <div className="flex items-start gap-2.5 sm:gap-3">
                            {/* Icon — only visible on sm+ */}
                            <div className={`hidden sm:flex shrink-0 w-8 h-8 ${card.bg} rounded-xl items-center justify-center ${card.iconColor}`}>
                                {card.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-text-muted leading-tight mb-1 truncate">
                                    {card.title}
                                </p>
                                <p className={`text-2xl sm:text-3xl font-black leading-none ${card.numColor}`}>
                                    {stats ? stats[card.key] : '—'}
                                </p>
                                <p className="text-[10px] sm:text-[11px] text-text-muted/70 font-medium mt-0.5 truncate">
                                    {card.subtitle}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Monthly Performance */}
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-5 sm:p-6">
                <h2 className="text-base sm:text-lg font-black text-text-main mb-5">
                    Monthly Performance — {monthLabel}
                </h2>
                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                    {performance.map(metric => {
                        const pct = metric.target > 0 ? Math.min(Math.round((metric.value / metric.target) * 100), 100) : 0;
                        return (
                            <div key={metric.label}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-bold text-text-main">{metric.label}</span>
                                    <span className="text-xs font-bold text-text-muted tabular-nums">
                                        {metric.value} / {metric.target}{' '}
                                        <span className="text-text-muted/60">({pct}%)</span>
                                    </span>
                                </div>
                                <div className="h-2.5 bg-border/40 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${PERF_COLORS[metric.icon] || 'bg-primary'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 1.2, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Live Clinical Queue */}
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border/40">
                    <h2 className="text-base sm:text-lg font-black text-text-main">Live Clinical Queue</h2>
                    <button
                        onClick={onOpenQueue}
                        className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                    >
                        Open <ChevronRight size={15} />
                    </button>
                </div>

                {queue.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center px-4">
                        <Stethoscope size={38} className="text-text-muted/20 mb-3" />
                        <p className="font-bold text-text-muted">No patients in queue today</p>
                        <p className="text-xs text-text-muted/60 mt-1">
                            New entries will appear here as patients check in.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[480px]">
                            <thead>
                                <tr className="bg-background border-b border-border/40">
                                    {['#', 'Patient', 'Station', 'Priority', 'Status', 'Time'].map((h, i) => (
                                        <th
                                            key={h}
                                            className={`px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-text-muted ${
                                                i === 2 ? 'hidden md:table-cell' : i === 5 ? 'hidden sm:table-cell' : ''
                                            }`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {queue.map(entry => (
                                    <tr key={entry.id} className="hover:bg-background/70 transition-colors">
                                        <td className="px-4 py-3.5 font-bold text-text-muted w-10">{entry.number}</td>
                                        <td className="px-4 py-3.5">
                                            <p className="font-bold text-text-main leading-tight">{entry.patientName}</p>
                                            <p className="text-[11px] text-text-muted font-mono mt-0.5">
                                                {entry.ageInfo}{entry.patientId ? ` · ${entry.patientId}` : ''}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3.5 text-text-muted font-medium hidden md:table-cell">
                                            {entry.station}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${PRIORITY_CLASSES[entry.priority] || 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                                {entry.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_CLASSES[entry.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {entry.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-text-muted text-xs font-medium hidden sm:table-cell whitespace-nowrap">
                                            {entry.timeAgo}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverviewDashboard;
