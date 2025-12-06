import { AlertTriangle, Shield } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ThreatCard from '../ThreatCard';
import { motion } from 'framer-motion';

export default function EarlyWarningPage() {
  const { getThreats } = useStore();
  const threats = getThreats();

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
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <div>
              <div className="text-xs text-gray-400">System Status</div>
              <div className="text-sm font-bold text-green-400">ACTIVE</div>
            </div>
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
