import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Package, Search, Plus, AlertTriangle, TrendingDown, RefreshCw, X, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PharmacyItem, StockRisk,
    getPharmacyItems, savePharmacyItem, updatePharmacyItem,
    getStockRisk, getMOS, seedDefaultInventory,
} from '../../services/pharmacyService';

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
    'Antimalarial', 'Analgesic', 'Antibiotic', 'Maternal Health',
    'Rehydration', 'Antiprotozoal', 'Vaccine', 'Antiretroviral', 'Other',
];

const RISK_CONFIG: Record<StockRisk, { label: string; dot: string; text: string; bg: string }> = {
    critical: { label: 'Critical',   dot: 'bg-red-500 animate-pulse', text: 'text-red-700',    bg: 'bg-red-50'    },
    high:     { label: 'Low Stock',  dot: 'bg-orange-400',            text: 'text-orange-700', bg: 'bg-orange-50' },
    normal:   { label: 'Normal',     dot: 'bg-emerald-500',           text: 'text-emerald-700',bg: 'bg-emerald-50'},
};

// ── Risk Badge ────────────────────────────────────────────────────────────────

const RiskBadge: React.FC<{ risk: StockRisk }> = ({ risk }) => {
    const c = RISK_CONFIG[risk];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${c.text} ${c.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} aria-hidden="true" />
            {c.label}
        </span>
    );
};

// ── Add Item Modal ────────────────────────────────────────────────────────────

interface AddModalProps { onClose: () => void; onSaved: () => void; }

