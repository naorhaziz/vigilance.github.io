import { MessageSquare, Search, Filter, TrendingUp, AlertTriangle, Eye, Zap, Clock } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ThreatCard from '../ThreatCard';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function NarrativesPage() {
    const { getThreats, selectedThreat, setSelectedThreat } = useStore();
    const allThreats = getThreats();
    const { id } = useParams();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [sortBy, setSortBy] = useState('virality'); // virality, severity, time

    // Auto-open modal if a threat ID is in the URL
    useEffect(() => {
        if (id) {
            const threat = allThreats.find(t => t.id === id);
            if (threat) {
                setSelectedThreat(threat);
            }
        }
    }, [id, allThreats, setSelectedThreat]);

    // Filter and sort threats
    const threats = allThreats
        .filter(t => {
            // Search filter
            if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !t.narrative.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            // Status filter
            if (selectedStatus !== 'all' && t.status !== selectedStatus) {
                return false;
            }
            // Severity filter
            if (selectedSeverity !== 'all' && t.severity !== selectedSeverity) {
                return false;
            }
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'virality') {
                return (b.viralityProgress || 0) - (a.viralityProgress || 0);
            }
            if (sortBy === 'severity') {
                const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
                return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
            }
            if (sortBy === 'time') {
                return new Date(b.detectedAt) - new Date(a.detectedAt);
            }
            return 0;
        });

    // Stats
    const stats = {
        total: allThreats.length,
        critical: allThreats.filter(t => t.severity === 'critical').length,
        viral: allThreats.filter(t => t.status === 'viral').length,
        earlyWarning: allThreats.filter(t => t.status === 'early_warning').length,
        monitoring: allThreats.filter(t => t.status === 'monitoring').length
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                            <MessageSquare className="w-10 h-10 text-purple-500" />
                            Narrative Intelligence
                        </h1>
                        <p className="text-gray-400">
                            Monitor, analyze, and counter false narratives in real-time
                        </p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="glass rounded-lg p-4 border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-gray-400">Total</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-400">{stats.total}</div>
                    </div>
                    <div className="glass rounded-lg p-4 border border-red-500/30">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-xs text-gray-400">Critical</span>
                        </div>
                        <div className="text-2xl font-bold text-red-400">{stats.critical}</div>
                    </div>
                    <div className="glass rounded-lg p-4 border border-orange-500/30">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-orange-400" />
                            <span className="text-xs text-gray-400">Viral</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-400">{stats.viral}</div>
                    </div>
                    <div className="glass rounded-lg p-4 border border-yellow-500/30">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs text-gray-400">Early Warning</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-400">{stats.earlyWarning}</div>
                    </div>
                    <div className="glass rounded-lg p-4 border border-blue-500/30">
                        <div className="flex items-center gap-2 mb-1">
                            <Eye className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-gray-400">Monitoring</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-400">{stats.monitoring}</div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="glass rounded-lg p-4 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2 relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search narratives..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                            >
                                <option value="all">All Phases</option>
                                <option value="viral">Viral</option>
                                <option value="early_warning">Early Warning</option>
                                <option value="monitoring">Monitoring</option>
                            </select>
                        </div>

                        {/* Severity Filter */}
                        <div className="relative">
                            <AlertTriangle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={selectedSeverity}
                                onChange={(e) => setSelectedSeverity(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                            >
                                <option value="all">All Severity</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                        <span className="text-sm text-gray-400">Sort by:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortBy('virality')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${sortBy === 'virality'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-800 text-gray-400 hover:text-white'
                                    }`}
                            >
                                Virality
                            </button>
                            <button
                                onClick={() => setSortBy('severity')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${sortBy === 'severity'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-800 text-gray-400 hover:text-white'
                                    }`}
                            >
                                Severity
                            </button>
                            <button
                                onClick={() => setSortBy('time')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${sortBy === 'time'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-800 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Clock className="w-3 h-3 inline mr-1" />
                                Recent
                            </button>
                        </div>
                        {(searchQuery || selectedStatus !== 'all' || selectedSeverity !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedStatus('all');
                                    setSelectedSeverity('all');
                                }}
                                className="ml-auto px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Threats List */}
            {threats.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-xl p-12 text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-10 h-10 text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">
                        {searchQuery || selectedStatus !== 'all' || selectedSeverity !== 'all'
                            ? 'No narratives match your filters'
                            : 'No Active Narratives'}
                    </h3>
                    <p className="text-gray-400">
                        {searchQuery || selectedStatus !== 'all' || selectedSeverity !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'All systems normal · Continuous monitoring active'}
                    </p>
                </motion.div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-400">
                        Showing {threats.length} of {allThreats.length} narratives
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {threats.map((threat, index) => (
                            <motion.div
                                key={threat.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ThreatCard threat={threat} />
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
