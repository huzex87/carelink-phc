import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Bell, Map, Loader2 } from 'lucide-react';

const AlertCenter = () => {
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        // Simulate analyzing live morbidity data
        const timer = setTimeout(() => {
            setAlerts([
                { id: '1', disease: 'Malaria', count: 72, threshold: 50, facility: 'Kano-City PHC', severity: 'high', time: '14 mins ago' },
                { id: '2', disease: 'Cholera', count: 2, threshold: 1, facility: 'Wudil Rural Clinic', severity: 'critical', time: '2 hours ago' },
            ]);
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500 text-white animate-pulse';
            case 'high': return 'bg-orange-500 text-white';
            case 'medium': return 'bg-amber-500 text-white';
            default: return 'bg-sky-500 text-white';
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
                    <AlertTriangle className="text-primary" size={32} />
                    Epidemic Alert Center
                </h1>
                <p className="text-text-muted mt-2">AI-driven anomaly detection for state-wide morbidity monitoring</p>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-primary mb-4" size={48} />
                    <p className="text-text-muted font-semibold">Running Anomaly Detection Engine...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-text-main flex items-center gap-2 mb-4">
                            <Bell size={20} className="text-primary" />
                            Active Alerts
                        </h2>

                        {alerts.map(alert => (
                            <div key={alert.id} className="glass-card overflow-hidden transition-transform hover:scale-[1.01]">
                                <div className={`px-6 py-2 text-xs font-black uppercase tracking-widest ${getSeverityStyles(alert.severity)}`}>
                                    {alert.severity} Incident Detected
                                </div>
                                <div className="p-6 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-bold text-text-main">{alert.disease} Spike</h3>
                                        <p className="text-text-muted mt-1">Detected at: <span className="font-bold">{alert.facility}</span></p>
                                        <p className="text-sm text-text-muted mt-2 font-mono">
                                            Current: {alert.count} cases | Threshold: {alert.threshold}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-text-muted block mb-3 uppercase font-bold">{alert.time}</span>
                                        <button className="btn-primary py-2 px-6">Initiate Response</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-8">
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                                <Shield size={18} className="text-emerald-500" />
                                System Integrity
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-muted">ML Engine Status</span>
                                    <span className="text-xs font-bold text-emerald-500 bg-emerald-100 px-2 py-1 rounded">HEALTHY</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-muted">Last Data Batch</span>
                                    <span className="text-xs font-bold text-text-main">3.2k Records</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-muted">Processing Latency</span>
                                    <span className="text-xs font-bold text-text-main">42ms</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                                <Map size={18} className="text-primary" />
                                LGA Hotspots
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-sm font-semibold text-text-main">Kano Municipal</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                    <span className="text-sm font-semibold text-text-main">Wudil</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-50">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-sm font-semibold text-text-main">Minjibir (Stable)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlertCenter;
