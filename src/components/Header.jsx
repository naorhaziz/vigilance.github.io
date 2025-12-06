import { Shield, Bell, User, ChevronDown, X, AlertTriangle, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { database, currentTenant, setCurrentTenant, getTenant, getCriticalThreats, getThreats } = useStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const tenant = getTenant();
  const tenants = database?.tenants ? Object.values(database.tenants) : [];
  const criticalThreats = getCriticalThreats();
  const criticalCount = criticalThreats.length;
  const allThreats = getThreats();

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Get recent notifications (critical threats + recent detections)
  const notifications = [
    ...criticalThreats.map(threat => ({
      id: threat.id,
      type: 'critical',
      title: threat.title,
      message: `Critical threat detected - ${threat.viralityProgress}% viral`,
      time: new Date(threat.detectedAt).toLocaleTimeString(),
      threat
    })),
    ...allThreats.slice(0, 5).map(threat => ({
      id: threat.id + '_detect',
      type: threat.severity,
      title: 'New Threat Detected',
      message: threat.title,
      time: new Date(threat.detectedAt).toLocaleTimeString(),
      threat
    }))
  ].slice(0, 10);

  if (!tenant) return null;

  return (
    <header className="bg-slate-900/95 border-b border-white/10 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Empty left side for balance */}
          <div className="flex-1"></div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {criticalCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-sm font-medium animate-pulse">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {criticalCount} Critical Alert{criticalCount > 1 ? 's' : ''}
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-all hover:scale-105"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-96 bg-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-700"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-400" />
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="hover:bg-slate-800 p-1 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                          <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/50 cursor-pointer transition-colors ${notification.type === 'critical' ? 'border-l-4 border-l-red-500' :
                              notification.type === 'high' ? 'border-l-4 border-l-orange-500' :
                                'border-l-4 border-l-blue-500'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${notification.type === 'critical' ? 'bg-red-500/20' :
                                notification.type === 'high' ? 'bg-orange-500/20' :
                                  'bg-blue-500/20'
                                }`}>
                                {notification.type === 'critical' ? (
                                  <AlertTriangle className={`w-4 h-4 ${notification.type === 'critical' ? 'text-red-400' :
                                    notification.type === 'high' ? 'text-orange-400' :
                                      'text-blue-400'
                                    }`} />
                                ) : (
                                  <Clock className={`w-4 h-4 ${notification.type === 'critical' ? 'text-red-400' :
                                    notification.type === 'high' ? 'text-orange-400' :
                                      'text-blue-400'
                                    }`} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-semibold text-sm">{notification.title}</p>
                                  <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-slate-800 text-center bg-slate-900/50">
                        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                          View All Notifications
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tenant Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: tenant.primaryColor }}
                >
                  {tenant.logo}
                </div>
                <div className="text-left">
                  <div className="font-semibold">{tenant.name}</div>
                  <div className="text-xs text-gray-400">{tenant.subtitle}</div>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-lg shadow-xl overflow-hidden border border-white/10">
                  {tenants.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setCurrentTenant(t.id);
                        setShowDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors ${currentTenant === t.id ? 'bg-slate-800' : ''
                        }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: t.primaryColor }}
                      >
                        {t.logo}
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-xs text-gray-400">{t.subtitle}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
