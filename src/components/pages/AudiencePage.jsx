import { useState } from 'react';
import { Users, TrendingUp, Target, AlertTriangle, Activity, MessageSquare, Share2, Eye, ThumbsDown, ChevronRight, Flag, Sparkles, CheckCircle, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudiencePage() {
    const { getThreats, getCriticalThreats } = useStore();
    const [selectedInfluencer, setSelectedInfluencer] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [reportSubmitted, setReportSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const threats = getThreats();
    const criticalThreat = getCriticalThreats()[0];

    // Aggregate influencer data from all threats
    const getAllInfluencers = () => {
        const influencerMap = new Map();

        threats.forEach(threat => {
            threat.keyInfluencers?.forEach(inf => {
                const key = inf.handle;
                if (!influencerMap.has(key)) {
                    influencerMap.set(key, { ...inf, threats: [threat.title] });
                } else {
                    influencerMap.get(key).threats.push(threat.title);
                }
            });
        });

        return Array.from(influencerMap.values())
            .sort((a, b) => b.impact - a.impact);
    };

    const influencers = getAllInfluencers();

    // Aggregate audience demographics
    const getAudienceDemographics = () => {
        const geoMap = new Map();
        const langMap = new Map();

        threats.forEach(threat => {
            // Geography
            [threat.geography?.primary, ...(threat.geography?.secondary || [])].forEach(loc => {
                if (loc) {
                    geoMap.set(loc, (geoMap.get(loc) || 0) + 1);
                }
            });

            // Languages
            [threat.languages?.primary, threat.languages?.secondary, threat.languages?.tertiary]
                .filter(Boolean)
                .forEach(lang => {
                    langMap.set(lang.code, (langMap.get(lang.code) || 0) + lang.percentage);
                });
        });

        return {
            geography: Array.from(geoMap.entries())
                .map(([name, count]) => ({ name, percentage: (count / threats.length) * 35 }))
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 8),
            languages: Array.from(langMap.entries())
                .map(([code, total]) => ({ code, percentage: Math.min(100, total / threats.length) }))
                .sort((a, b) => b.percentage - a.percentage)
        };
    };

    const demographics = getAudienceDemographics();

    const getStanceColor = (stance) => {
        switch (stance) {
            case 'hostile': return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'critical': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
            case 'neutral': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
            case 'supportive': return 'text-green-400 bg-green-500/20 border-green-500/30';
            default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    const getImpactLevel = (impact) => {
        if (impact >= 80) return { label: 'Critical', color: 'text-red-400' };
        if (impact >= 60) return { label: 'High', color: 'text-orange-400' };
        if (impact >= 40) return { label: 'Medium', color: 'text-yellow-400' };
        return { label: 'Low', color: 'text-blue-400' };
    };

    const reportReasons = [
        { id: 'misinformation', label: 'Spreading Misinformation', icon: '🚨', aiSuggestion: 'High-priority target. AI detected 87% false claims in recent posts.' },
        { id: 'hate-speech', label: 'Hate Speech / Incitement', icon: '⚠️', aiSuggestion: 'Critical threat. Pattern analysis shows coordinated harassment campaign.' },
        { id: 'impersonation', label: 'Impersonation / Fake Account', icon: '🎭', aiSuggestion: 'AI verification: 92% probability of inauthentic account behavior.' },
        { id: 'spam', label: 'Spam / Bot Activity', icon: '🤖', aiSuggestion: 'Automated behavior detected. Posting velocity exceeds human capacity.' },
        { id: 'manipulation', label: 'Coordinated Manipulation', icon: '🎯', aiSuggestion: 'Network analysis reveals connection to 47 similar accounts.' },
        { id: 'other', label: 'Other Violation', icon: '📝', aiSuggestion: 'Custom report will be reviewed by AI + human team.' }
    ];

    const handleReport = (influencer) => {
        setSelectedInfluencer(influencer);
        setShowReportModal(true);
        setReportSubmitted(false);
        setSelectedReason('');
    };

    const submitReport = async () => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setReportSubmitted(true);

        // Auto close after 3 seconds
        setTimeout(() => {
            setShowReportModal(false);
            setReportSubmitted(false);
            setSelectedReason('');
        }, 3000);
    }; return (
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
                            <Users className="w-10 h-10 text-purple-500" />
                            Audience Intelligence
                        </h1>
                        <p className="text-gray-400">
                            Monitor key influencers, demographics, and spreading patterns
                        </p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 glass rounded-lg">
                        <Activity className="w-5 h-5 text-purple-500 animate-pulse" />
                        <div>
                            <div className="text-xs text-gray-400">Active Influencers</div>
                            <div className="text-lg font-bold text-purple-400">{influencers.length}</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Demographics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Geographic Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Target className="w-5 h-5 text-blue-500" />
                        <h3 className="text-xl font-semibold">Geographic Reach</h3>
                    </div>
                    <div className="space-y-4">
                        {demographics.geography.map((geo, idx) => (
                            <motion.div
                                key={geo.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.03 }}
                            >
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">{geo.name}</span>
                                    <span className="text-blue-400 font-semibold">{geo.percentage.toFixed(0)}%</span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${geo.percentage}%` }}
                                        transition={{
                                            duration: 0.8,
                                            delay: idx * 0.03,
                                            ease: "easeOut"
                                        }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Language Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <MessageSquare className="w-5 h-5 text-green-500" />
                        <h3 className="text-xl font-semibold">Language Breakdown</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {demographics.languages.map((lang, idx) => (
                            <motion.div
                                key={lang.code}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="p-4 rounded-lg text-center border border-white/10 bg-slate-800/50 hover:bg-slate-700/50 hover:border-green-500/30 transition-all duration-300"
                            >
                                <div className="text-3xl font-bold text-green-400 mb-1">
                                    {lang.percentage.toFixed(0)}%
                                </div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">
                                    {lang.code}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Key Influencers Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-purple-500" />
                        Key Influencers
                    </h2>
                    <div className="text-sm text-gray-400">
                        Sorted by impact score
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {influencers.map((influencer, idx) => {
                        const impactLevel = getImpactLevel(influencer.impact);

                        return (
                            <motion.div
                                key={influencer.handle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.3) }}
                                onClick={() => setSelectedInfluencer(influencer)}
                                className="glass rounded-xl p-6 border border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Avatar */}
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            {influencer.handle.charAt(1).toUpperCase()}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                                                    {influencer.handle}
                                                </h3>
                                                <span className={`text-xs px-2 py-1 rounded-full border ${getStanceColor(influencer.stance)}`}>
                                                    {influencer.stance}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-6 text-sm text-gray-400 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{(influencer.followers / 1000000).toFixed(1)}M followers</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Share2 className="w-4 h-4" />
                                                    <span>{influencer.platform}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Activity className="w-4 h-4" />
                                                    <span>{influencer.recentPosts} recent posts</span>
                                                </div>
                                            </div>

                                            {/* Threat Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {influencer.threats.slice(0, 3).map((threat, i) => (
                                                    <span key={i} className="text-xs px-2 py-1 bg-slate-800 text-gray-300 rounded">
                                                        {threat}
                                                    </span>
                                                ))}
                                                {influencer.threats.length > 3 && (
                                                    <span className="text-xs px-2 py-1 bg-slate-800 text-gray-400 rounded">
                                                        +{influencer.threats.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Impact Score */}
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <div className={`text-3xl font-bold ${impactLevel.color} mb-1`}>
                                            {influencer.impact}
                                        </div>
                                        <div className="text-xs text-gray-400 mb-2">Impact Score</div>
                                        <div className={`text-xs px-2 py-1 rounded ${influencer.impact >= 80 ? 'bg-red-500/20 text-red-400' :
                                            influencer.impact >= 60 ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {impactLevel.label}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                                        <span>Reach Potential</span>
                                        <span>{influencer.impact}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${influencer.impact}%` }}
                                            transition={{
                                                duration: 0.8,
                                                delay: Math.min(idx * 0.02, 0.2),
                                                ease: "easeOut"
                                            }}
                                            className={`h-full ${influencer.impact >= 80 ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                                influencer.impact >= 60 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                                                    'bg-gradient-to-r from-yellow-500 to-green-500'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {influencers.length === 0 && (
                    <div className="glass rounded-xl p-12 text-center">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400">No influencers detected yet</p>
                    </div>
                )}
            </motion.div>

            {/* Influencer Detail Modal */}
            <AnimatePresence mode="wait">
                {selectedInfluencer && !showReportModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedInfluencer(null)}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-8">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold">
                                            {selectedInfluencer.handle.charAt(1).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold mb-1">{selectedInfluencer.handle}</h2>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm px-3 py-1 rounded-full border ${getStanceColor(selectedInfluencer.stance)}`}>
                                                    {selectedInfluencer.stance}
                                                </span>
                                                <span className="text-gray-400">{selectedInfluencer.platform}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedInfluencer(null)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="glass p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-purple-400 mb-1">
                                            {(selectedInfluencer.followers / 1000000).toFixed(1)}M
                                        </div>
                                        <div className="text-xs text-gray-400">Followers</div>
                                    </div>
                                    <div className="glass p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-blue-400 mb-1">
                                            {selectedInfluencer.impact}
                                        </div>
                                        <div className="text-xs text-gray-400">Impact Score</div>
                                    </div>
                                    <div className="glass p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-green-400 mb-1">
                                            {selectedInfluencer.recentPosts}
                                        </div>
                                        <div className="text-xs text-gray-400">Recent Posts</div>
                                    </div>
                                </div>

                                {/* Associated Threats */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Associated Threats</h3>
                                    <div className="space-y-2">
                                        {selectedInfluencer.threats.map((threat, idx) => (
                                            <div key={idx} className="glass-hover p-3 rounded-lg flex items-center justify-between">
                                                <span className="text-gray-300">{threat}</span>
                                                <ChevronRight className="w-4 h-4 text-gray-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 flex gap-3">
                                    <button className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        Monitor Activity
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowReportModal(true);
                                            setReportSubmitted(false);
                                            setSelectedReason('');
                                        }}
                                        className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                                    >
                                        <Flag className="w-4 h-4" />
                                        Report to Platform
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Report Modal */}
            <AnimatePresence>
                {showReportModal && selectedInfluencer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
                        onClick={() => !reportSubmitted && setShowReportModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-red-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-red-500/20"
                        >
                            {!reportSubmitted ? (
                                <div className="p-8">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <Flag className="w-6 h-6 text-red-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white mb-1">Report Influencer</h2>
                                                <p className="text-sm text-gray-400">Report {selectedInfluencer.handle} to {selectedInfluencer.platform}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowReportModal(false)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* AI Assistant Banner */}
                                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                                            <span className="text-sm font-semibold text-blue-300">AI Report Assistant Active</span>
                                        </div>
                                        <p className="text-xs text-gray-300">
                                            Our AI has analyzed {selectedInfluencer.handle}'s activity and will help optimize your report for maximum effectiveness.
                                        </p>
                                    </div>

                                    {/* Report Reasons */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-4 text-white">Select Violation Type</h3>
                                        <div className="space-y-3">
                                            {reportReasons.map((reason) => (
                                                <motion.div
                                                    key={reason.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setSelectedReason(reason.id)}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedReason === reason.id
                                                        ? 'border-red-500 bg-red-500/10'
                                                        : 'border-white/10 bg-slate-800/50 hover:border-red-500/50'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-2xl">{reason.icon}</span>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-semibold text-white">{reason.label}</h4>
                                                                {selectedReason === reason.id && (
                                                                    <CheckCircle className="w-4 h-4 text-red-400" />
                                                                )}
                                                            </div>
                                                            <AnimatePresence>
                                                                {selectedReason === reason.id && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, maxHeight: 0 }}
                                                                        animate={{ opacity: 1, maxHeight: 200 }}
                                                                        exit={{ opacity: 0, maxHeight: 0 }}
                                                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                                            <div className="flex items-start gap-2">
                                                                                <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                                                <p className="text-xs text-blue-200">{reason.aiSuggestion}</p>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Evidence Summary */}
                                    {selectedReason && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-6 p-4 bg-slate-800/50 border border-white/10 rounded-xl"
                                        >
                                            <h4 className="font-semibold mb-3 text-white flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-purple-400" />
                                                AI-Generated Evidence Summary
                                            </h4>
                                            <div className="space-y-2 text-sm text-gray-300">
                                                <div className="flex justify-between">
                                                    <span>Impact Score:</span>
                                                    <span className="text-red-400 font-semibold">{selectedInfluencer.impact}/100</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Recent Posts Analyzed:</span>
                                                    <span className="text-blue-400 font-semibold">{selectedInfluencer.recentPosts}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Associated Threats:</span>
                                                    <span className="text-orange-400 font-semibold">{selectedInfluencer.threats.length}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Estimated Reach:</span>
                                                    <span className="text-purple-400 font-semibold">{(selectedInfluencer.followers / 1000000).toFixed(1)}M</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowReportModal(false)}
                                            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-colors text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={submitReport}
                                            disabled={!selectedReason || isSubmitting}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Flag className="w-4 h-4" />
                                                    Submit Report
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="p-12 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2 }}
                                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                                    >
                                        <CheckCircle className="w-12 h-12 text-green-400" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Report Submitted Successfully!</h3>
                                    <p className="text-gray-300 mb-2">
                                        Your report has been sent to {selectedInfluencer.platform}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Report ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                                    </p>
                                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                        <p className="text-sm text-blue-200">
                                            <Sparkles className="w-4 h-4 inline mr-1" />
                                            AI will continue monitoring {selectedInfluencer.handle} and notify you of any changes.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
