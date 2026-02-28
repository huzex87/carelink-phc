import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PatientDashboard from './modules/patients/PatientDashboard';
import FacilityDashboard from './modules/analytics/FacilityDashboard';
import LabDashboard from './modules/lab/LabDashboard';
import InventoryView from './modules/pharmacy/InventoryView';
import AlertCenter from './modules/analytics/AlertCenter';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'patients' | 'analytics' | 'lab' | 'pharmacy' | 'alerts'>('patients');

  return (
    <div className="flex min-h-screen">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 ml-72 min-h-screen relative">
        {/* Top Gradient Fade for a polished blend */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-0 pointer-events-none" />

        <div className="relative z-10 px-8 py-8 animate-fade-in pb-24">
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
