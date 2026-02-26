import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PatientDashboard from './modules/patients/PatientDashboard';
import FacilityDashboard from './modules/analytics/FacilityDashboard';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'patients' | 'analytics'>('patients');

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 ml-64 min-h-screen">
        <div className="animate-fade-in py-8">
          {activeView === 'patients' ? <PatientDashboard /> : <FacilityDashboard />}
        </div>
      </main>
    </div>
  );
};

export default App;
