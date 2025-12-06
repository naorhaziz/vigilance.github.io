import { MessageSquare } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ThreatCard from '../ThreatCard';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function NarrativesPage() {
    const { getThreats, selectedThreat, setSelectedThreat } = useStore();
    const threats = getThreats();
    const { id } = useParams();

    // Auto-open modal if a threat ID is in the URL
    useEffect(() => {
        if (id) {
            const threat = threats.find(t => t.id === id);
            if (threat) {
                setSelectedThreat(threat);
            }
        }
    }, [id, threats, setSelectedThreat]);

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
                            <MessageSquare className="w-10 h-10 text-purple-500" />
                            Narrative Intelligence
                        </h1>
                        <p className="text-gray-400">
                            Monitor and counter false narratives in real-time
                        </p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 glass rounded-lg">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">Active Narratives</div>
                            <div className="text-sm font-bold text-purple-400">{threats.length}</div>
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
                    <div className="w-20 h-20 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-10 h-10 text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">No Active Narratives</h3>
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
