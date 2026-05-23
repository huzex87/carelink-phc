import React, { useState, useRef, useEffect } from 'react';
import { HeartPulse, Eye, EyeOff, AlertCircle, X, Search, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PHCS = [
    { code: 'PHC-KT-001', name: 'PHC Kofar Sauri, Katsina' },
    { code: 'PHC-KT-002', name: 'PHC Dan Kwarin, Katsina' },
    { code: 'PHC-KT-003', name: 'PHC Jibia, Katsina' },
    { code: 'PHC-KT-004', name: 'PHC Malumfashi, Katsina' },
    { code: 'PHC-KT-005', name: 'PHC Funtua, Katsina' },
    { code: 'PHC-KT-006', name: 'PHC Daura, Katsina' },
    { code: 'PHC-KT-007', name: 'PHC Kankia, Katsina' },
    { code: 'PHC-KT-008', name: 'PHC Mani, Katsina' },
    { code: 'PHC-KT-009', name: 'PHC Batagarawa, Katsina' },
    { code: 'PHC-KT-DEMO', name: 'Demo PHC, Katsina' },
];

const getRoleFromUsername = (username: string): string => {
    const u = username.toLowerCase();
    if (u.includes('doctor') || u.includes('clinician') || u.includes('physician')) return 'Clinician';
    if (u.includes('nurse') || u.includes('midwife')) return 'Nurse/Midwife';
    if (u.includes('lab')) return 'Lab Technician';
    if (u.includes('pharm')) return 'Pharmacist';
    if (u.includes('admin')) return 'Administrator';
    if (u.includes('chv') || u.includes('community')) return 'Community Health Worker';
    return 'PHC Coordinator';
};

const getDisplayName = (username: string): string =>
    username.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const LoginPage: React.FC = () => {
    const { login, sessionExpired, dismissExpiry } = useAuth();

    const [phcSearch, setPhcSearch] = useState('');
    const [selectedPHC, setSelectedPHC] = useState<typeof PHCS[0] | null>(null);
    const [showPHCDropdown, setShowPHCDropdown] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredPHCs = phcSearch.length >= 3
        ? PHCS.filter(p => p.name.toLowerCase().includes(phcSearch.toLowerCase()))
        : [];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowPHCDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!selectedPHC) { setError('Please select your PHC.'); return; }
        if (!username.trim()) { setError('Username is required.'); return; }
        if (!password.trim()) { setError('Password is required.'); return; }

        setLoading(true);
        // Simulate network latency; replace with real API call when backend auth is ready
        await new Promise(res => setTimeout(res, 900));
        setLoading(false);

        login({
            username: username.trim(),
            displayName: getDisplayName(username.trim()),
            phcName: selectedPHC.name,
            phcCode: selectedPHC.code,
            role: getRoleFromUsername(username.trim()),
        });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
            {/* Session Expired Banner */}
            {sessionExpired && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-red-50 border-b border-red-200 px-4 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-500 shrink-0" />
                        <div>
                            <p className="font-bold text-red-700 text-sm">Your session has expired</p>
                            <p className="text-red-600 text-xs">Please sign in again to continue.</p>
                        </div>
                    </div>
                    <button
                        onClick={dismissExpiry}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                        aria-label="Dismiss"
                    >
                        <X size={18} className="text-red-500" />
                    </button>
                </div>
            )}

            <div className="w-full max-w-sm">
                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center">
                            <HeartPulse size={36} className="text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-text-main tracking-tight">
                        CareLink <span className="text-primary">PHC</span>
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted mt-1">
                        Powered by CalmGlobal
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-glass border border-border/40 p-8">
                    <h2 className="text-xl font-black text-text-main text-center mb-1">Sign in to your account</h2>
                    <p className="text-sm text-text-muted text-center mb-7">Enter your credentials to continue</p>

                    {error && (
                        <div className="mb-5 flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
                            <AlertCircle size={16} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* PHC Selector */}
                        <div>
                            <label htmlFor="phc-search" className="input-label">Select PHC</label>
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="input-field flex items-center gap-2.5 cursor-text"
                                    onClick={() => !selectedPHC && setShowPHCDropdown(true)}
                                >
                                    <Search size={17} className="text-text-muted/60 shrink-0" />
                                    {selectedPHC ? (
                                        <span className="flex-1 text-sm font-semibold text-text-main truncate">{selectedPHC.name}</span>
                                    ) : (
                                        <input
                                            id="phc-search"
                                            type="text"
                                            className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-muted/60"
                                            placeholder="Type at least 3 characters to search..."
                                            value={phcSearch}
                                            onChange={e => { setPhcSearch(e.target.value); setShowPHCDropdown(true); }}
                                            onFocus={() => setShowPHCDropdown(true)}
                                        />
                                    )}
                                    {selectedPHC ? (
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedPHC(null); setPhcSearch(''); }}
                                            className="text-text-muted hover:text-text-main transition-colors"
                                        >
                                            <X size={15} />
                                        </button>
                                    ) : (
                                        <ChevronDown size={15} className="text-text-muted/60 shrink-0" />
                                    )}
                                </div>

                                {showPHCDropdown && filteredPHCs.length > 0 && (
                                    <div className="absolute z-50 top-full mt-1 w-full bg-white border border-border rounded-xl shadow-lg overflow-hidden">
                                        {filteredPHCs.map(phc => (
                                            <button
                                                key={phc.code}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPHC(phc);
                                                    setShowPHCDropdown(false);
                                                    setPhcSearch('');
                                                }}
                                                className="w-full text-left px-4 py-3 text-sm font-medium text-text-main hover:bg-primary/5 hover:text-primary transition-colors border-b border-border/30 last:border-0"
                                            >
                                                {phc.name}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {showPHCDropdown && phcSearch.length >= 3 && filteredPHCs.length === 0 && (
                                    <div className="absolute z-50 top-full mt-1 w-full bg-white border border-border rounded-xl shadow-lg p-4 text-center text-sm text-text-muted">
                                        No PHC found matching "{phcSearch}"
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="login-username" className="input-label">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-text-muted/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                                <input
                                    id="login-username"
                                    type="text"
                                    className="input-field pl-11"
                                    placeholder="e.g. katsina.coordinator"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="login-password" className="input-label">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-text-muted/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field pl-11 pr-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute inset-y-0 right-4 flex items-center text-text-muted/60 hover:text-text-main transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-base mt-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <><Loader2 size={20} className="animate-spin" /> Signing in...</>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-text-muted mt-6 font-medium">
                        Forgot password? Contact your OIC.
                    </p>
                </div>

                <p className="text-center text-[10px] text-text-muted/50 mt-6 font-bold uppercase tracking-widest">
                    Powered by CalmGlobal
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
