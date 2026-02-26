import React from 'react';
import { Package, AlertCircle, ShoppingCart, RefreshCcw } from 'lucide-react';

const InventoryView = () => {
    const stockItems = [
        { name: 'Artemether-Lumefantrine', category: 'Antimalarial', stock: 420, min: 100, unit: 'tabs' },
        { name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 45, min: 200, unit: 'caps' },
        { name: 'Paracetamol Syrup', category: 'Analgesic', stock: 12, min: 20, unit: 'bottles' },
        { name: 'BCG Vaccine', category: 'Vaccine', stock: 85, min: 50, unit: 'vials' },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
                        <Package className="text-primary" size={32} />
                        Pharmacy & Inventory
                    </h1>
                    <p className="text-text-muted mt-2">Monitor stock levels and fulfill prescriptions</p>
                </div>

                <button className="flex items-center gap-2 btn-secondary px-6 py-3">
                    <RefreshCcw size={18} />
                    Sync Inventory
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                    <h4 className="text-text-muted text-sm font-semibold mb-2">Total Items</h4>
                    <span className="text-4xl font-bold text-primary">142</span>
                </div>
                <div className="glass-card p-6 border-l-4 border-red-500 flex flex-col items-center justify-center text-center">
                    <h4 className="text-text-muted text-sm font-semibold mb-2 text-red-500">Critical Stock</h4>
                    <span className="text-4xl font-bold text-red-600">8</span>
                </div>
                <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                    <h4 className="text-text-muted text-sm font-semibold mb-2">Pending Prescriptions</h4>
                    <span className="text-4xl font-bold text-amber-500">24</span>
                </div>
                <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                    <h4 className="text-text-muted text-sm font-semibold mb-2">Dispensations Today</h4>
                    <span className="text-4xl font-bold text-emerald-500">118</span>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-background border-b border-white/20">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-text-main">Medicine / Item</th>
                            <th className="px-6 py-4 text-sm font-bold text-text-main">Category</th>
                            <th className="px-6 py-4 text-sm font-bold text-text-main">In Stock</th>
                            <th className="px-6 py-4 text-sm font-bold text-text-main">Status</th>
                            <th className="px-6 py-4 text-sm font-bold text-text-main">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {stockItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-semibold text-text-main">{item.name}</td>
                                <td className="px-6 py-4 text-text-muted">{item.category}</td>
                                <td className="px-6 py-4">
                                    <span className={`font-mono font-bold ${item.stock < item.min ? 'text-red-500' : 'text-text-main'}`}>
                                        {item.stock} {item.unit}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {item.stock < item.min ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                                            <AlertCircle size={12} /> Low Stock
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                                            Optimal
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-primary hover:text-primary-dark transition-colors font-semibold flex items-center gap-2">
                                        <ShoppingCart size={16} /> Restock
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
