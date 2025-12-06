import { TrendingUp, TrendingDown, Users, Globe, Shield, Activity, Zap, AlertTriangle, MessageSquare, Eye, Clock, Target, BarChart3, Smile, Meh, Frown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatNumber } from '../../lib/utils';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WorldMap from '../WorldMap';

export default function DashboardPage() {
  const { getThreats, getCriticalThreats, database, currentTenant } = useStore();
  const threats = getThreats();
  const criticalThreats = getCriticalThreats();

  // Calculate overall sentiment from all threats (0-100 scale)
  const calculateOverallSentiment = () => {
    if (threats.length === 0) return 50; // neutral
    let totalSentiment = 0;
    let count = 0;

    threats.forEach(threat => {
      threat.channels?.forEach(channel => {
        // Convert -100 to 0 scale to 0-100 scale
        const normalizedSentiment = 100 + (channel.sentiment || 0);
        totalSentiment += normalizedSentiment;
        count++;
      });
    });

    return count > 0 ? Math.round(totalSentiment / count) : 50;
  };

  const overallSentiment = calculateOverallSentiment();

  // Get sentiment emoji and color
  const getSentimentDisplay = (score) => {
    if (score >= 70) {
      return {
        icon: Smile,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        iconBg: 'bg-green-500/20',
        label: 'Positive',
        barColor: 'bg-gradient-to-r from-green-500 to-emerald-400',
        chartColor: '#10b981', // green-500
        chartGradient: ['#10b981', '#34d399'] // green-500 to green-400
      };
    }
    if (score >= 50) {
      return {
        icon: Meh,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30',
        iconBg: 'bg-yellow-500/20',
        label: 'Neutral',
        barColor: 'bg-gradient-to-r from-yellow-500 to-orange-400',
        chartColor: '#eab308', // yellow-500
        chartGradient: ['#eab308', '#fbbf24'] // yellow-500 to yellow-400
      };
    }
    if (score >= 30) {
      return {
        icon: Frown,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500/30',
        iconBg: 'bg-orange-500/20',
        label: 'Negative',
        barColor: 'bg-gradient-to-r from-orange-500 to-red-400',
        chartColor: '#f97316', // orange-500
        chartGradient: ['#f97316', '#fb923c'] // orange-500 to orange-400
      };
    }
    return {
      icon: Frown,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      iconBg: 'bg-red-500/20',
      label: 'Very Negative',
      barColor: 'bg-gradient-to-r from-red-500 to-pink-500',
      chartColor: '#ef4444', // red-500
      chartGradient: ['#ef4444', '#f87171'] // red-500 to red-400
    };
  };

  const sentimentDisplay = getSentimentDisplay(overallSentiment);

  // Calculate conversation volume (last 24h)
  const conversationVolume = threats.reduce((sum, t) => sum + (t.currentReach || 0), 0);

  // Risk level calculation
  const calculateRiskLevel = () => {
    const criticalWeight = criticalThreats.length * 3;
    const highWeight = threats.filter(t => t.severity === 'high').length * 2;
    const mediumWeight = threats.filter(t => t.severity === 'medium').length;
    const totalRisk = criticalWeight + highWeight + mediumWeight;

    if (totalRisk >= 15) return { level: 'Critical', color: 'red', value: 95 };
    if (totalRisk >= 8) return { level: 'High', color: 'orange', value: 75 };
    if (totalRisk >= 4) return { level: 'Elevated', color: 'yellow', value: 50 };
    return { level: 'Normal', color: 'green', value: 25 };
  };

  const riskLevel = calculateRiskLevel();

  // Generate sentiment over time (24h)
  const [sentimentTimeline, setSentimentTimeline] = useState([]);

  useEffect(() => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      const baseValue = overallSentiment;
      const variance = (Math.random() - 0.5) * 10;
      data.push({
        hour: i,
        value: Math.max(0, Math.min(100, baseValue + variance))
      });
    }
    setSentimentTimeline(data);
  }, [overallSentiment]);

  // Conversation volume timeline
  const [volumeTimeline, setVolumeTimeline] = useState([]);

  useEffect(() => {
    const data = [];
    const baseVolume = conversationVolume / 24;
    for (let i = 0; i < 24; i++) {
      const variance = (Math.random() - 0.3) * baseVolume * 0.5;
      data.push({
        hour: i,
        value: Math.max(0, baseVolume + variance)
      });
    }
    setVolumeTimeline(data);
  }, [conversationVolume]);

  // Get trending narratives
  const getTrendingNarratives = () => {
    return threats
      .sort((a, b) => (b.velocityPerHour || 0) - (a.velocityPerHour || 0))
      .slice(0, 5)
      .map(threat => ({
        title: threat.title,
        narrative: threat.narrative,
        velocity: threat.velocityPerHour || 0,
        reach: threat.currentReach || 0,
        trend: threat.velocityPerHour > 5 ? 'up' : 'down'
      }));
  };

  const trendingNarratives = getTrendingNarratives();

  // Recent activity
  const getRecentActivity = () => {
    const activities = [];
    const now = Date.now();

    threats.slice(0, 8).forEach((threat, i) => {
      const detectedTime = new Date(threat.detectedAt).getTime();
      const minutesAgo = Math.floor((now - detectedTime) / 1000 / 60);

      activities.push({
        time: minutesAgo < 60 ? `${minutesAgo}m ago` : `${Math.floor(minutesAgo / 60)}h ago`,
        text: `${threat.severity === 'critical' ? '🔴' : threat.severity === 'high' ? '🟠' : '🟡'} ${threat.title.slice(0, 50)}${threat.title.length > 50 ? '...' : ''}`,
        type: threat.severity
      });
    });

    return activities;
  };

  const recentActivity = getRecentActivity();

  // System health metrics
  const systemHealth = {
    uptime: '99.9%',
    latency: '12ms',
    sources: threats.reduce((sum, t) => sum + (t.channels?.length || 0), 0),
    processing: Math.round(conversationVolume / 1000) + 'K/day'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 gradient-text">Intelligence Dashboard</h1>
        <p className="text-gray-400">Real-time threat analytics and monitoring</p>
      </motion.div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Overall Sentiment */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-12 h-12 rounded-lg ${sentimentDisplay.iconBg} flex items-center justify-center border ${sentimentDisplay.borderColor}`}>
                <sentimentDisplay.icon className={`w-6 h-6 ${sentimentDisplay.color}`} />
              </div>
              <span className="text-sm font-semibold text-gray-400">Sentiment Score</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <div className={`text-4xl font-bold ${sentimentDisplay.color}`}>
              {overallSentiment}
            </div>
            <span className="text-sm text-gray-500">/ 100</span>
          </div>
          <div className={`text-sm mb-3 font-semibold ${sentimentDisplay.color}`}>
            {sentimentDisplay.label}
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallSentiment}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full ${sentimentDisplay.barColor}`}
            />
          </div>
        </motion.div>        {/* Conversation Volume */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm font-semibold text-gray-400">Volume (24h)</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-4xl font-bold text-white">{formatNumber(conversationVolume)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold">+{threats.length > 0 ? Math.round(threats.reduce((s, t) => s + (t.velocityPerHour || 0), 0) / threats.length) : 0}%</span>
            <span className="text-gray-500">vs yesterday</span>
          </div>
        </motion.div>

        {/* Risk Level */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-12 h-12 rounded-lg ${riskLevel.color === 'red' ? 'bg-red-500/20 border-red-500/30' :
                riskLevel.color === 'orange' ? 'bg-orange-500/20 border-orange-500/30' :
                  riskLevel.color === 'yellow' ? 'bg-yellow-500/20 border-yellow-500/30' :
                    'bg-green-500/20 border-green-500/30'
                } flex items-center justify-center border`}>
                <Shield className={`w-6 h-6 ${riskLevel.color === 'red' ? 'text-red-400' :
                  riskLevel.color === 'orange' ? 'text-orange-400' :
                    riskLevel.color === 'yellow' ? 'text-yellow-400' :
                      'text-green-400'
                  }`} />
              </div>
              <span className="text-sm font-semibold text-gray-400">Risk Level</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <div className={`text-4xl font-bold ${riskLevel.color === 'red' ? 'text-red-400' :
              riskLevel.color === 'orange' ? 'text-orange-400' :
                riskLevel.color === 'yellow' ? 'text-yellow-400' :
                  'text-green-400'
              }`}>
              {riskLevel.level}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${riskLevel.value}%` }}
                transition={{ duration: 1, delay: 0.4 }}
                className={`h-full ${riskLevel.color === 'red' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                  riskLevel.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                    riskLevel.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-amber-400' :
                      'bg-gradient-to-r from-green-500 to-emerald-400'
                  }`}
              />
            </div>
            <span className="text-xs text-gray-500">{riskLevel.value}%</span>
          </div>
        </motion.div>

        {/* Active Incidents */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-sm font-semibold text-gray-400">Active Incidents</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-4xl font-bold text-white">{threats.length}</div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full font-semibold border border-red-500/30">
              {criticalThreats.length} Critical
            </span>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sentiment Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-semibold">Sentiment Over Time</h3>
            </div>
            <span className="text-xs text-gray-400">Last 24 hours</span>
          </div>

          <div className="relative h-48">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 items-end pr-3">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            <div className="absolute left-12 right-0 top-0 bottom-0">
              <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={getSentimentDisplay(overallSentiment).chartColor} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={getSentimentDisplay(overallSentiment).chartColor} stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1="25" x2="400" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                {sentimentTimeline.length > 0 && (
                  <>
                    {/* Area under the line */}
                    <path
                      d={`
                        M 0,100
                        ${sentimentTimeline.map((point, i) => {
                        const x = (i / (sentimentTimeline.length - 1)) * 400;
                        const y = 100 - point.value;
                        return `L ${x},${y}`;
                      }).join(' ')}
                        L 400,100
                        Z
                      `}
                      fill="url(#sentimentGradient)"
                    />

                    {/* Line */}
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                      d={`
                        M ${sentimentTimeline.map((point, i) => {
                        const x = (i / (sentimentTimeline.length - 1)) * 400;
                        const y = 100 - point.value;
                        return `${x},${y}`;
                      }).join(' L ')}
                      `}
                      fill="none"
                      stroke={getSentimentDisplay(overallSentiment).chartColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data points */}
                    {sentimentTimeline.map((point, i) => {
                      const x = (i / (sentimentTimeline.length - 1)) * 400;
                      const y = 100 - point.value;
                      // Only show every 3rd point to reduce clutter
                      if (i % 3 !== 0) return null;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="2.5"
                          fill={getSentimentDisplay(overallSentiment).chartColor}
                          stroke="rgba(15, 23, 42, 0.8)"
                          strokeWidth="1.5"
                          opacity="0.9"
                        />
                      );
                    })}
                  </>
                )}
              </svg>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2 pl-12">
            <span>24h ago</span>
            <span>12h ago</span>
            <span>Now</span>
          </div>
        </motion.div>

        {/* Conversation Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold">Conversation Volume</h3>
            </div>
            <span className="text-xs text-gray-400">Last 24 hours</span>
          </div>

          <div className="relative h-48">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 items-end pr-3">
              {volumeTimeline.length > 0 && (
                <>
                  <span>{formatNumber(Math.max(...volumeTimeline.map(p => p.value)))}</span>
                  <span>{formatNumber(Math.round(Math.max(...volumeTimeline.map(p => p.value)) * 0.75))}</span>
                  <span>{formatNumber(Math.round(Math.max(...volumeTimeline.map(p => p.value)) * 0.5))}</span>
                  <span>{formatNumber(Math.round(Math.max(...volumeTimeline.map(p => p.value)) * 0.25))}</span>
                  <span>0</span>
                </>
              )}
            </div>

            <div className="absolute left-12 right-0 top-0 bottom-0">
              <div className="h-full flex items-end gap-0.5">
                {volumeTimeline.map((point, i) => {
                  const maxValue = Math.max(...volumeTimeline.map(p => p.value), 1);
                  const heightPercent = (point.value / maxValue) * 100;

                  return (
                    <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 + i * 0.02, ease: "easeOut" }}
                        className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t origin-bottom"
                        style={{ height: `${heightPercent}%`, minHeight: heightPercent > 0 ? '2px' : '0' }}
                      />
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 shadow-lg border border-purple-500/30">
                        {formatNumber(Math.round(point.value))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2 pl-12">
            <span>24h ago</span>
            <span>12h ago</span>
            <span>Now</span>
          </div>
        </motion.div>
      </div>

      {/* Map and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* World Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Global Threat Map</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </div>
          </div>

          <div className="h-80 bg-slate-900/50 rounded-lg overflow-hidden border border-white/5">
            <WorldMap threats={threats} />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.05 }}
                className="flex items-start gap-2 p-2 glass-hover rounded-lg text-sm"
              >
                <div className="text-xs text-gray-500 mt-0.5 flex-shrink-0">{activity.time}</div>
                <div className="flex-1 text-gray-300">{activity.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Trending Narratives and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trending Narratives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="lg:col-span-2 glass rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold">Trending Narratives</h3>
          </div>

          <div className="space-y-3">
            {trendingNarratives.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.1 }}
                className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all"
              >
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-gray-400 italic">"{item.narrative?.slice(0, 80)}..."</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 mb-1">
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-red-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-400" />
                    )}
                    <span className={`text-sm font-bold ${item.trend === 'up' ? 'text-red-400' : 'text-green-400'}`}>
                      {item.velocity}x/hr
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{formatNumber(item.reach)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold">System Health</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Uptime</span>
                <span className="font-semibold text-green-400">{systemHealth.uptime}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '99.9%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Latency</span>
                <span className="font-semibold text-cyan-400">{systemHealth.latency}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Data Sources</span>
                <span className="font-semibold text-purple-400">{systemHealth.sources}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Processing</span>
                <span className="font-semibold text-blue-400">{systemHealth.processing}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-semibold">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                All Systems Operational
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
