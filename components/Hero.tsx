'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Shield, ShieldAlert, Building2, Zap } from 'lucide-react';
import { useRef } from 'react';

export default function Hero() {
    return (
        <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden px-6 py-16 sm:py-20">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-mint-glow opacity-20 blur-3xl" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center lg:items-stretch relative z-10">
                {/* Left: Copy */}
                <div className="flex flex-col space-y-6 sm:space-y-8 lg:h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                            Treat Narrative Security as a{' '}
                            <span className="bg-gradient-to-r from-vigilance-primary to-vigilance-secondary bg-clip-text text-transparent">
                                Cybersecurity Threat
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg lg:text-xl text-vigilance-muted leading-relaxed">
                            Detect and contain narrative breaches with the same rigor you apply to network security.
                            Stop hallucination velocity before it becomes liability.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm">
                            <div className="glass-panel px-4 py-2 rounded-lg">
                                <span className="text-vigilance-muted">TTD:</span>{' '}
                                <span className="text-vigilance-primary font-bold">&lt; 5ms</span>
                            </div>
                            <div className="glass-panel px-4 py-2 rounded-lg">
                                <span className="text-vigilance-muted">TTC:</span>{' '}
                                <span className="text-vigilance-primary font-bold">&lt; 50ms</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="flex flex-wrap items-center gap-4 lg:mt-auto"
                    >
                        <a href="#book-demo" className="btn-primary w-full sm:w-auto text-center">Book a Demo</a>
                    </motion.div>
                </div>

                {/* Right: 3D Tilt Card */}
                <TiltCard />
            </div>
        </section>
    );
}

function TiltCard() {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        x.set((e.clientX - centerX) / (rect.width / 2));
        y.set((e.clientY - centerY) / (rect.height / 2));
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className="perspective-1000 w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
        >
            <motion.div
                className="preserve-3d relative w-full h-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto rounded-2xl"
                style={{
                    rotateX,
                    rotateY,
                }}
            >
                {/* Base Layer (Z=0) - Glass Background */}
                <div className="absolute inset-0 glass-card rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-vigilance-surface/50 via-vigilance-surface/30 to-transparent" />
                    <div className="absolute inset-0 border-2 border-white/5 rounded-2xl" />
                </div>

                {/* Content Layer (Z=30px) */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center p-6"
                    style={{ translateZ: 30 }}
                >
                    <div className="relative w-full h-full max-w-md sm:max-w-lg">
                        <motion.svg
                            viewBox="0 0 100 100"
                            className="absolute inset-0 w-full h-full"
                        >
                            <motion.line
                                x1="28"
                                y1="22"
                                x2="50"
                                y2="50"
                                stroke="rgba(255, 77, 77, 0.8)"
                                strokeWidth="1.6"
                                strokeDasharray="4 6"
                                animate={{ strokeDashoffset: [0, -20] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                            <motion.line
                                x1="28"
                                y1="50"
                                x2="50"
                                y2="50"
                                stroke="rgba(255, 77, 77, 0.6)"
                                strokeWidth="1.6"
                                strokeDasharray="4 6"
                                animate={{ strokeDashoffset: [0, -20] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                            />
                            <motion.line
                                x1="28"
                                y1="78"
                                x2="50"
                                y2="50"
                                stroke="rgba(255, 77, 77, 0.7)"
                                strokeWidth="1.6"
                                strokeDasharray="4 6"
                                animate={{ strokeDashoffset: [0, -20] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                            />
                            <motion.line
                                x1="50"
                                y1="50"
                                x2="74"
                                y2="50"
                                stroke="rgba(0, 216, 145, 0.8)"
                                strokeWidth="1.8"
                                strokeDasharray="6 6"
                                animate={{ strokeDashoffset: [0, -24] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                            />
                        </motion.svg>

                        <div className="absolute left-[6%] top-[12%]">
                            <SourceNode label="ChatGPT" tag="GPT" tone="emerald" />
                        </div>
                        <div className="absolute left-[6%] top-[42%]">
                            <SourceNode label="Gemini" tag="GEM" tone="violet" />
                        </div>
                        <div className="absolute left-[6%] top-[72%]">
                            <SourceNode label="Claude" tag="CLD" tone="amber" />
                        </div>

                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <ShieldNode />
                        </div>

                        <div className="absolute right-[4%] top-1/2 -translate-y-1/2">
                            <BrandNode />
                        </div>
                    </div>
                </motion.div>

                {/* Particle Layer (Z=60px) - Floating Elements */}
                <motion.div style={{ translateZ: 60 }} className="absolute inset-0 pointer-events-none">
                    <FloatingParticle delay={0} x={24} y={18} />
                    <FloatingParticle delay={0.6} x={76} y={24} />
                    <FloatingParticle delay={1.2} x={62} y={76} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

function SourceNode({ label, tag, tone }: { label: string; tag: string; tone: 'emerald' | 'violet' | 'amber' }) {
    const toneStyles = {
        emerald: 'bg-emerald-400/15 text-emerald-200 border-emerald-400/30',
        violet: 'bg-violet-400/15 text-violet-200 border-violet-400/30',
        amber: 'bg-amber-400/15 text-amber-200 border-amber-400/30',
    }[tone];

    return (
        <div className="relative rounded-xl">
            <div className="absolute inset-0 rounded-xl bg-vigilance-surface/90" />
            <div className="relative glass-panel rounded-xl px-3 py-2 border flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${toneStyles}`}>
                    {tag}
                </div>
                <div className="text-left">
                    <div className="text-xs font-semibold">{label}</div>
                    <div className="text-[10px] text-vigilance-muted font-mono">Attack source</div>
                </div>
            </div>
        </div>
    );
}

function ShieldNode() {
    return (
        <div className="relative">
            <Shield
                className="w-20 h-20 sm:w-24 sm:h-24 text-vigilance-primary"
                fill="currentColor"
                strokeWidth={0}
            />
            <div className="absolute inset-0 flex items-center justify-center text-vigilance-base font-bold text-lg sm:text-xl">
                V
            </div>
            <motion.div
                className="absolute inset-0 bg-vigilance-primary/20 blur-xl rounded-full"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-vigilance-muted">
                Vigilance
            </div>
        </div>
    );
}

function BrandNode() {
    return (
        <div className="relative rounded-xl">
            <div className="absolute inset-0 rounded-xl bg-vigilance-surface/90" />
            <div className="relative glass-panel rounded-xl px-3 py-2 border flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-vigilance-primary/20 border border-vigilance-primary/30 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-vigilance-primary" />
                </div>
                <div className="text-left">
                    <div className="text-xs font-semibold">Brand</div>
                    <div className="text-[10px] text-vigilance-muted font-mono">Protected</div>
                </div>
            </div>
        </div>
    );
}

function FloatingParticle({ delay, x, y }: { delay: number; x: number; y: number }) {
    return (
        <motion.div
            className="absolute w-2 h-2 bg-vigilance-secondary rounded-full"
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
            }}
        />
    );
}
