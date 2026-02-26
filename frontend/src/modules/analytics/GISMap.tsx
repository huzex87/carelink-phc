import React, { useState } from 'react';
import { Map as MapIcon, Layers, Shield, Activity, Target, Download, Filter } from 'lucide-react';

const GISMap = () => {
    const [activeLayer, setActiveLayer] = useState<'morbidity' | 'resources' | 'outreach'>('morbidity');

    return (
        <div className="max-w-7xl mx-auto px-6 h-[calc(100vh-140px)] flex flex-col">
            <header className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
                        <MapIcon className="text-primary" size={32} />
                        GIS Intelligence Hub
                    </h1>
                    <p className="text-text-muted mt-1 font-medium italic">Spatial Health Intelligence | Kano State Municipal Domain</p>
                </div>

                <div className="flex gap-3">
                    <button className="btn-secondary px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                        <Download size={16} /> Export Shapefiles
                    </button>
                    <button className="bg-primary text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        Live Stream View
                    </button>
                </div>
            </header>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Map Control Sidebar */}
                <aside className="w-72 flex flex-col gap-6">
                    <div className="glass-card p-6">
                        <h3 className="text-xs font-black text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Layers size={14} className="text-primary" /> Intelligence Layers
                        </h3>

                        <div className="space-y-2">
                            {[
                                { id: 'morbidity', label: 'Morbidity Heatmap', icon: <Activity size={16} />, color: 'bg-red-500' },
                                { id: 'resources', label: 'Facility Resources', icon: <Target size={16} />, color: 'bg-primary' },
                                { id: 'outreach', label: 'CHV Outreach Density', icon: <Shield size={16} />, color: 'bg-emerald-500' },
                            ].map(layer => (
                                <button
                                    key={layer.id}
                                    onClick={() => setActiveLayer(layer.id as any)}
                                    className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${activeLayer === layer.id
                                            ? 'bg-surface border-primary ring-2 ring-primary/20 shadow-lg'
                                            : 'bg-background border-border hover:border-text-muted/30'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${activeLayer === layer.id ? 'bg-primary text-white' : 'bg-surface text-text-muted'}`}>
                                        {layer.icon}
                                    </div>
                                    <span className={`text-xs font-bold ${activeLayer === layer.id ? 'text-text-main' : 'text-text-muted'}`}>
                                        {layer.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 flex-1">
                        <h3 className="text-xs font-black text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Filter size={14} className="text-primary" /> Spatial Filters
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-text-muted uppercase block mb-1">District / LGA</label>
                                <select className="w-full bg-background border border-border p-2 rounded-lg text-xs font-bold outline-none">
                                    <option>Kano Municipal</option>
                                    <option>Fagge</option>
                                    <option>Dala</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-text-muted uppercase block mb-1">Time Dimension</label>
                                <select className="w-full bg-background border border-border p-2 rounded-lg text-xs font-bold outline-none">
                                    <option>Current (Real-time)</option>
                                    <option>Last 7 Days</option>
                                    <option>Maternal Season (Jul-Sep)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Map Rendering Area */}
                <main className="flex-1 relative glass-card p-2 bg-slate-900 group">
                    {/* Mock Map Background - In production this would be Leaflet/OpenStreetMap */}
                    <div className="absolute inset-2 rounded-xl bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/8.5,12.0,11/1200x800?access_token=pk.placeholder')] bg-cover bg-center brightness-50 contrast-125 saturate-50 overflow-hidden">
                        {/* Heatmap Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 via-transparent to-red-600/10 mix-blend-screen animate-pulse" />

                        {/* Mock Markers */}
                        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] border-2 border-white animate-ping" />
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)] border-2 border-white cursor-pointer hover:scale-150 transition-transform">
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-lg text-[10px] font-black text-slate-900 whitespace-nowrap shadow-2xl scale-0 group-hover:scale-100 transition-transform">KANO MUNICIPAL PHC</div>
                        </div>
                    </div>

                    {/* Map Key Overlay */}
                    <div className="absolute bottom-6 right-6 p-4 glass-card bg-slate-800/80 border-slate-700/50 backdrop-blur-md">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vulnerability Scale</h4>
                        <div className="h-2 w-48 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 mb-2" />
                        <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
                            <span>Low Risk</span>
                            <span>Epidemic Threshold</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default GISMap;
