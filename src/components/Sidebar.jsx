import { Shield, AlertTriangle, Video, FileText, Rocket, BarChart3, Settings, Activity, LayoutDashboard, Users, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { getCriticalThreats, getThreats } = useStore();
  const [eventsPerMin, setEventsPerMin] = useState(0);
  const location = useLocation();

  const criticalCount = getCriticalThreats().length;
  const totalThreats = getThreats().length;

  // Initialize and update events/min based on threat activity
  useEffect(() => {
    const threats = getThreats();
    const totalVelocity = threats.reduce((sum, t) => sum + (t.velocityPerHour || 0), 0);
    const baseRate = Math.max(5, Math.round((totalVelocity * threats.length) / 60));

    setEventsPerMin(baseRate);

    const interval = setInterval(() => {
      setEventsPerMin(prev => {
        const variance = Math.floor(Math.random() * 10) - 3; // -3 to +6
        return Math.max(1, baseRate + variance);
      });
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [totalThreats]);

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { id: 'narratives', path: '/narratives', icon: MessageSquare, label: 'Narratives', badge: totalThreats, badgeColor: 'bg-purple-500' },
    { id: 'audience', path: '/audience', icon: Users, label: 'Audience', badge: null },
    { id: 'analytics', path: '/analytics', icon: BarChart3, label: 'Analytics', badge: null },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings', badge: null },
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
            <div className="text-xs text-gray-400">Real-time risk and sentiment analysis</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-green-400 mt-3 px-2 py-1 bg-green-500/10 rounded">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          LIVE · {eventsPerMin} events/min
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

          return (
            <Link
              key={item.id}
              to={item.path}
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
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-gray-500 text-center">
          © 2025 Vigilance AI
          <div className="text-gray-600 mt-1">All Systems Active</div>
        </div>
      </div>
    </div>
  );
}
