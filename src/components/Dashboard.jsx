import { AlertTriangle, Clock, TrendingUp, Users, Zap, Activity, Shield, Globe } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatTimeRemaining, formatNumber } from '../lib/utils';
import ThreatCard from './ThreatCard';
import WorldMap from './WorldMap';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { getThreats, getCriticalThreats } = useStore();
  const threats = getThreats();
  const criticalThreats = getCriticalThreats();

  // Live changing numbers
  const [liveReach, setLiveReach] = useState(0);
  const [liveDetections, setLiveDetections] = useState(0);

  const avgVirality = threats.length > 0
    ? Math.round(threats.reduce((sum, t) => sum + t.viralityProgress, 0) / threats.length)
    : 0;

  const shortestWindow = threats.length > 0
    ? Math.min(...threats.map(t => t.responseWindowHours))
    : 0;

  const totalVideos = threats.reduce((sum, t) => sum + (t.aiArsenal?.videos?.length || 0), 0);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveReach(prev => prev + Math.floor(Math.random() * 1000));
      setLiveDetections(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <AlertTriangle className="w-10 h-10 text-orange-500 animate-pulse" />
              Early Warning Detection
            </h1>
            <p className="text-gray-400">
              Pre-viral threats detected before reaching critical mass
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 glass rounded-lg">
            <Activity className="w-5 h-5 text-green-500 animate-pulse" />
            <div>
              <div className="text-xs text-gray-400">Live Detections</div>
              <div className="text-lg font-bold text-green-400">{liveDetections}</div>
            </div>
          </div>
        </div>

        {/* Live Stats Bar */}
        <div className="glass rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">System Status: <span className="text-green-400 font-semibold">ACTIVE</span></span>
            </div>
            <div className="text-sm text-gray-400">
              Total Reach: <span className="text-blue-400 font-semibold">{formatNumber(liveReach + 2400000)}</span>
            </div>
            <div className="text-sm text-gray-400">
              Monitoring: <span className="text-purple-400 font-semibold">847 Sources</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Last Updated: Just now
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 border-l-4 border-red-500 hover:shadow-2xl hover:shadow-red-500/20 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/20 rounded-lg relative">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              {criticalThreats.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              )}
            </div>
            <motion.span
              key={criticalThreats.length}
              initial={{ scale: 1.5, color: '#ef4444' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-4xl font-bold"
            >
              {criticalThreats.length}
            </motion.span>
          </div>
          <div className="text-sm font-semibold text-gray-300">Critical Threats</div>
          <div className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Immediate action required
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6 border-l-4 border-orange-500 hover:shadow-2xl hover:shadow-orange-500/20 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-500 animate-pulse" />
            </div>
            <span className="text-4xl font-bold">
              {shortestWindow > 0 ? `${formatTimeRemaining(shortestWindow).hours}h` : '-'}
            </span>
          </div>
          <div className="text-sm font-semibold text-gray-300">Shortest Window</div>
          <div className="text-xs text-orange-400 mt-1">Time until viral threshold</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 border-l-4 border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{avgVirality}%</div>
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-300">Avg Virality</div>
          <div className="text-xs text-blue-400 mt-1">Across all active threats</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6 border-l-4 border-green-500 hover:shadow-2xl hover:shadow-green-500/20 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-green-500 animate-pulse" />
            </div>
            <span className="text-4xl font-bold">{totalVideos}</span>
          </div>
          <div className="text-sm font-semibold text-gray-300">AI Responses</div>
          <div className="text-xs text-green-400 mt-1">Videos ready to deploy</div>
        </motion.div>
      </div>

      {/* Global Threat Distribution Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Global Threat Distribution
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-400">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-400">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-400">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-400">Low</span>
              </div>
            </div>
          </div>
          <div className="h-[400px]">
            <WorldMap threats={threats} />
          </div>
        </div>
      </motion.div>

      {/* Threats List */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" />
          Active Pre-Viral Threats
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-full text-sm font-semibold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            LIVE MONITORING
          </div>
        </div>
      </div>

      {threats.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-12 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No Active Threats</h3>
          <p className="text-gray-400">All systems normal · Continuous monitoring active</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {threats.map((threat, index) => (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ThreatCard threat={threat} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
