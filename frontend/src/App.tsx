import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PatientDashboard from './modules/patients/PatientDashboard';
import FacilityDashboard from './modules/analytics/FacilityDashboard';
import LabDashboard from './modules/lab/LabDashboard';
import InventoryView from './modules/pharmacy/InventoryView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'patients' | 'analytics' | 'lab' | 'pharmacy'>('patients');

  return (
    <div className="flex min-h-screen bg-background text-text-main font-sans selection:bg-primary/20">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 ml-64 min-h-screen pb-20">
        <div className="animate-fade-in py-8">
          {activeView === 'patients' && <PatientDashboard />}
          {activeView === 'analytics' && <FacilityDashboard />}
          {activeView === 'lab' && <LabDashboard />}
          {activeView === 'pharmacy' && <InventoryView />}
        </div>
      </main>
    </div>
  );
};

export default App;
