import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export interface AuthUser {
    username: string;
    displayName: string;
    phcName: string;
    phcCode: string;
    role: string;
}

interface AuthContextType {
    user: AuthUser | null;
    sessionExpired: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
    dismissExpiry: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const SESSION_KEY = 'carelink_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(SESSION_KEY);
            if (!raw) return;
            const { user: u, ts } = JSON.parse(raw);
            if (Date.now() - ts < SESSION_DURATION) {
                setUser(u);
            } else {
                localStorage.removeItem(SESSION_KEY);
                setSessionExpired(true);
            }
        } catch {
            localStorage.removeItem(SESSION_KEY);
        }
    }, []);

    const login = (u: AuthUser) => {
        setUser(u);
        setSessionExpired(false);
        localStorage.setItem(SESSION_KEY, JSON.stringify({ user: u, ts: Date.now() }));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(SESSION_KEY);
    };

    const dismissExpiry = () => setSessionExpired(false);

    const value = useMemo(
        () => ({ user, sessionExpired, login, logout, dismissExpiry }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user, sessionExpired],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
