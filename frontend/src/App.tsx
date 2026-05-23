import React, { useState } from 'react';
import { Menu, HeartPulse, Bell } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import LoginPage from './modules/auth/LoginPage';
import Sidebar, { ViewType } from './components/Sidebar';
import OverviewDashboard from './modules/dashboard/OverviewDashboard';
import PatientDashboard from './modules/patients/PatientDashboard';
import FacilityDashboard from './modules/analytics/FacilityDashboard';
import LabDashboard from './modules/lab/LabDashboard';
import InventoryView from './modules/pharmacy/InventoryView';
import AlertCenter from './modules/analytics/AlertCenter';

const App: React.FC = () => {
    const { user } = useAuth();
    const [activeView, setActiveView] = useState<ViewType>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!user) return <LoginPage />;

    const handleViewChange = (v: ViewType) => {
        setActiveView(v);
        setSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[90] lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar
                activeView={activeView}
                onViewChange={handleViewChange}
                mobileOpen={sidebarOpen}
                onMobileClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
                {/* Mobile top header */}
                <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border/40 px-4 py-3 flex items-center justify-between shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-xl hover:bg-zinc-100 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu size={21} className="text-zinc-700" />
                    </button>

                    <div className="flex items-center gap-2">
                        <HeartPulse size={17} className="text-primary" />
                        <span className="font-black text-zinc-900 text-base tracking-tight">
                            CareLink <span className="text-primary">PHC</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => handleViewChange('alerts')}
                            className="relative p-2 rounded-xl hover:bg-zinc-100 transition-colors"
                            aria-label="Alerts"
                        >
                            <Bell size={19} className="text-zinc-600" />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                        </button>
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-black text-xs">
                            {user.displayName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 px-4 lg:px-8 py-5 lg:py-8 animate-fade-in pb-16">
                    {activeView === 'dashboard' && (
                        <OverviewDashboard onOpenQueue={() => handleViewChange('patients')} />
                    )}
                    {activeView === 'patients' && <PatientDashboard />}
                    {activeView === 'analytics' && <FacilityDashboard />}
                    {activeView === 'lab' && <LabDashboard />}
                    {activeView === 'pharmacy' && <InventoryView />}
                    {activeView === 'alerts' && <AlertCenter />}
                </div>
            </main>
        </div>
    );
};

export default App;
