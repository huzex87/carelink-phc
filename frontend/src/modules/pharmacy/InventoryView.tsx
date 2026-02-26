import React, { useState } from 'react';
import { Package, Search, Plus, AlertTriangle, ArrowUpRight, TrendingDown, ClipboardList } from 'lucide-react';

const InventoryView = () => {
    const [activeTab, setActiveTab] = useState<'inventory' | 'prescriptions'>('inventory');

    const stockItems = [
        { name: 'Artemether/Lumefantrine', category: 'Antimalarial', stock: 120, amc: 450, unit: 'Tabs', risk: 'high' },
        { name: 'Paracetamol', category: 'Analgesic', stock: 2400, amc: 1800, unit: 'Tabs', risk: 'low' },
        { name: 'Amoxicillin', category: 'Antibiotic', stock: 85, amc: 320, unit: 'Suspension', risk: 'critical' },
        { name: 'Oxytocin', category: 'Maternal Health', stock: 45, amc: 20, unit: 'Vials', risk: 'low' },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
                        <Package className="text-primary" size={32} />
                        Integrated LMIS
                    </h1>
                    <p className="text-text-muted mt-2">Logistics Management & Clinical Supply Chain</p>
                </div>

                <div className="flex gap-2 p-1 bg-surface rounded-xl border border-border">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-main'}`}
                    >
                        Stock Levels
                    </button>
                    <button
                        onClick={() => setActiveTab('prescriptions')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'prescriptions' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-main'}`}
                    >
                        AMC Analytics
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 border-l-4 border-red-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Immediate Action</span>
                    </div>
                    <h3 className="text-3xl font-bold text-text-main">2 Items</h3>
                    <p className="text-sm text-text-muted mt-1 font-medium">Critical Stock-Out Risk</p>
                </div>

                <div className="glass-card p-6 border-l-4 border-primary">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg"><TrendingDown size={20} /></div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Monthly Trend</span>
                    </div>
                    <h3 className="text-3xl font-bold text-text-main">+14%</h3>
                    <p className="text-sm text-text-muted mt-1 font-medium">Consumption Growth Rate</p>
                </div>

                <div className="glass-card p-6 border-l-4 border-emerald-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><ClipboardList size={20} /></div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Chain Sync</span>
                    </div>
                    <h3 className="text-3xl font-bold text-text-main">ACTIVE</h3>
                    <p className="text-sm text-text-muted mt-1 font-medium">LGA Central Store Linked</p>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-4 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input type="text" placeholder="Search LMIS Inventory..." className="w-full bg-background border border-border pl-10 pr-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <button className="btn-secondary px-4 py-2 flex items-center gap-2"><Plus size={18} /> Reorder</button>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-background text-[10px] font-black text-text-muted uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Item (Formulation)</th>
                            <th className="px-6 py-4 text-center">In Stock</th>
                            <th className="px-6 py-4 text-center">Monthly AMC</th>
                            <th className="px-6 py-4 text-center">MOS (Months of Stock)</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {stockItems.map(item => (
                            <tr key={item.name} className="hover:bg-primary/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="font-bold text-text-main block">{item.name}</span>
                                    <span className="text-xs text-text-muted">{item.category}</span>
                                </td>
                                <td className="px-6 py-4 text-center font-mono font-bold text-text-main">
                                    {item.stock} <span className="text-[10px] text-text-muted font-normal">{item.unit}</span>
                                </td>
                                <td className="px-6 py-4 text-center font-mono text-text-main">
                                    {item.amc}/mo
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`font-bold ${item.stock / item.amc < 0.5 ? 'text-red-500' : 'text-text-main'}`}>
                                        {(item.stock / item.amc).toFixed(1)}m
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${item.risk === 'critical' ? 'bg-red-500 animate-pulse' :
                                                item.risk === 'high' ? 'bg-orange-500' : 'bg-emerald-500'
                                            }`} />
                                        <span className="text-[10px] font-bold uppercase">{item.risk}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-primary hover:text-primary-dark p-2 rounded-lg hover:bg-primary/10 transition-all">
                                        <ArrowUpRight size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryView;