const AddItemModal: React.FC<AddModalProps> = ({ onClose, onSaved }) => {
    const [form, setForm] = useState({ name: '', category: '', unit: '', quantity: '', reorder_level: '', amc: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const nameRef = useRef<HTMLInputElement>(null);

    useEffect(() => { nameRef.current?.focus(); }, []);

    const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { name, category, unit, quantity, reorder_level, amc } = form;
        if (!name.trim() || !category || !unit.trim()) { setError('Name, category, and unit are required.'); return; }
        const qty = parseInt(quantity, 10);
        const rl  = parseInt(reorder_level || '0', 10);
        const amcVal = parseFloat(amc || '0');
        if (isNaN(qty) || qty < 0) { setError('Quantity must be a valid non-negative number.'); return; }
        setSaving(true);
        try {
            await savePharmacyItem({ name: name.trim(), category, unit: unit.trim(), quantity: qty, reorder_level: rl, amc: amcVal });
            onSaved();
        } catch {
            setError('Failed to save item. Please try again.');
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl border border-border/50 w-full max-w-md"
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-item-title"
            >
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                    <h2 id="add-item-title" className="text-base font-bold text-zinc-900">Add Inventory Item</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors" aria-label="Close dialog">
                        <X size={18} className="text-zinc-500" />
                    </button>
                </div>
                <form onSubmit={submit} className="p-5 space-y-4">
                    {error && (
                        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
                    )}
                    <div>
                        <label htmlFor="add-item-name" className="block text-sm font-medium text-zinc-700 mb-1">
                            Item Name <span aria-hidden="true" className="text-red-500">*</span>
                        </label>
                        <input
                            ref={nameRef}
                            id="add-item-name"
                            name="name"
                            value={form.name}
                            onChange={handle}
                            placeholder="e.g. Paracetamol 500mg"
                            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="add-item-category" className="block text-sm font-medium text-zinc-700 mb-1">
                                Category <span aria-hidden="true" className="text-red-500">*</span>
                            </label>
                            <select
                                id="add-item-category"
                                name="category"
                                value={form.category}
                                onChange={handle}
                                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
                                required
                            >
                                <option value="">Select...</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="add-item-unit" className="block text-sm font-medium text-zinc-700 mb-1">
                                Unit <span aria-hidden="true" className="text-red-500">*</span>
                            </label>
                            <input
                                id="add-item-unit"
                                name="unit"
                                value={form.unit}
                                onChange={handle}
                                placeholder="Tabs / Vials / Bottles"
                                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label htmlFor="add-item-qty" className="block text-sm font-medium text-zinc-700 mb-1">
                                Qty <span aria-hidden="true" className="text-red-500">*</span>
                            </label>
                            <input
                                id="add-item-qty"
                                name="quantity"
                                type="number"
                                min="0"
                                value={form.quantity}
                                onChange={handle}
                                placeholder="0"
                                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="add-item-reorder" className="block text-sm font-medium text-zinc-700 mb-1">Reorder</label>
                            <input
                                id="add-item-reorder"
                                name="reorder_level"
                                type="number"
                                min="0"
                                value={form.reorder_level}
                                onChange={handle}
                                placeholder="100"
                                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="add-item-amc" className="block text-sm font-medium text-zinc-700 mb-1">AMC/mo</label>
                            <input
                                id="add-item-amc"
                                name="amc"
                                type="number"
                                min="0"
                                value={form.amc}
                                onChange={handle}
                                placeholder="200"
                                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
                        >
                            {saving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : 'Save Item'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// ── Edit Stock Modal ──────────────────────────────────────────────────────────

interface EditModalProps { item: PharmacyItem; onClose: () => void; onSaved: () => void; }

const EditStockModal: React.FC<EditModalProps> = ({ item, onClose, onSaved }) => {
    const [qty, setQty] = useState(String(item.quantity));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const quantity = parseInt(qty, 10);
        if (isNaN(quantity) || quantity < 0) { setError('Enter a valid non-negative number.'); return; }
        setSaving(true);
        try {
            await updatePharmacyItem(item, { quantity });
            onSaved();
        } catch {
            setError('Failed to update. Please try again.');
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl border border-border/50 w-full max-w-sm"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-stock-title"
            >
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                    <h2 id="edit-stock-title" className="text-base font-bold text-zinc-900">Update Stock Level</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors" aria-label="Close dialog">
                        <X size={18} className="text-zinc-500" />
                    </button>
                </div>
                <form onSubmit={submit} className="p-5 space-y-4">
                    <p className="text-sm font-semibold text-zinc-700">{item.name}</p>
                    <p className="text-xs text-zinc-400">{item.category} · {item.unit}</p>
                    {error && <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>}
                    <div>
                        <label htmlFor="edit-stock-qty" className="block text-sm font-medium text-zinc-700 mb-1">
                            Current Stock ({item.unit}) <span aria-hidden="true" className="text-red-500">*</span>
                        </label>
                        <input
                            ref={inputRef}
                            id="edit-stock-qty"
                            type="number"
                            min="0"
                            value={qty}
                            onChange={e => { setQty(e.target.value); setError(''); }}
                            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors">Cancel</button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
                        >
                            {saving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : 'Update Stock'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// ── AMC Analytics Tab ─────────────────────────────────────────────────────────

const AMCAnalytics: React.FC<{ items: PharmacyItem[] }> = ({ items }) => {
    const byCategory = useMemo(() => {
        const map: Record<string, { count: number; critical: number; totalAMC: number }> = {};
        for (const item of items) {
            if (!map[item.category]) map[item.category] = { count: 0, critical: 0, totalAMC: 0 };
            map[item.category].count++;
            map[item.category].totalAMC += item.amc;
            if (getStockRisk(item) === 'critical') map[item.category].critical++;
        }
        return Object.entries(map).sort((a, b) => b[1].totalAMC - a[1].totalAMC);
    }, [items]);

    const maxAMC = Math.max(...byCategory.map(([, v]) => v.totalAMC), 1);

    if (items.length === 0) {
        return (
            <div className="text-center py-16 text-zinc-400">
                <Archive size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No items to analyze.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Monthly Consumption by Category</p>
            {byCategory.map(([cat, data]) => (
                <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-zinc-700">{cat}</span>
                        <span className="text-xs text-zinc-400 font-mono">
                            {data.totalAMC.toLocaleString()} units/mo &middot; {data.count} item{data.count !== 1 ? 's' : ''}
                            {data.critical > 0 && <span className="ml-2 text-red-500 font-bold">{data.critical} critical</span>}
                        </span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round((data.totalAMC / maxAMC) * 100)}%` }}
                            transition={{ duration: 0.55, ease: 'easeOut' }}
                            className={`h-full rounded-full ${data.critical > 0 ? 'bg-red-400' : 'bg-primary'}`}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────

const InventoryView: React.FC = () => {
    const [items, setItems]         = useState<PharmacyItem[]>([]);
    const [loading, setLoading]     = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch]       = useState('');
    const [activeTab, setActiveTab] = useState<'inventory' | 'amc'>('inventory');
    const [showAdd, setShowAdd]     = useState(false);
    const [editItem, setEditItem]   = useState<PharmacyItem | null>(null);

    const fetchItems = useCallback(async (silent = false) => {
        if (silent) setRefreshing(true); else setLoading(true);
        try {
            const data = await getPharmacyItems();
            setItems(data);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        seedDefaultInventory().then(() => fetchItems());
    }, [fetchItems]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return items;
        return items.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }, [items, search]);

    const stats = useMemo(() => ({
        critical:  items.filter(i => getStockRisk(i) === 'critical').length,
        atReorder: items.filter(i => getStockRisk(i) === 'high').length,
        total:     items.length,
    }), [items]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto flex items-center justify-center py-24">
                <RefreshCw size={28} className="animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2.5">
                            <Package size={26} className="text-primary" />
                            Pharmacy Inventory
                        </h1>
                        <p className="text-sm text-zinc-500 mt-0.5">Medicines &amp; supply stock levels</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchItems(true)}
                            disabled={refreshing}
                            className="p-2.5 rounded-xl border border-border hover:bg-zinc-50 transition-colors disabled:opacity-60"
                            aria-label="Refresh inventory"
                        >
                            <RefreshCw size={16} className={`text-zinc-500 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => setShowAdd(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={16} />
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-4 border-l-4 border-red-500">
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex p-2 bg-red-50 rounded-xl">
                                <AlertTriangle size={18} className="text-red-500" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Critical</p>
                                <p className="text-2xl font-black text-zinc-900 leading-none mt-0.5">{stats.critical}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">Stock-out risk</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-4 border-l-4 border-orange-400">
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex p-2 bg-orange-50 rounded-xl">
                                <TrendingDown size={18} className="text-orange-500" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Low Stock</p>
                                <p className="text-2xl font-black text-zinc-900 leading-none mt-0.5">{stats.atReorder}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">At reorder level</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-border/50 shadow-sm p-4 border-l-4 border-primary">
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex p-2 bg-primary/10 rounded-xl">
                                <Archive size={18} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">Total Items</p>
                                <p className="text-2xl font-black text-zinc-900 leading-none mt-0.5">{stats.total}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">In inventory</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl w-fit">
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-white text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                Stock Levels
                            </button>
                            <button
                                onClick={() => setActiveTab('amc')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'amc' ? 'bg-white text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                AMC Analytics
                            </button>
                        </div>
                        {activeTab === 'inventory' && (
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={15} />
                                <input
                                    id="inv-search"
                                    type="search"
                                    placeholder="Search by name or category…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-zinc-50 border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    {activeTab === 'amc' ? (
                        <AMCAnalytics items={items} />
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16 text-zinc-400">
                            <Package size={40} className="mx-auto mb-3 opacity-30" />
                            <p className="font-medium text-sm">
                                {search ? 'No items match your search.' : 'No inventory items found.'}
                            </p>
                            {!search && (
                                <button onClick={() => setShowAdd(true)} className="mt-3 text-primary text-sm font-bold hover:underline">
                                    Add your first item
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[580px]">
                                <thead className="bg-zinc-50/80 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-5 py-3">Item</th>
                                        <th className="px-5 py-3 text-right">In Stock</th>
                                        <th className="px-5 py-3 text-right hidden md:table-cell">AMC</th>
                                        <th className="px-5 py-3 text-right hidden sm:table-cell">MOS</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {filtered.map(item => {
                                        const risk = getStockRisk(item);
                                        const mos  = getMOS(item);
                                        return (
                                            <tr key={item._id} className="hover:bg-zinc-50/60 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <span className="font-semibold text-zinc-900 text-sm block">{item.name}</span>
                                                    <span className="text-xs text-zinc-400">{item.category} · {item.unit}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <span className={`font-mono font-bold text-sm ${risk === 'critical' ? 'text-red-600' : risk === 'high' ? 'text-orange-600' : 'text-zinc-800'}`}>
                                                        {item.quantity.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right text-sm text-zinc-500 font-mono hidden md:table-cell">
                                                    {item.amc > 0 ? `${item.amc.toLocaleString()}/mo` : '—'}
                                                </td>
                                                <td className="px-5 py-3.5 text-right text-sm font-mono hidden sm:table-cell">
                                                    <span className={risk === 'critical' ? 'text-red-600 font-bold' : risk === 'high' ? 'text-orange-600 font-semibold' : 'text-zinc-600'}>
                                                        {mos === '∞' ? '∞' : `${mos}m`}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <RiskBadge risk={risk} />
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <button
                                                        onClick={() => setEditItem(item)}
                                                        className="text-xs font-bold text-primary hover:underline px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors"
                                                    >
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showAdd && (
                    <AddItemModal
                        key="add-modal"
                        onClose={() => setShowAdd(false)}
                        onSaved={() => { setShowAdd(false); fetchItems(true); }}
                    />
                )}
                {editItem && (
                    <EditStockModal
                        key="edit-modal"
                        item={editItem}
                        onClose={() => setEditItem(null)}
                        onSaved={() => { setEditItem(null); fetchItems(true); }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default InventoryView;
