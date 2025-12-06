import { Shield, Bell, User, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState } from 'react';

export default function Header() {
  const { database, currentTenant, setCurrentTenant, getTenant, getCriticalThreats } = useStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const tenant = getTenant();
  const tenants = database?.tenants ? Object.values(database.tenants) : [];
  const criticalCount = getCriticalThreats().length;

  if (!tenant) return null;

  return (
    <header className="glass border-b border-white/10 sticky top-0 z-50">
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

            <button className="relative glass glass-hover p-2 rounded-lg">
              <Bell className="w-5 h-5" />
              {criticalCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Tenant Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 glass glass-hover px-4 py-2 rounded-lg"
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
                <div className="absolute right-0 mt-2 w-64 glass rounded-lg shadow-xl overflow-hidden">
                  {tenants.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setCurrentTenant(t.id);
                        setShowDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 glass-hover ${currentTenant === t.id ? 'bg-white/10' : ''
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
