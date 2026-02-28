import React, { useEffect, useState } from 'react';
import { TrendingUp, Activity, Calendar, ArrowUpRight, ArrowDownRight, Download, Filter, Droplets, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Indicator {
    id: string;
    name: string;
    value: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
    colorInfo: {
        text: string;
        bg: string;
        border: string;
        progress: string;
    };
    icon: React.ReactNode;
}

const FacilityDashboard: React.FC = () => {
    const [indicators, setIndicators] = useState<Indicator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulated API fetch with visually mapped tailwind colors to prevent purging
        const fetchAnalytics = async () => {
            try {
                // Simulating network delay for smooth entry animation
                await new Promise(res => setTimeout(res, 600));

                const mockData: Indicator[] = [
                    {
                        id: '1', name: 'ANC Coverage', value: 342, target: 400, trend: 'up',
                        colorInfo: { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', progress: 'bg-primary' },
                        icon: <Activity size={22} className="stroke-[2.5] text-primary" />
                    },
                    {
                        id: '2', name: 'Immunization', value: 890, target: 1000, trend: 'up',
                        colorInfo: { text: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', progress: 'bg-secondary' },
                        icon: <Droplets size={22} className="stroke-[2.5] text-secondary" />
                    },
                    {
                        id: '3', name: 'Malaria Cases', value: 125, target: 100, trend: 'down',
                        colorInfo: { text: 'text-error', bg: 'bg-error/10', border: 'border-error/20', progress: 'bg-error' },
                        icon: <Target size={22} className="stroke-[2.5] text-error" />
                    },
                    {
                        id: '4', name: 'Total Referrals', value: 45, target: 50, trend: 'stable',
                        colorInfo: { text: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20', progress: 'bg-accent' },
                        icon: <Zap size={22} className="stroke-[2.5] text-accent" />
                    },
                ];
                setIndicators(mockData);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <div className="max-w-7xl mx-auto p-2">

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
            >
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-text-main mb-1">EPI Analytics Center</h1>
                    <p className="text-text-muted font-medium">Real-time public health indicators & epidemiological trends</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="glass-card px-5 py-3 flex items-center gap-3 text-sm font-bold text-text-main shadow-sm border-white/80">
                        <Calendar size={18} className="text-primary" />
                        Last 30 Days
                    </div>
                    <button className="btn-secondary">
                        <Filter size={18} />
                    </button>
                    <button className="btn-primary">
                        <Download size={18} /> Export Report
                    </button>
                </div>
            </motion.div>

            {/* KPI Cards */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
                >
                    {indicators.map((indicator) => (
                        <motion.div
                            key={indicator.id}
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={`glass-card p-6 border ${indicator.colorInfo.border} hover:shadow-xl transition-all duration-300 relative overflow-hidden group cursor-default`}
                        >
                            {/* Decorative Background gradient */}
                            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${indicator.colorInfo.bg} blur-3xl group-hover:blur-xl transition-all duration-500`} />

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`p-3.5 ${indicator.colorInfo.bg} rounded-2xl`}>
                                    {indicator.icon}
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black tracking-wider ${indicator.trend === 'up' ? 'bg-success/10 text-success-dark' :
                                        indicator.trend === 'down' ? 'bg-error/10 text-error-dark' : 'bg-surface-muted text-text-muted'
                                    }`}>
                                    {indicator.trend === 'up' ? <ArrowUpRight size={14} className="stroke-[3]" /> :
                                        indicator.trend === 'down' ? <ArrowDownRight size={14} className="stroke-[3]" /> :
                                            <TrendingUp size={14} className="stroke-[3]" />}
                                    {indicator.trend === 'up' ? '+12.5%' : indicator.trend === 'down' ? '-4.2%' : '0.0%'}
                                </div>
                            </div>

                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 relative z-10">{indicator.name}</h3>
                            <div className="flex items-end gap-2 relative z-10">
                                <span className="text-4xl font-black text-text-main tracking-tighter">{indicator.value}</span>
                                <span className="text-sm font-semibold text-text-muted mb-1.5">/ {indicator.target}</span>
                            </div>

                            {/* Animated Progress Bar */}
                            <div className="mt-6 w-full bg-border/50 rounded-full h-2.5 overflow-hidden relative z-10 p-0.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((indicator.value / indicator.target) * 100, 100)}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                    className={`h-full rounded-full ${indicator.colorInfo.progress} relative shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full h-full" />
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Charts Section */}
            {!loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Main Trend Chart */}
                    <div className="lg:col-span-2 glass-card p-8 border-white/60">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-text-main">Epidemiological Volume</h3>
                                <p className="text-sm text-text-muted font-medium mt-1">7-Day rolling average vs baseline</p>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-text-main bg-background px-3 py-1.5 rounded-lg border border-border/50">
                                    <div className="w-3 h-3 bg-gradient-to-tr from-primary to-primary-light rounded-sm shadow-sm"></div>
                                    New Registrations
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-text-main bg-background px-3 py-1.5 rounded-lg border border-border/50">
                                    <div className="w-3 h-3 bg-gradient-to-tr from-accent to-accent-light rounded-sm shadow-sm"></div>
                                    Clinical Encounters
                                </div>
                            </div>
                        </div>

                        {/* CSS-based Bar Chart with staggering animations */}
                        <div className="h-[280px] w-full flex items-end justify-between gap-3 px-2">
                            {[40, 65, 45, 80, 55, 90, 70].map((v, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                    <div className="relative w-full h-full flex flex-col justify-end">
                                        <div className="absolute inset-0 bg-surface-muted/30 rounded-t-xl" />

                                        {/* Background Bar */}
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${v}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                                            className="w-full bg-accent/20 rounded-t-xl group-hover:bg-accent/30 transition-colors flex items-end justify-center relative shadow-inner-light"
                                        >
                                            {/* Foreground Bar */}
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${v * 0.65}%` }}
                                                transition={{ duration: 0.8, delay: (i * 0.1) + 0.3, ease: 'easeOut' }}
                                                className="w-[70%] bg-gradient-to-t from-primary-dark to-primary rounded-t-lg shadow-sm"
                                            />
                                        </motion.div>
                                    </div>
                                    <span className="text-xs font-bold text-text-muted">Day {i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Morbidity Profile */}
                    <div className="glass-card p-8 border-white/60 flex flex-col">
                        <div>
                            <h3 className="text-xl font-black text-text-main">Morbidity Breakdown</h3>
                            <p className="text-sm text-text-muted font-medium mt-1">Confirmed diagnoses distribution</p>
                        </div>

                        <div className="mt-10 space-y-7 flex-1">
                            {[
                                { name: 'Malaria (Severe)', count: 145, pct: 45, color: 'from-secondary to-secondary-light' },
                                { name: 'Resp. Tract Infection', count: 89, pct: 28, color: 'from-primary to-primary-light' },
                                { name: 'Acute Diarrhea', count: 42, pct: 15, color: 'from-warning to-yellow-300' },
                                { name: 'Hypertension', count: 24, pct: 7, color: 'from-accent to-accent-light' },
                            ].map((c, i) => (
                                <div key={c.name} className="space-y-2.5">
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="font-bold text-text-main">{c.name}</span>
                                        <span className="bg-background border border-border text-text-main px-2 py-0.5 rounded font-mono font-bold text-xs">{c.count}</span>
                                    </div>
                                    <div className="w-full bg-border/40 rounded-full h-3 p-0.5 shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${c.pct}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                                            className={`h-full rounded-full bg-gradient-to-r ${c.color} shadow-sm`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="btn-secondary w-full mt-6 py-3.5">
                            View Full ICD-10 Report
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default FacilityDashboard;
