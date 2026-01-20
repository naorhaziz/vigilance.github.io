'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Search,
    Zap,
    AlertTriangle,
    Users,
    TrendingUp,
    Shield,
    CheckCircle2,
    Clock,
    Activity
} from 'lucide-react';

export default function IncidentTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start center', 'end center'],
    });

    const stages = [
        {
            id: 1,
            time: 'T+0ms',
            title: 'User Query',
            description: 'User searches for business information',
            icon: Search,
            color: 'text-vigilance-secondary',
            bgColor: 'bg-vigilance-secondary/10',
            detail: 'Query: "Wolf River Electric court case"',
            metric: null,
        },
        {
            id: 2,
            time: 'T+47ms',
            title: 'AI Generation',
            description: 'LLM generates response with hallucinated content',
            icon: Zap,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-400/10',
            detail: 'Model generates unverified claims',
            metric: null,
        },
        {
            id: 3,
            time: 'T+50ms',
            title: 'Injection Point',
            description: 'False narrative enters information ecosystem',
            icon: AlertTriangle,
            color: 'text-vigilance-danger',
            bgColor: 'bg-vigilance-danger/10',
            detail: 'Hallucination: "Company filed for bankruptcy"',
            metric: { label: 'TTD Without Vigilance', value: '—' },
        },
        {
            id: 4,
            time: 'T+55ms',
            title: 'Vigilance Detection',
            description: 'Narrative anomaly detected via provenance check',
            icon: Shield,
            color: 'text-vigilance-primary',
            bgColor: 'bg-vigilance-primary/10',
            detail: 'Cross-reference: No bankruptcy filing found',
            metric: { label: 'TTD', value: '5ms' },
        },
        {
            id: 5,
            time: 'T+120ms',
            title: 'Early Spread',
            description: 'Without protection: 47 shares, 2.3K impressions',
            icon: Users,
            color: 'text-vigilance-danger',
            bgColor: 'bg-vigilance-danger/10',
            detail: 'Velocity: +380% (Unprotected scenario)',
            metric: { label: 'Reach', value: '2.3K' },
        },
        {
            id: 6,
            time: 'T+105ms',
            title: 'Containment',
            description: 'Vigilance blocks distribution, triggers review',
            icon: CheckCircle2,
            color: 'text-vigilance-primary',
            bgColor: 'bg-vigilance-primary/10',
            detail: 'Output quarantined, fact-check initiated',
            metric: { label: 'TTC', value: '50ms' },
        },
        {
            id: 7,
            time: 'T+5min',
            title: 'Unprotected Impact',
            description: 'Projected damage without intervention',
            icon: TrendingUp,
            color: 'text-vigilance-danger',
            bgColor: 'bg-vigilance-danger/10',
            detail: 'Est. reach: 250K, Legal exposure: High',
            metric: { label: 'Prevented', value: '100%' },
        },
        {
            id: 8,
            time: 'T+10min',
            title: 'Remediation Complete',
            description: 'Corrected response deployed with citations',
            icon: Activity,
            color: 'text-vigilance-primary',
            bgColor: 'bg-vigilance-primary/10',
            detail: 'Source: Court records verified',
            metric: { label: 'Liability', value: '$0' },
        },
    ];

    return (
        <section ref={containerRef} className="relative py-20 sm:py-28 lg:py-32 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16 sm:mb-24 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                    >
                        Anatomy of a Narrative Breach
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg sm:text-xl text-vigilance-muted max-w-3xl mx-auto"
                    >
                        Visualizing how Vigilance intercepts hallucinations in real-time,
                        preventing the cascade from generation to legal liability
                    </motion.p>
                </div>

                {/* Timeline Path */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-vigilance-secondary via-vigilance-danger to-vigilance-primary"
                        style={{ transform: 'translateX(-50%)' }}
                    />

                    {/* Stages */}
                    <div className="space-y-16 sm:space-y-24">
                        {stages.map((stage, index) => (
                            <TimelineStage
                                key={stage.id}
                                stage={stage}
                                index={index}
                                scrollProgress={scrollYProgress}
                            />
                        ))}
                    </div>
                </div>

                {/* Summary Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <StatCard
                        icon={Clock}
                        label="Detection Speed"
                        value="5ms"
                        description="Average TTD"
                    />
                    <StatCard
                        icon={Shield}
                        label="Containment"
                        value="50ms"
                        description="Average TTC"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Prevented Reach"
                        value="250K+"
                        description="Per incident"
                    />
                    <StatCard
                        icon={CheckCircle2}
                        label="Success Rate"
                        value="99.7%"
                        description="Accuracy"
                    />
                </motion.div>
            </div>
        </section>
    );
}

function TimelineStage({ stage, index, scrollProgress }: any) {
    const Icon = stage.icon;
    const isLeft = index % 2 === 0;
    const threshold = index / 8;
    const opacity = useTransform(scrollProgress, [threshold - 0.1, threshold], [0.3, 1]);

    return (
        <motion.div
            style={{ opacity }}
            className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0"
        >
            {/* Central Node */}
            <div className="relative md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.1 }}
                    className={`w-16 h-16 rounded-full ${stage.bgColor} border-2 ${stage.color === 'text-vigilance-danger'
                        ? 'border-vigilance-danger'
                        : stage.color === 'text-vigilance-primary'
                            ? 'border-vigilance-primary'
                            : 'border-vigilance-secondary'
                        } flex items-center justify-center backdrop-blur-sm relative`}
                >
                    <Icon className={`w-8 h-8 ${stage.color}`} />
                    <motion.div
                        className={`absolute inset-0 rounded-full blur-xl ${stage.color === 'text-vigilance-danger'
                            ? 'bg-vigilance-danger/20'
                            : stage.color === 'text-vigilance-primary'
                                ? 'bg-vigilance-primary/20'
                                : 'bg-vigilance-secondary/20'
                            }`}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </motion.div>
            </div>

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-full md:w-5/12 ${isLeft ? 'md:mr-auto md:pr-24' : 'md:ml-auto md:pl-24'}`}
            >
                <div className="glass-card rounded-xl p-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-vigilance-secondary">{stage.time}</span>
                        {stage.metric && (
                            <div className="text-right">
                                <div className="text-xs text-vigilance-muted">{stage.metric.label}</div>
                                <div className="text-lg font-bold text-vigilance-primary">{stage.metric.value}</div>
                            </div>
                        )}
                    </div>

                    <h3 className="text-2xl font-bold">{stage.title}</h3>
                    <p className="text-vigilance-muted">{stage.description}</p>

                    <div className="glass-panel rounded-lg p-3 mt-3">
                        <p className="text-sm font-mono text-vigilance-secondary">{stage.detail}</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function StatCard({ icon: Icon, label, value, description }: any) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card rounded-xl p-6 text-center space-y-3"
        >
            <Icon className="w-8 h-8 text-vigilance-primary mx-auto" />
            <div className="text-3xl font-bold text-vigilance-primary font-mono">{value}</div>
            <div className="text-sm font-semibold">{label}</div>
            <div className="text-xs text-vigilance-muted">{description}</div>
        </motion.div>
    );
}
