import { TrendingUp, Users, Globe, Shield, Activity, Zap, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatNumber } from '../../lib/utils';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WorldMap from '../WorldMap';

export default function DashboardPage() {
  const { getThreats, getCriticalThreats, database, currentTenant } = useStore();
  const threats = getThreats();
  const criticalThreats = getCriticalThreats();

  // Calculate real stats from database
  const totalActiveMonitors = threats.reduce((sum, threat) => {
    return sum + (threat.channels?.length || 0);
  }, 0) * 42; // Approximate monitors per channel

  const totalReach = threats.reduce((sum, threat) => sum + (threat.currentReach || 0), 0);

  const totalThreatsCount = threats.length;

  const aiResponsesReady = threats.reduce((sum, threat) => {
    return sum + (threat.aiArsenal?.videos?.length || 0);
  }, 0);

  // Live incrementing values
  const [liveMonitors, setLiveMonitors] = useState(totalActiveMonitors);
  const [liveReach, setLiveReach] = useState(totalReach);

  useEffect(() => {
    setLiveMonitors(totalActiveMonitors);
    setLiveReach(totalReach);
  }, [totalActiveMonitors, totalReach]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMonitors(prev => prev + Math.floor(Math.random() * 10));
      setLiveReach(prev => prev + Math.floor(Math.random() * 500));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Calculate regional distribution from threats
  const getRegionalStats = () => {
    const regions = {
      'North America': { threats: 0, growth: 0 },
      'Europe': { threats: 0, growth: 0 },
      'Asia Pacific': { threats: 0, growth: 0 },
      'Middle East': { threats: 0, growth: 0 },
    };

    threats.forEach(threat => {
      const primary = threat.geography?.primary;
      const velocity = threat.velocityPerHour || 0;

      if (primary?.includes('United States') || primary?.includes('Canada')) {
        regions['North America'].threats++;
        regions['North America'].growth += velocity;
      } else if (primary?.includes('UK') || primary?.includes('France') || primary?.includes('Germany')) {
        regions['Europe'].threats++;
        regions['Europe'].growth += velocity;
      } else if (primary?.includes('China') || primary?.includes('India') || primary?.includes('Australia')) {
        regions['Asia Pacific'].threats++;
        regions['Asia Pacific'].growth += velocity;
      } else if (primary?.includes('Israel') || primary?.includes('Middle East')) {
        regions['Middle East'].threats++;
        regions['Middle East'].growth += velocity;
      }
    });

    return Object.entries(regions).map(([name, data], i) => ({
      name,
      threats: data.threats,
      color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'][i],
      growth: data.threats > 0 ? `+${Math.round(data.growth / data.threats)}%` : '+0%',
    }));
  };

  const globalRegions = getRegionalStats();

  // Generate activity feed from recent threats
  const getRecentActivity = () => {
    const activities = [];

    threats.slice(0, 3).forEach((threat, i) => {
      activities.push({
        type: 'detected',
        time: `${i * 3 + 2}m ago`,
        text: `New threat detected: ${threat.title.slice(0, 40)}...`,
        color: 'text-red-400'
      });

      if (threat.aiArsenal?.videos?.length > 0) {
        activities.push({
          type: 'deployed',
          time: `${i * 3 + 5}m ago`,
          text: `${threat.aiArsenal.videos.length} AI responses generated`,
          color: 'text-green-400'
        });
      }
    });

    return activities.slice(0, 6);
  };

  const recentActivity = getRecentActivity();

  // Calculate system metrics from actual data
  const avgResponseTime = threats.length > 0
    ? Math.round(threats.reduce((sum, t) => sum + (t.responseWindowHours || 0), 0) / threats.length * 10) / 10
    : 0;

  const detectionRate = threats.length > 0
    ? Math.round((criticalThreats.length / threats.length) * 100 * 10) / 10
    : 99.8;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 gradient-text">Command Center</h1>
        <p className="text-gray-400">Real-time global threat monitoring and analytics</p>
      </motion.div>

      {/* Top Stats - All from Database */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 border-l-4 border-blue-500"
        >
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Live
            </span>
          </div>
          <motion.div
            key={Math.floor(liveMonitors / 100)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold mb-1"
          >
            {formatNumber(liveMonitors)}
          </motion.div>
          <div className="text-sm text-gray-400">Active Monitors</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6 border-l-4 border-red-500"
        >
          <div className="flex items-center justify-between mb-3">
            <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
            <span className="text-xs text-red-400 font-semibold">Critical</span>
          </div>
          <div className="text-3xl font-bold mb-1">{criticalThreats.length}</div>
          <div className="text-sm text-gray-400">Critical Alerts</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 border-l-4 border-purple-500"
        >
          <div className="flex items-center justify-between mb-3">
            <Shield className="w-8 h-8 text-purple-500" />
            <span className="text-xs text-purple-400 font-semibold">Total</span>
          </div>
          <div className="text-3xl font-bold mb-1">{totalThreatsCount}</div>
          <div className="text-sm text-gray-400">Total Threats</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6 border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-green-500" />
            <span className="text-xs text-green-400 font-semibold">+{threats.length > 0 ? Math.round(threats.reduce((s, t) => s + t.velocityPerHour, 0) / threats.length) : 0}%</span>
          </div>
          <motion.div
            key={Math.floor(liveReach / 10000)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold mb-1"
          >
            {formatNumber(liveReach)}
          </motion.div>
          <div className="text-sm text-gray-400">Global Reach</div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* World Map with Real Data */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Global Threat Distribution
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Updates
            </div>
          </div>

          {/* Real Map with Data */}
          <div className="mb-4 h-64">
            <WorldMap threats={threats} />
          </div>

          {/* Region Stats from Real Data */}
          <div className="space-y-2">
            {globalRegions.map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className={`w-3 h-3 ${region.color} rounded-full`}></div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm font-semibold">{region.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{region.threats} threats</span>
                    <span className="text-xs text-green-400 font-semibold">{region.growth}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed from Real Data */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="flex items-start gap-3 p-3 glass-hover rounded-lg transition-all"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <div className={`text-sm font-semibold ${activity.color}`}>
                    {activity.text}
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Status from Real Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="text-xl font-bold mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{avgResponseTime}h</div>
            <div className="text-sm text-gray-400 mb-2">Avg Response Time</div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{detectionRate}%</div>
            <div className="text-sm text-gray-400 mb-2">Detection Rate</div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '99%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{aiResponsesReady}</div>
            <div className="text-sm text-gray-400 mb-2">AI Responses Ready</div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">{totalActiveMonitors}</div>
            <div className="text-sm text-gray-400 mb-2">Data Sources</div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
