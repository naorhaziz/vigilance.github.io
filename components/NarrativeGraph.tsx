'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

interface Node {
    id: string;
    label: string;
    color: string;
    cluster: number;
    x?: number;
    y?: number;
}

interface Link {
    source: string;
    target: string;
}

interface GraphData {
    nodes: Node[];
    links: Link[];
}

export default function NarrativeGraph() {
    const [threatActive, setThreatActive] = useState(false);
    const [protectionActive, setProtectionActive] = useState(false);
    const graphRef = useRef<any>();

    const graphData = useMemo<GraphData>(() => {
        const nodes: Node[] = [
            { id: 'brand', label: 'Brand', color: '#00D891', cluster: 0 },
        ];

        const links: Link[] = [];

        // Create 5 source clusters
        for (let cluster = 1; cluster <= 5; cluster++) {
            const sourceId = `source-${cluster}`;
            nodes.push({
                id: sourceId,
                label: `Source ${cluster}`,
                color: '#00D891',
                cluster,
            });
            links.push({ source: 'brand', target: sourceId });

            // Add 8 nodes per cluster
            for (let i = 0; i < 8; i++) {
                const nodeId = `node-${cluster}-${i}`;
                nodes.push({
                    id: nodeId,
                    label: `Node ${cluster}-${i}`,
                    color: '#00D891',
                    cluster,
                });
                links.push({ source: sourceId, target: nodeId });

                // Connect to 1-2 random nodes in the same cluster
                if (i > 0 && Math.random() > 0.5) {
                    const targetIdx = Math.floor(Math.random() * i);
                    links.push({
                        source: nodeId,
                        target: `node-${cluster}-${targetIdx}`,
                    });
                }
            }
        }

        return { nodes, links };
    }, []);

    // Update node colors based on state
    useEffect(() => {
        if (!graphRef.current) return;

        const updatedNodes = graphData.nodes.map((node) => {
            if (protectionActive) {
                return { ...node, color: '#00D891' }; // All green when protected
            } else if (threatActive && node.cluster === 3) {
                return { ...node, color: '#FF4D4D' }; // Cluster 3 turns red
            } else {
                return { ...node, color: threatActive ? '#97F7E2' : '#00D891' };
            }
        });

        graphData.nodes = updatedNodes;
    }, [threatActive, protectionActive, graphData]);

    return (
        <section className="relative py-20 sm:py-28 lg:py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                    >
                        Real-Time Narrative Surveillance
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg sm:text-xl text-vigilance-muted max-w-2xl mx-auto"
                    >
                        Watch how Vigilance monitors information flow across your entire narrative ecosystem
                    </motion.p>
                </div>

                <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                    {/* Graph Canvas */}
                    <div className="h-[360px] sm:h-[460px] lg:h-[600px] rounded-xl overflow-hidden bg-vigilance-base/50">
                        <ForceGraph2D
                            ref={graphRef}
                            graphData={graphData}
                            nodeLabel="label"
                            nodeColor={(node: any) => node.color}
                            nodeRelSize={6}
                            linkColor={() => 'rgba(151, 247, 226, 0.2)'}
                            linkWidth={1}
                            linkDirectionalParticles={threatActive && !protectionActive ? 4 : 2}
                            linkDirectionalParticleSpeed={
                                threatActive && !protectionActive ? 0.02 : 0.005
                            }
                            linkDirectionalParticleColor={() => '#97F7E2'}
                            nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                                // Check if node has valid coordinates
                                if (!node.x || !node.y || !isFinite(node.x) || !isFinite(node.y)) return;

                                const label = node.label;
                                const fontSize = 12 / globalScale;
                                ctx.font = `${fontSize}px Inter`;

                                // Draw glow
                                const gradient = ctx.createRadialGradient(
                                    node.x,
                                    node.y,
                                    0,
                                    node.x,
                                    node.y,
                                    node.id === 'brand' ? 20 : 10
                                );
                                gradient.addColorStop(0, `${node.color}40`);
                                gradient.addColorStop(1, 'transparent');

                                ctx.fillStyle = gradient;
                                ctx.beginPath();
                                ctx.arc(node.x, node.y, node.id === 'brand' ? 20 : 10, 0, 2 * Math.PI);
                                ctx.fill();

                                // Draw node
                                ctx.fillStyle = node.color;
                                ctx.beginPath();
                                ctx.arc(node.x, node.y, node.id === 'brand' ? 8 : 4, 0, 2 * Math.PI);
                                ctx.fill();
                            }}
                            cooldownTime={3000}
                            d3AlphaDecay={0.02}
                            d3VelocityDecay={0.3}
                        />
                    </div>

                    {/* Control Panel */}
                    <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-3 sm:gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setThreatActive(!threatActive);
                                setProtectionActive(false);
                            }}
                            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${threatActive
                                ? 'bg-vigilance-danger text-white'
                                : 'glass-panel text-vigilance-muted hover:text-white'
                                }`}
                        >
                            <AlertTriangle className="w-5 h-5" />
                            {threatActive ? 'Threat Active' : 'Simulate Breach'}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setProtectionActive(!protectionActive);
                                setThreatActive(false);
                            }}
                            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${protectionActive
                                ? 'bg-vigilance-primary text-vigilance-base'
                                : 'glass-panel text-vigilance-muted hover:text-white'
                                }`}
                        >
                            <Shield className="w-5 h-5" />
                            {protectionActive ? 'Protection Active' : 'Activate Protection'}
                        </motion.button>
                    </div>

                    {/* Status Display */}
                    {(threatActive || protectionActive) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 glass-panel rounded-lg p-4"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-3 h-3 rounded-full ${protectionActive
                                            ? 'bg-vigilance-primary animate-pulse'
                                            : 'bg-vigilance-danger animate-pulse'
                                            }`}
                                    />
                                    <span className="font-mono text-sm">
                                        {protectionActive ? 'All narratives verified' : 'Hallucination detected in cluster 3'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3 font-mono text-sm">
                                    <span className="text-vigilance-muted">
                                        Velocity:{' '}
                                        <span className={threatActive && !protectionActive ? 'text-vigilance-danger' : 'text-vigilance-primary'}>
                                            {threatActive && !protectionActive ? '400%' : '100%'}
                                        </span>
                                    </span>
                                    <span className="text-vigilance-muted">
                                        TTD:{' '}
                                        <span className="text-vigilance-primary">
                                            {protectionActive ? '4.2ms' : '--'}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
