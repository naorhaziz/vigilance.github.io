import { Shield, Search, Filter, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatNumber } from '../../lib/utils';

export default function AllThreatsPage() {
  const { getThreats, setSelectedThreat } = useStore();
  const threats = getThreats();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredThreats = threats.filter(threat => {
    const matchesSearch = threat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || threat.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const severityCounts = {
    critical: threats.filter(t => t.severity === 'critical').length,
    high: threats.filter(t => t.severity === 'high').length,
    medium: threats.filter(t => t.severity === 'medium').length,
    low: threats.filter(t => t.severity === 'low').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Shield className="w-10 h-10 text-blue-500" />
          All Threats
        </h1>
        <p className="text-gray-400">Complete threat database and analytics</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Critical', count: severityCounts.critical, color: 'border-red-500', textColor: 'text-red-400', icon: AlertTriangle },
          { label: 'High', count: severityCounts.high, color: 'border-orange-500', textColor: 'text-orange-400', icon: TrendingUp },
          { label: 'Medium', count: severityCounts.medium, color: 'border-blue-500', textColor: 'text-blue-400', icon: TrendingDown },
          { label: 'Low', count: severityCounts.low, color: 'border-green-500', textColor: 'text-green-400', icon: Shield },
        ].map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setFilterSeverity(filterSeverity === item.label.toLowerCase() ? 'all' : item.label.toLowerCase())}
            className={`glass rounded-xl p-4 border-l-4 ${item.color} hover:bg-white/10 transition-all ${
              filterSeverity === item.label.toLowerCase() ? 'ring-2 ring-white/20' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <item.icon className={`w-6 h-6 ${item.textColor}`} />
              <div className={`text-3xl font-bold ${item.textColor}`}>{item.count}</div>
            </div>
            <div className="text-sm text-gray-400">{item.label} Severity</div>
          </motion.button>
        ))}
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-4 mb-6 flex gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search threats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="px-4 py-2 glass-hover rounded-lg flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </motion.div>

      {/* Threats Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Threat</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Virality</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Reach</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredThreats.map((threat, index) => (
                <motion.tr
                  key={threat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedThreat(threat)}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold">{threat.title}</div>
                    <div className="text-sm text-gray-400 truncate max-w-md">{threat.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      threat.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      threat.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      threat.severity === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden max-w-24">
                        <div
                          className={`h-full ${
                            threat.viralityProgress > 70 ? 'bg-red-500' :
                            threat.viralityProgress > 40 ? 'bg-orange-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${(threat.viralityProgress / threat.viralityThreshold) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{threat.viralityProgress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{formatNumber(threat.currentReach)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400">
                      {threat.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedThreat(threat);
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm font-semibold transition-colors"
                    >
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredThreats.length === 0 && (
          <div className="p-12 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No threats found matching your criteria</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
