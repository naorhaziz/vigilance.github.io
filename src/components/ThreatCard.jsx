import { AlertTriangle, Clock, TrendingUp, Users, Flame, Zap, Shield as ShieldIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatTimeRemaining, formatNumber, getSeverityColor, getViralityColor } from '../lib/utils';
import TimeCounter from './TimeCounter';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ThreatCard({ threat }) {
  const { setSelectedThreat } = useStore();

  // Live updating numbers
  const [liveReach, setLiveReach] = useState(threat.currentReach);
  const [liveVirality, setLiveVirality] = useState(threat.viralityProgress);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Increase reach by small random amount
      setLiveReach(prev => prev + Math.floor(Math.random() * 50));

      // Virality increases very slowly (0.1-0.3% every update)
      setLiveVirality(prev => {
        const increase = Math.random() * 0.2 + 0.1;
        const newVal = prev + increase;
        return newVal > threat.viralityThreshold ? threat.viralityThreshold : newVal;
      });
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, [threat.viralityThreshold]);

  const severityColors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/50',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    medium: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    low: 'bg-green-500/20 text-green-400 border-green-500/50'
  };

  const viralityColorClasses = {
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600',
    blue: 'from-blue-500 to-blue-600'
  };

  const viralityColor = getViralityColor(liveVirality);

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`glass rounded-xl p-6 cursor-pointer border transition-all ${threat.severity === 'critical'
          ? 'border-red-500/30 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20'
          : 'border-white/5 hover:border-white/10 hover:shadow-xl hover:shadow-blue-500/10'
        }`}
      onClick={() => setSelectedThreat(threat)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${severityColors[threat.severity]}`}>
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              {threat.severity.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/50">
              PRE-VIRAL
            </span>
          </div>
          <h3 className="text-xl font-bold mb-1">{threat.title}</h3>
          <p className="text-gray-400 text-sm">{threat.description}</p>
        </div>
      </div>

      {/* Virality Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400 flex items-center gap-2">
            <Flame className={`w-4 h-4 ${threat.severity === 'critical' ? 'animate-pulse' : ''}`} />
            Virality Progress
            {threat.severity === 'critical' && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </span>
          <motion.span
            key={Math.floor(liveVirality)}
            initial={{ scale: 1.2, color: viralityColor === 'red' ? '#ef4444' : '#f97316' }}
            animate={{ scale: 1, color: viralityColor === 'red' ? '#f87171' : viralityColor === 'orange' ? '#fb923c' : '#60a5fa' }}
            className="text-sm font-semibold"
          >
            {((liveVirality / threat.viralityThreshold) * 100).toFixed(1)}%
          </motion.span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
          <motion.div
            className={`h-full bg-gradient-to-r ${viralityColorClasses[viralityColor]}`}
            initial={{ width: `${(threat.viralityProgress / threat.viralityThreshold) * 100}%` }}
            animate={{ width: `${(liveVirality / threat.viralityThreshold) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
          {threat.severity === 'critical' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 glass rounded-lg">
          <Clock className="w-5 h-5 mx-auto mb-1 text-orange-500" />
          <div className="text-xs text-gray-400 mb-1">Response Window</div>
          <TimeCounter hours={threat.responseWindowHours} />
        </div>

        <div className="text-center p-3 glass rounded-lg">
          <TrendingUp className="w-5 h-5 mx-auto mb-1 text-blue-500" />
          <div className="text-xs text-gray-400 mb-1">Velocity</div>
          <div className="text-sm font-bold text-blue-400">+{threat.velocityPerHour}%/h</div>
        </div>

        <div className="text-center p-3 glass rounded-lg">
          <Users className="w-5 h-5 mx-auto mb-1 text-purple-500" />
          <div className="text-xs text-gray-400 mb-1">Current Reach</div>
          <motion.div
            key={Math.floor(liveReach / 100)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold text-purple-400"
          >
            {formatNumber(liveReach)}
          </motion.div>
        </div>

        <div className="text-center p-3 glass rounded-lg">
          <Zap className="w-5 h-5 mx-auto mb-1 text-green-500" />
          <div className="text-xs text-gray-400 mb-1">AI Responses</div>
          <div className="text-sm font-bold text-green-400">{threat.aiArsenal?.videos?.length || 0} Ready</div>
        </div>
      </div>

      {/* Channels */}
      <div className="flex flex-wrap gap-2 mb-4">
        {threat.channels.slice(0, 4).map((channel, i) => (
          <span key={i} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
            {channel.name}
            <span className="ml-1 text-orange-400">+{channel.velocity}%/h</span>
          </span>
        ))}
      </div>

      {/* Red Team Warning */}
      {threat.redTeam && (
        <div className="glass rounded-lg p-3 border border-orange-500/30 bg-orange-500/5">
          <div className="flex items-center gap-2 text-sm">
            <ShieldIcon className="w-4 h-4 text-orange-500" />
            <span className="text-orange-400 font-semibold">Red Team:</span>
            <span className="text-gray-300">{threat.redTeam.recommendation}</span>
            <span className="ml-auto text-xs text-gray-400">
              Backfire Risk: {threat.redTeam.responseBackfireRisk}%
            </span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedThreat(threat);
        }}
        whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(59, 130, 246, 0.5)' }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all"
      >
        <Zap className="w-4 h-4 inline mr-2" />
        Deploy AI Arsenal
      </motion.button>
    </motion.div>
  );
}
