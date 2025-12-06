import { Shield, AlertTriangle, Video, FileText, Rocket, BarChart3, Settings, Activity, LayoutDashboard, Users, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const { getCriticalThreats, getThreats, currentPage, setCurrentPage } = useStore();
  const [liveCount, setLiveCount] = useState(0);

  const criticalCount = getCriticalThreats().length;
  const totalThreats = getThreats().length;

  // Simulate live activity counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => (prev + 1) % 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { id: 'earlywarning', icon: Activity, label: 'Early Warning', badge: criticalCount, badgeColor: 'bg-red-500' },
    { id: 'threats', icon: AlertTriangle, label: 'All Threats', badge: totalThreats, badgeColor: 'bg-orange-500' },
    { id: 'narratives', icon: MessageSquare, label: 'Narratives', badge: null },
    { id: 'audience', icon: Users, label: 'Audience', badge: null },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null },
  ];

  return (
    <div className="w-64 glass border-r border-white/10 h-screen flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <Shield className="w-10 h-10 text-blue-500" />
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
          </div>
          <div>
            <div className="text-xl font-bold gradient-text">VIGILANCE</div>
            <div className="text-xs text-gray-400">AI Early Warning</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-green-400 mt-3 px-2 py-1 bg-green-500/10 rounded">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          LIVE · {liveCount} events/min
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.badge !== null && item.badge > 0 && (
                <span className={`${item.badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-gray-500 text-center">
          © 2025 Vigilance AI
          <div className="text-gray-600 mt-1">v2.0.0 · All Systems Active</div>
        </div>
      </div>
    </div>
  );
}
