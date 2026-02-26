import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Activity, Calendar, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Indicator {
    id: string;
    name: string;
    value: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
    color: string;
}

const FacilityDashboard: React.FC = () => {
    const [indicators, setIndicators] = useState<Indicator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/v1/analytics/facility');
                const data = await response.json();
                setIndicators(data.summary);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Facility Performance</h1>
                    <p className="text-text-muted">Real-time public health indicators & trends</p>
                </div>
                <div className="flex gap-3">
                    <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-semibold">
                        <Calendar size={16} className="text-primary" />
                        Last 30 Days
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <TrendingUp size={18} /> Generate Report
                    </button>
                </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {indicators.map((indicator) => (
                    <div key={indicator.id} className="glass-card p-6 hover:translate-y-[-4px] transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-${indicator.color}-500/10 text-${indicator.color}-500 rounded-xl group-hover:scale-110 transition-transform`}>
                                <Activity size={20} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${indicator.trend === 'up' ? 'text-emerald-500' : 'text-orange-500'}`}>
                                {indicator.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {indicator.trend === 'up' ? '+12%' : '-3%'}
                            </div>
                        </div>
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">{indicator.name}</h3>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold">{indicator.value}</span>
                            <span className="text-sm text-text-muted">/ {indicator.target}</span>
                        </div>
                        <div className="mt-4 w-full bg-background rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full bg-${indicator.color}-500 transition-all duration-1000`}
                                style={{ width: `${(indicator.value / indicator.target) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trend Chart Placeholder */}
                <div className="lg:col-span-2 glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold">Patient Volume Trends</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                                New Patients
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
                                <div className="w-3 h-3 bg-accent rounded-full"></div>
                                Follow-ups
                            </div>
                        </div>
                    </div>
                    <div className="h-64 w-full flex items-end justify-between gap-4 px-2">
                        {[40, 65, 45, 80, 55, 90, 70].map((v, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                <div className="relative w-full">
                                    <div
                                        className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary/40 transition-all duration-1000 flex items-end justify-center"
                                        style={{ height: `${v}%` }}
                                    >
                                        <div
                                            className="w-2/3 bg-primary rounded-t-lg transition-all duration-1000 delay-300"
                                            style={{ height: `${v * 0.7}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-text-muted">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Conditions */}
                <div className="glass-card p-8">
                    <h3 className="text-xl font-bold mb-8">Morbidity Profile</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Malaria', count: 145, pct: 45, color: 'emerald' },
                            { name: 'RTI', count: 89, pct: 28, color: 'sky' },
                            { name: 'Diarrhea', count: 42, pct: 15, color: 'orange' },
                            { name: 'HTN', count: 24, pct: 7, color: 'accent' },
                        ].map((c) => (
                            <div key={c.name} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold">{c.name}</span>
                                    <span className="text-text-muted font-mono">{c.count} cases</span>
                                </div>
                                <div className="w-full bg-background rounded-full h-2">
                                    <div
                                        className={`h-full bg-${c.color}-500 rounded-full transition-all duration-1000`}
                                        style={{ width: `${c.pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 border border-border rounded-xl text-sm font-bold hover:bg-background transition-colors">
                        View Complete Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FacilityDashboard;
