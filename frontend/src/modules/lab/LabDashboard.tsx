import React, { useState, useEffect, useCallback } from 'react';
import {
    Microscope, Clock, CheckCircle2, Plus, X, RefreshCw,
    FlaskConical, User, Send, Loader2, Stethoscope,
} from 'lucide-react';
import {
    LabTest, getPendingLabTests, getCompletedLabTests,
    createLabTest, completeLabTest,
} from '../../services/labService';
import { db } from '../../db';

interface Patient { _id: string; name: string; unique_id: string; }

// ── New Lab Order Modal ───────────────────────────────────────────────────────
const NewOrderModal: React.FC<{ onClose: () => void; onCreated: () => void }> = ({ onClose, onCreated }) => {
    const [patientQuery, setPatientQuery] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [testName, setTestName] = useState('');
    const [requestedBy, setRequestedBy] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const COMMON_TESTS = [
        'Malaria RDT', 'Haemoglobin (Hb)', 'HIV Rapid Test', 'Hepatitis B (HBsAg)',
        'Widal Test', 'Urinalysis', 'Pregnancy Test (urine)', 'Blood Glucose (RBS)',
        'Full Blood Count (FBC)', 'Genotype / Blood Group', 'Sputum AFB (TB)',
    ];

    useEffect(() => {
        if (patientQuery.length < 2) { setPatients([]); return; }
        const t = setTimeout(async () => {
            const r = await db.find({ selector: { type: 'patient', name: { $regex: new RegExp(patientQuery, 'i') } } });
            setPatients(r.docs as unknown as Patient[]);
        }, 300);
        return () => clearTimeout(t);
    }, [patientQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!selectedPatient) { setError('Select a patient.'); return; }
        if (!testName.trim()) { setError('Select or enter a test name.'); return; }
        if (!requestedBy.trim()) { setError('Enter the requesting clinician.'); return; }
        setSaving(true);
        try {
            await createLabTest({
                patient_id: selectedPatient._id,
                patient_name: selectedPatient.name,
                test_name: testName.trim(),
                requested_by: requestedBy.trim(),
            });
            onCreated();
        } catch (err) {
            console.error(err);
            setError('Failed to create lab order. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-border/60 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
                    <h3 className="text-base font-black text-text-main">New Lab Order</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
                        <X size={18} className="text-text-muted" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                            {error}
                        </p>
                    )}

                    {/* Patient search */}
                    <div>
                        <label htmlFor="lab-patient" className="input-label">Patient</label>
                        {selectedPatient ? (
                            <div className="input-field flex items-center justify-between">
                                <span className="font-semibold text-text-main text-sm">{selectedPatient.name}
                                    <span className="ml-2 font-mono text-xs text-primary">{selectedPatient.unique_id}</span>
                                </span>
                                <button type="button" onClick={() => setSelectedPatient(null)} className="text-text-muted hover:text-text-main">
                                    <X size={15} />
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/60" />
                                <input
                                    id="lab-patient"
                                    type="text"
                                    className="input-field pl-10"
                                    placeholder="Search patient by name..."
                                    value={patientQuery}
                                    onChange={e => setPatientQuery(e.target.value)}
                                />
                                {patients.length > 0 && (
                                    <div className="absolute z-10 top-full mt-1 w-full bg-white border border-border rounded-xl shadow-lg overflow-hidden">
                                        {patients.map(p => (
                                            <button key={p._id} type="button"
                                                onClick={() => { setSelectedPatient(p); setPatientQuery(''); setPatients([]); }}
                                                className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-primary/5 hover:text-primary border-b border-border/20 last:border-0 transition-colors"
                                            >
                                                {p.name} <span className="font-mono text-xs text-text-muted ml-2">{p.unique_id}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Test selection */}
                    <div>
                        <label htmlFor="lab-test" className="input-label">Test / Investigation</label>
                        <input
                            id="lab-test"
                            type="text"
                            list="common-tests"
                            className="input-field"
                            placeholder="Select or type test name..."
                            value={testName}
                            onChange={e => setTestName(e.target.value)}
                        />
                        <datalist id="common-tests">
                            {COMMON_TESTS.map(t => <option key={t} value={t} />)}
                        </datalist>
                    </div>

                    {/* Requesting clinician */}
                    <div>
                        <label htmlFor="lab-requested-by" className="input-label">Requested By</label>
                        <div className="relative">
                            <Stethoscope size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/60" />
                            <input
                                id="lab-requested-by"
                                type="text"
                                className="input-field pl-10"
                                placeholder="e.g. Dr. Fatima Musa"
                                value={requestedBy}
                                onChange={e => setRequestedBy(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={saving} className="btn-primary flex-1">
                            {saving ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
                            {saving ? 'Saving...' : 'Create Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ── Record Result Inline Row ──────────────────────────────────────────────────
const RecordResultRow: React.FC<{ test: LabTest; onDone: () => void }> = ({ test, onDone }) => {
    const [result, setResult] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!result.trim()) return;
        setSaving(true);
        try {
            await completeLabTest(test, result.trim());
            onDone();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex items-center gap-2 mt-2">
            <input
                type="text"
                className="input-field py-2 text-sm flex-1"
                placeholder="Enter result (e.g. Positive, Negative, 11.2 g/dL)"
                value={result}
                onChange={e => setResult(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                autoFocus
            />
            <button
                onClick={handleSave}
                disabled={saving || !result.trim()}
                className="btn-primary py-2 px-4 text-sm gap-1.5"
            >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                Save
            </button>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const LabDashboard: React.FC = () => {
    const [tab, setTab] = useState<'pending' | 'completed'>('pending');
    const [pending, setPending] = useState<LabTest[]>([]);
    const [completed, setCompleted] = useState<LabTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [recordingId, setRecordingId] = useState<string | null>(null);

    const fetchData = useCallback(async (silent = false) => {
        silent ? setRefreshing(true) : setLoading(true);
        const [p, c] = await Promise.all([getPendingLabTests(), getCompletedLabTests()]);
        setPending(p);
        setCompleted(c);
        setLoading(false);
        setRefreshing(false);
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const formatTime = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''} ago`;
        const hrs = Math.floor(mins / 60);
        return `${hrs} hr${hrs !== 1 ? 's' : ''} ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {showModal && (
                <NewOrderModal
                    onClose={() => setShowModal(false)}
                    onCreated={() => { setShowModal(false); fetchData(true); }}
                />
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-200">
                        <Microscope size={22} className="text-sky-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-text-main tracking-tight">Diagnostic Lab</h1>
                        <p className="text-sm text-text-muted font-medium">Manage test orders and record results</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => fetchData(true)} disabled={refreshing} className="btn-secondary gap-2 py-2 px-4 text-sm">
                        <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button onClick={() => setShowModal(true)} className="btn-primary gap-2 py-2 px-4 text-sm">
                        <Plus size={15} /> New Order
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl border border-border/50 border-l-4 border-l-amber-500 p-4 shadow-sm">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted mb-1">Pending Orders</p>
                    <p className="text-3xl font-black text-amber-600">{pending.length}</p>
                    <p className="text-[11px] text-text-muted/70 font-medium mt-0.5">awaiting processing</p>
                </div>
                <div className="bg-white rounded-2xl border border-border/50 border-l-4 border-l-emerald-500 p-4 shadow-sm">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted mb-1">Completed Today</p>
                    <p className="text-3xl font-black text-emerald-600">{completed.length}</p>
                    <p className="text-[11px] text-text-muted/70 font-medium mt-0.5">results verified</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="flex border-b border-border/40">
                    {(['pending', 'completed'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                                tab === t
                                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                                    : 'text-text-muted hover:text-text-main'
                            }`}
                        >
                            {t === 'pending' ? `Pending Orders (${pending.length})` : `Recent Results (${completed.length})`}
                        </button>
                    ))}
                </div>

                <div className="divide-y divide-border/30">
                    {tab === 'pending' && (
                        pending.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                                <FlaskConical size={38} className="text-text-muted/20 mb-3" />
                                <p className="font-bold text-text-muted">No pending lab orders</p>
                                <p className="text-xs text-text-muted/60 mt-1">New orders will appear here when created.</p>
                            </div>
                        ) : (
                            pending.map(test => (
                                <div key={test._id} className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200 shrink-0 mt-0.5">
                                                <Clock size={18} className="text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-main">{test.patient_name}</p>
                                                <p className="text-sm text-text-muted mt-0.5">
                                                    <span className="font-semibold text-text-main">{test.test_name}</span>
                                                    {' · '}Requested by {test.requested_by}
                                                </p>
                                                <p className="text-xs font-mono text-text-muted/70 mt-0.5">{test._id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs text-text-muted/70 font-medium hidden sm:block">
                                                {formatTime(test.created_at)}
                                            </span>
                                            {recordingId !== test._id ? (
                                                <button
                                                    onClick={() => setRecordingId(test._id)}
                                                    className="btn-primary py-2 px-4 text-xs gap-1.5"
                                                >
                                                    <Send size={13} /> Record Result
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setRecordingId(null)}
                                                    className="btn-secondary py-2 px-3 text-xs"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {recordingId === test._id && (
                                        <RecordResultRow
                                            test={test}
                                            onDone={() => { setRecordingId(null); fetchData(true); }}
                                        />
                                    )}
                                </div>
                            ))
                        )
                    )}

                    {tab === 'completed' && (
                        completed.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                                <CheckCircle2 size={38} className="text-text-muted/20 mb-3" />
                                <p className="font-bold text-text-muted">No completed tests today</p>
                                <p className="text-xs text-text-muted/60 mt-1">Completed results will appear here.</p>
                            </div>
                        ) : (
                            completed.map(test => (
                                <div key={test._id} className="p-5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200 shrink-0">
                                            <CheckCircle2 size={18} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-main">{test.patient_name}</p>
                                            <p className="text-sm text-text-muted mt-0.5">
                                                {test.test_name}
                                                {test.result && (
                                                    <> · <span className="font-bold text-emerald-600">Result: {test.result}</span></>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-text-muted/70 hidden sm:block shrink-0">{test._id}</span>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default LabDashboard;
