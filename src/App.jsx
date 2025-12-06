import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Loader2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './components/pages/DashboardPage';
import EarlyWarningPage from './components/pages/EarlyWarningPage';
import AllThreatsPage from './components/pages/AllThreatsPage';
import SettingsPage from './components/pages/SettingsPage';
import ThreatModal from './components/ThreatModal';

function App() {
  const { setDatabase, isLoading, currentPage } = useStore();

  const pages = {
    dashboard: <DashboardPage />,
    earlywarning: <EarlyWarningPage />,
    threats: <AllThreatsPage />,
    settings: <SettingsPage />,
  };

  useEffect(() => {
    fetch('/data/database.json')
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {pages[currentPage] || pages.dashboard}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ThreatModal />
    </div>
  );
}

export default App;
