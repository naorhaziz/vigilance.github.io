import { useState, useEffect } from 'react';
import { MessageSquare, TrendingUp, TrendingDown, AlertTriangle, Activity, Clock, Target, Zap, Share2, Eye, BarChart3, PieChart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimeRemaining } from '../../lib/utils';

export default function NarrativesPage() {
    const { getThreats, getCriticalThreats } = useStore();
    const threats = getThreats();
    const [selectedNarrative, setSelectedNarrative] = useState(null);
    const [timeRange, setTimeRange] = useState('24h');

    // Extract all narratives from threats
    const narratives = threats.map(threat => ({
        id: threat.id,
        narrative: threat.narrative,
        counterNarrative: threat.counterNarrative,
        title: threat.title,
        severity: threat.severity,
        viralityProgress: threat.viralityProgress || 0,
        currentReach: threat.currentReach || 0,
        projectedReach: threat.projectedReach || 0,
        velocityPerHour: threat.velocityPerHour || 0,
        responseWindowHours: threat.responseWindowHours || 0,
        channels: threat.channels || [],
        geography: threat.geography,
        sourceAnalysis: threat.sourceAnalysis,
        detectedAt: threat.detectedAt
    }));

    // Calculate narrative trends
    const calculateTrend = (narrative) => {
        const hoursSinceDetection = (Date.now() - new Date(narrative.detectedAt).getTime()) / (1000 * 60 * 60);
        const growthRate = hoursSinceDetection > 0 ? (narrative.viralityProgress / hoursSinceDetection).toFixed(1) : 0;
        return {
            direction: narrative.velocityPerHour > 5 ? 'up' : 'down',
            value: growthRate
        };
    };

    // Narrative distribution by platform
    const getNarrativesByPlatform = () => {
        const platforms = {};
        narratives.forEach(narrative => {
            narrative.channels?.forEach(channel => {
                if (!platforms[channel.name]) {
                    platforms[channel.name] = {
                        count: 0,
                        totalReach: 0,
                        avgSentiment: 0
                    };
                }
                platforms[channel.name].count += 1;
                platforms[channel.name].totalReach += channel.reach;
                platforms[channel.name].avgSentiment += channel.sentiment;
            });
        });

        return Object.entries(platforms).map(([name, data]) => ({
            name,
            count: data.count,
            reach: data.totalReach,
            sentiment: (data.avgSentiment / data.count).toFixed(0)
        }));
    };

    const platformData = getNarrativesByPlatform();

    // Narrative velocity over time (simulated)
    const [velocityData, setVelocityData] = useState([]);

    useEffect(() => {
        // Generate velocity timeline data
        const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
        const data = [];

        if (narratives.length > 0) {
            for (let i = 0; i < Math.min(hours, 24); i++) {
                const baseValue = narratives.reduce((sum, n) => sum + (n.velocityPerHour || 0), 0) / narratives.length;
                const variance = (Math.random() - 0.5) * baseValue * 0.4;
                data.push({
                    time: i,
                    value: Math.max(0, baseValue + variance)
                });
            }
        } else {
            // Default data if no narratives
            for (let i = 0; i < 24; i++) {
                data.push({ time: i, value: 0 });
            }
        }
        setVelocityData(data);
    }, [timeRange, narratives.length]);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
            case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        }
    };

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
                            <MessageSquare className="w-10 h-10 text-cyan-500" />
                            Narrative Intelligence
                        </h1>
                        <p className="text-gray-400">
                            Track false narratives vs. counter-narratives in real-time
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Time Range Selector */}
                        <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                            {['24h', '7d', '30d'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${timeRange === range
                                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass rounded-xl p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{narratives.length}</div>
                                <div className="text-xs text-gray-400">Active Narratives</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass rounded-xl p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    {narratives.filter(n => n.velocityPerHour > 5).length}
                                </div>
                                <div className="text-xs text-gray-400">Trending Up</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass rounded-xl p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <Eye className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    {narratives.length > 0 ? (narratives.reduce((sum, n) => sum + n.currentReach, 0) / 1000000).toFixed(1) : '0.0'}M
                                </div>
                                <div className="text-xs text-gray-400">Total Reach</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass rounded-xl p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    {narratives.length > 0 ? (narratives.reduce((sum, n) => sum + n.velocityPerHour, 0) / narratives.length).toFixed(1) : '0.0'}
                                </div>
                                <div className="text-xs text-gray-400">Avg Velocity</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Narrative Velocity Graph */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass rounded-xl p-6 mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-cyan-500" />
                        <h3 className="text-xl font-semibold">Narrative Velocity Trends</h3>
                    </div>
                    <div className="text-sm text-gray-400">Spread rate over time</div>
                </div>

                <div className="relative h-64">
                    <svg className="w-full h-full">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map(i => (
                            <line
                                key={i}
                                x1="0"
                                y1={`${(i * 25)}%`}
                                x2="100%"
                                y2={`${(i * 25)}%`}
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="1"
                            />
                        ))}

                        {/* Area gradient */}
                        <defs>
                            <linearGradient id="velocityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Area */}
                        <path
                            d={`M 0 256 ${velocityData.map((point, i) => {
                                const x = (i / (velocityData.length - 1)) * 100;
                                const y = 256 - (point.value / 15) * 230;
                                return `L ${x}% ${y}`;
                            }).join(' ')} L 100% 256 Z`}
                            fill="url(#velocityGradient)"
                        />

                        {/* Line */}
                        <path
                            d={velocityData.map((point, i) => {
                                const x = (i / (velocityData.length - 1)) * 100;
                                const y = 256 - (point.value / 15) * 230;
                                return `${i === 0 ? 'M' : 'L'} ${x}% ${y}`;
                            }).join(' ')}
                            stroke="rgb(6, 182, 212)"
                            strokeWidth="2"
                            fill="none"
                        />

                        {/* Points */}
                        {velocityData.map((point, i) => {
                            const x = (i / (velocityData.length - 1)) * 100;
                            const y = 256 - (point.value / 15) * 230;
                            return (
                                <circle
                                    key={i}
                                    cx={`${x}%`}
                                    cy={y}
                                    r="3"
                                    fill="rgb(6, 182, 212)"
                                />
                            );
                        })}
                    </svg>

                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
                        <span>{timeRange === '24h' ? '24h ago' : timeRange === '7d' ? '7d ago' : '30d ago'}</span>
                        <span>Now</span>
                    </div>
                </div>
            </motion.div>

            {/* Platform Distribution & Source Analysis */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Platform Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Share2 className="w-5 h-5 text-purple-500" />
                        <h3 className="text-xl font-semibold">Platform Distribution</h3>
                    </div>

                    <div className="space-y-4">
                        {platformData.length > 0 ? platformData.map((platform, idx) => {
                            const maxReach = Math.max(...platformData.map(p => p.reach), 1);
                            return (
                                <div key={platform.name}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-300">{platform.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400">{(platform.reach / 1000).toFixed(0)}K</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${platform.sentiment < -70 ? 'bg-red-500/20 text-red-400' :
                                                platform.sentiment < -40 ? 'bg-orange-500/20 text-orange-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {platform.sentiment}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(platform.reach / maxReach) * 100}%` }}
                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                        />
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center text-gray-400 py-8">
                                No platform data available
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Average Source Analysis */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="glass rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart className="w-5 h-5 text-blue-500" />
                        <h3 className="text-xl font-semibold">Source Distribution</h3>
                    </div>

                    {narratives[0]?.sourceAnalysis && (
                        <div className="space-y-6">
                            {[
                                { label: 'Organic', value: narratives[0].sourceAnalysis.organic, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/20' },
                                { label: 'Coordinated', value: narratives[0].sourceAnalysis.coordinated, color: 'from-orange-500 to-yellow-500', bg: 'bg-orange-500/20' },
                                { label: 'Automated', value: narratives[0].sourceAnalysis.automated, color: 'from-red-500 to-pink-500', bg: 'bg-red-500/20' }
                            ].map((source, idx) => (
                                <div key={source.label}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-300">{source.label}</span>
                                        <span className="text-2xl font-bold text-white">{source.value}%</span>
                                    </div>
                                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${source.value}%` }}
                                            transition={{ duration: 1, delay: idx * 0.15 }}
                                            className={`h-full bg-gradient-to-r ${source.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Narratives List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Target className="w-6 h-6 text-cyan-500" />
                        Active False Narratives
                    </h2>
                </div>

                <div className="space-y-4">
                    {narratives.length > 0 ? narratives.map((narrative, idx) => {
                        const trend = calculateTrend(narrative);

                        return (
                            <motion.div
                                key={narrative.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => setSelectedNarrative(narrative)}
                                className="glass rounded-xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                                {narrative.title}
                                            </h3>
                                            <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(narrative.severity)}`}>
                                                {narrative.severity}
                                            </span>
                                        </div>

                                        {/* False Narrative */}
                                        <div className="mb-3 p-3 bg-red-500/10 border-l-4 border-red-500 rounded">
                                            <div className="text-xs text-red-400 font-semibold mb-1 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                FALSE NARRATIVE
                                            </div>
                                            <p className="text-sm text-gray-300 italic">"{narrative.narrative}"</p>
                                        </div>

                                        {/* Counter Narrative */}
                                        <div className="p-3 bg-green-500/10 border-l-4 border-green-500 rounded">
                                            <div className="text-xs text-green-400 font-semibold mb-1 flex items-center gap-1">
                                                <Zap className="w-3 h-3" />
                                                COUNTER-NARRATIVE
                                            </div>
                                            <p className="text-sm text-gray-300">"{narrative.counterNarrative}"</p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="text-right ml-6 flex-shrink-0">
                                        <div className="text-3xl font-bold text-cyan-400 mb-1">
                                            {narrative.viralityProgress}%
                                        </div>
                                        <div className="text-xs text-gray-400 mb-3">Virality</div>

                                        <div className={`flex items-center gap-1 text-sm ${trend.direction === 'up' ? 'text-red-400' : 'text-green-400'
                                            }`}>
                                            {trend.direction === 'up' ? (
                                                <TrendingUp className="w-4 h-4" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4" />
                                            )}
                                            <span>{trend.value}%/hr</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                                        <span>Spread Progress</span>
                                        <span>{narrative.currentReach.toLocaleString()} / {narrative.projectedReach.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${narrative.viralityProgress}%` }}
                                            transition={{ duration: 1, delay: idx * 0.05 }}
                                            className={`h-full ${narrative.severity === 'critical' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                                narrative.severity === 'high' ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                                                    'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Bottom Stats */}
                                <div className="flex items-center gap-6 text-sm text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatTimeRemaining(narrative.responseWindowHours).hours}h {formatTimeRemaining(narrative.responseWindowHours).minutes}m left</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{(narrative.currentReach / 1000).toFixed(0)}K reach</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Activity className="w-4 h-4" />
                                        <span>{narrative.velocityPerHour}x/hr velocity</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Share2 className="w-4 h-4" />
                                        <span>{narrative.channels?.length || 0} platforms</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }) : (
                        <div className="glass rounded-xl p-12 text-center">
                            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Active Narratives</h3>
                            <p className="text-gray-500">No false narratives detected at this time</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
