import React from 'react';
import { Calendar, User, Activity, Microscope, Package, Share2, Clock } from 'lucide-react';

interface TimelineEvent {
    id: string;
    type: 'OPD' | 'ANC' | 'LAB' | 'RX' | 'REF';
    title: string;
    subtitle: string;
    date: string;
    details?: string;
    status?: string;
}

interface ClinicalTimelineProps {
    events: TimelineEvent[];
}

const ClinicalTimeline: React.FC<ClinicalTimelineProps> = ({ events }) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'OPD': return <Activity size={18} className="text-primary" />;
            case 'ANC': return <HeartPulse size={18} className="text-accent" />;
            case 'LAB': return <Microscope size={18} className="text-secondary" />;
            case 'RX': return <Package size={18} className="text-emerald-500" />;
            case 'REF': return <Share2 size={18} className="text-orange-500" />;
            default: return <Clock size={18} className="text-text-muted" />;
        }
    };

    const HeartPulse = ({ size, className }: { size: number, className: string }) => <Activity size={size} className={className} />;

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-8">
                <Clock size={20} className="text-primary" />
                Longitudinal Care Timeline
            </h3>

            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-border before:to-transparent">
                {events.map((event, index) => (
                    <div key={event.id} className="relative flex items-start gap-6 group">
                        <div className="absolute left-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-primary/20 shadow-sm z-10 transition-transform group-hover:scale-110">
                            {getIcon(event.type)}
                        </div>

                        <div className="ml-12 pt-1 pb-4 flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-primary tracking-widest block">{event.type}</span>
                                    <h4 className="font-bold text-text-main">{event.title}</h4>
                                </div>
                                <span className="text-[10px] font-bold text-text-muted bg-background px-2 py-0.5 rounded border border-border">
                                    {new Date(event.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-text-muted leading-relaxed">
                                {event.subtitle}
                                {event.details && <span className="block mt-2 font-medium text-text-main italic">"{event.details}"</span>}
                            </p>
                            {event.status && (
                                <div className="mt-2 text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    {event.status}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClinicalTimeline;
