import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Loader2, Shield } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './components/pages/DashboardPage';
import AudiencePage from './components/pages/AudiencePage';
import NarrativesPage from './components/pages/NarrativesPage';
import AnalyticsPage from './components/pages/AnalyticsPage';
import SettingsPage from './components/pages/SettingsPage';
import ThreatModal from './components/ThreatModal';

// Scroll to top on route change
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Also scroll main content area if it exists
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [location.pathname]);

  return null;
}

function App() {
  const { setDatabase, isLoading } = useStore();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/database.json`)
      .then(res => res.json())
      .then(data => setDatabase(data))
      .catch(err => console.error('Error loading database:', err));
  }, [setDatabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <Shield className="w-20 h-20 mx-auto text-blue-500 animate-pulse" />
            <div className="absolute inset-0 bg-blue-500/30 blur-3xl animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-bold mb-3 gradient-text">Vigilance AI</h2>
          <p className="text-gray-400 mb-6">Early Warning System Initializing...</p>
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500" />
          <div className="mt-4 text-xs text-gray-600">
            Loading threat intelligence database...
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/audience" element={<AudiencePage />} />
              <Route path="/narratives" element={<NarrativesPage />} />
              <Route path="/narratives/:id" element={<NarrativesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
        <ThreatModal />
      </div>
    </Router>
  );
}

export default App;
