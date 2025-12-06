import { useState } from 'react';
import { BarChart3, Globe, PieChart, TrendingUp, Share2, Users, Activity, Target } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import { formatNumber } from '../../lib/utils';

export default function AnalyticsPage() {
    const { getThreats } = useStore();
    const threats = getThreats();
    const [timeRange, setTimeRange] = useState('24h');

    // Platform Distribution
    const getPlatformDistribution = () => {
        const platforms = {};
        threats.forEach(threat => {
            threat.channels?.forEach(channel => {
                if (!platforms[channel.name]) {
                    platforms[channel.name] = {
                        reach: 0,
                        threats: 0,
                        sentiment: 0,
                        count: 0
                    };
                }
                platforms[channel.name].reach += channel.reach || 0;
                platforms[channel.name].threats += 1;
                platforms[channel.name].sentiment += channel.sentiment || 0;
                platforms[channel.name].count += 1;
            });
        });

        return Object.entries(platforms).map(([name, data]) => ({
            name,
            reach: data.reach,
            threats: data.threats,
            avgSentiment: data.count > 0 ? (data.sentiment / data.count) : 0
        })).sort((a, b) => b.reach - a.reach);
    };

    // Geographic Distribution
    const getGeographicDistribution = () => {
        const regions = {};
        threats.forEach(threat => {
            const primary = threat.geography?.primary || 'Unknown';
            if (!regions[primary]) {
                regions[primary] = {
                    threats: 0,
                    reach: 0,
                    critical: 0,
                    high: 0,
                    medium: 0
                };
            }
            regions[primary].threats += 1;
            regions[primary].reach += threat.currentReach || 0;

            if (threat.severity === 'critical') regions[primary].critical += 1;
            else if (threat.severity === 'high') regions[primary].high += 1;
            else if (threat.severity === 'medium') regions[primary].medium += 1;
        });

        return Object.entries(regions).map(([name, data]) => ({
            name,
            ...data
        })).sort((a, b) => b.threats - a.threats);
    };

    // Sentiment by Platform
    const getSentimentByPlatform = () => {
        const platforms = {};
        threats.forEach(threat => {
            threat.channels?.forEach(channel => {
                if (!platforms[channel.name]) {
                    platforms[channel.name] = [];
                }
                // Convert -100 to 0 scale to 0-100 scale
                const normalizedSentiment = 100 + (channel.sentiment || 0);
                platforms[channel.name].push(normalizedSentiment);
            });
        });

        return Object.entries(platforms).map(([name, sentiments]) => ({
            name,
            avgSentiment: sentiments.reduce((a, b) => a + b, 0) / sentiments.length,
            samples: sentiments.length
        })).sort((a, b) => a.avgSentiment - b.avgSentiment);
    };

    // Velocity Trends
    const getVelocityTrends = () => {
        return threats
            .map(t => ({
                title: t.title,
                velocity: t.velocityPerHour || 0,
                reach: t.currentReach || 0,
                severity: t.severity
            }))
            .sort((a, b) => b.velocity - a.velocity)
            .slice(0, 10);
    };

    const platformData = getPlatformDistribution();
    const geoData = getGeographicDistribution();
    const sentimentData = getSentimentByPlatform();
    const velocityData = getVelocityTrends();

    const totalReach = platformData.reduce((sum, p) => sum + p.reach, 0);

    return (
        <div className="p-6 pb-20">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-cyan-500" />
                    Analytics & Insights
                </h1>
                <p className="text-gray-400">Deep dive into platform distributions, geographic trends, and performance metrics</p>
            </div>

            {/* Time Range Filter */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setTimeRange('24h')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === '24h' ? 'bg-cyan-500 text-white' : 'glass text-gray-400 hover:text-white'
                        }`}
                >
                    Last 24 Hours
                </button>
                <button
                    onClick={() => setTimeRange('7d')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === '7d' ? 'bg-cyan-500 text-white' : 'glass text-gray-400 hover:text-white'
                        }`}
                >
                    Last 7 Days
                </button>
                <button
                    onClick={() => setTimeRange('30d')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === '30d' ? 'bg-cyan-500 text-white' : 'glass text-gray-400 hover:text-white'
                        }`}
                >
                    Last 30 Days
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-5 border border-white/5"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            <Share2 className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Total Platforms</div>
                            <div className="text-2xl font-bold text-cyan-400">{platformData.length}</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-xl p-5 border border-white/5"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Active Regions</div>
                            <div className="text-2xl font-bold text-purple-400">{geoData.length}</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-xl p-5 border border-white/5"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Total Reach</div>
                            <div className="text-2xl font-bold text-green-400">{formatNumber(totalReach)}</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-xl p-5 border border-white/5"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Avg Velocity</div>
                            <div className="text-2xl font-bold text-orange-400">
                                {(threats.reduce((sum, t) => sum + (t.velocityPerHour || 0), 0) / threats.length).toFixed(1)}/hr
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Platform Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass rounded-xl p-6 border border-white/5"
                >
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Share2 className="w-6 h-6 text-cyan-500" />
                        Platform Distribution
                    </h3>
                    <div className="space-y-4">
                        {platformData.map((platform, idx) => {
                            const percentage = (platform.reach / totalReach) * 100;
                            return (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-300">{platform.name}</span>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-cyan-400">{formatNumber(platform.reach)}</div>
                                            <div className="text-xs text-gray-500">{platform.threats} threats</div>
                                        </div>
                                    </div>
                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.8, delay: 0.5 + idx * 0.1 }}
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}% of total reach</div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Geographic Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass rounded-xl p-6 border border-white/5"
                >
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Globe className="w-6 h-6 text-purple-500" />
                        Geographic Distribution
                    </h3>
                    <div className="space-y-3">
                        {geoData.slice(0, 8).map((region, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all">
                                <div className="flex-1">
                                    <div className="font-medium text-gray-200">{region.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {region.critical > 0 && <span className="text-red-400">{region.critical} critical</span>}
                                        {region.critical > 0 && region.high > 0 && <span className="text-gray-600"> · </span>}
                                        {region.high > 0 && <span className="text-orange-400">{region.high} high</span>}
                                        {(region.critical > 0 || region.high > 0) && region.medium > 0 && <span className="text-gray-600"> · </span>}
                                        {region.medium > 0 && <span className="text-yellow-400">{region.medium} medium</span>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-purple-400">{region.threats}</div>
                                    <div className="text-xs text-gray-500">threats</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Additional Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sentiment by Platform */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass rounded-xl p-6 border border-white/5"
                >
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <PieChart className="w-6 h-6 text-green-500" />
                        Sentiment Analysis by Platform
                    </h3>
                    <div className="space-y-3">
                        {sentimentData.map((platform, idx) => {
                            const getSentimentColor = (score) => {
                                if (score >= 70) return { bg: 'bg-green-500', text: 'text-green-400' };
                                if (score >= 50) return { bg: 'bg-yellow-500', text: 'text-yellow-400' };
                                if (score >= 30) return { bg: 'bg-orange-500', text: 'text-orange-400' };
                                return { bg: 'bg-red-500', text: 'text-red-400' };
                            };
                            const colors = getSentimentColor(platform.avgSentiment);

                            return (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-300">{platform.name}</span>
                                        <span className={`text-sm font-bold ${colors.text}`}>
                                            {platform.avgSentiment.toFixed(0)}/100
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors.bg} transition-all duration-500`}
                                            style={{ width: `${platform.avgSentiment}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500">{platform.samples} samples</div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Top Velocity Trends */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="glass rounded-xl p-6 border border-white/5"
                >
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-orange-500" />
                        Top Velocity Trends
                    </h3>
                    <div className="space-y-2">
                        {velocityData.map((threat, idx) => {
                            const severityColors = {
                                critical: 'border-red-500/30 bg-red-500/10',
                                high: 'border-orange-500/30 bg-orange-500/10',
                                medium: 'border-yellow-500/30 bg-yellow-500/10',
                                low: 'border-blue-500/30 bg-blue-500/10'
                            };

                            return (
                                <div
                                    key={idx}
                                    className={`p-3 rounded-lg border ${severityColors[threat.severity]} hover:scale-[1.02] transition-all`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-200 truncate">{threat.title}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formatNumber(threat.reach)} reach
                                            </div>
                                        </div>
                                        <div className="text-right ml-3">
                                            <div className="text-lg font-bold text-orange-400">{threat.velocity}</div>
                                            <div className="text-xs text-gray-500">/hr</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
