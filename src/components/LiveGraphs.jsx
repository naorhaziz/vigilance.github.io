import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Clock, AlertTriangle, Activity } from 'lucide-react';

// Velocity Graph - Shows threat spread over last 24 hours
export function VelocityGraph({ threat }) {
    const canvasRef = useRef(null);
    const [dataPoints, setDataPoints] = useState([]);

    useEffect(() => {
        // Generate simulated velocity data based on current velocity
        const points = [];
        const now = Date.now();
        const velocity = threat.velocityPerHour || 5;

        for (let i = 24; i >= 0; i--) {
            const variance = (Math.random() - 0.5) * velocity * 0.3;
            points.push({
                time: now - (i * 3600000), // hours ago
                value: Math.max(0, velocity + variance)
            });
        }
        setDataPoints(points);
    }, [threat]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dataPoints.length === 0) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Find max value for scaling
        const maxValue = Math.max(...dataPoints.map(p => p.value));

        // Draw area gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, height);

        dataPoints.forEach((point, i) => {
            const x = (width / (dataPoints.length - 1)) * i;
            const y = height - (point.value / maxValue) * height * 0.9;
            if (i === 0) {
                ctx.lineTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        // Draw line
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();

        dataPoints.forEach((point, i) => {
            const x = (width / (dataPoints.length - 1)) * i;
            const y = height - (point.value / maxValue) * height * 0.9;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw current point
        const lastX = width;
        const lastY = height - (dataPoints[dataPoints.length - 1].value / maxValue) * height * 0.9;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
        ctx.fill();

    }, [dataPoints]);

    return (
        <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-500" />
                    <h3 className="font-semibold">Spread Velocity (24h)</h3>
                </div>
                <div className="text-2xl font-bold text-red-400">
                    {threat.velocityPerHour?.toFixed(1)}<span className="text-sm text-gray-400">/hr</span>
                </div>
            </div>
            <canvas ref={canvasRef} width={600} height={150} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>24h ago</span>
                <span>Now</span>
            </div>
        </div>
    );
}

// Source Distribution Pie Chart
export function SourceDistribution({ sourceAnalysis }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !sourceAnalysis) return;

        const ctx = canvas.getContext('2d');
        const centerX = 80;
        const centerY = 80;
        const radius = 60;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const data = [
            { label: 'Organic', value: sourceAnalysis.organic, color: '#3b82f6' },
            { label: 'Coordinated', value: sourceAnalysis.coordinated, color: '#f59e0b' },
            { label: 'Automated', value: sourceAnalysis.automated, color: '#ef4444' }
        ];

        let currentAngle = -Math.PI / 2;

        data.forEach(item => {
            const sliceAngle = (item.value / 100) * Math.PI * 2;

            // Draw slice
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // Draw border
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            currentAngle += sliceAngle;
        });

        // Draw center circle for donut effect
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
        ctx.fill();

    }, [sourceAnalysis]);

    return (
        <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Source Analysis</h3>
            </div>
            <div className="flex items-center justify-between">
                <canvas ref={canvasRef} width={160} height={160} />
                <div className="space-y-3">
                    {sourceAnalysis && [
                        { label: 'Organic', value: sourceAnalysis.organic, color: 'bg-blue-500' },
                        { label: 'Coordinated', value: sourceAnalysis.coordinated, color: 'bg-amber-500' },
                        { label: 'Automated', value: sourceAnalysis.automated, color: 'bg-red-500' }
                    ].map(item => (
                        <div key={item.label} className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <div>
                                <div className="text-xs text-gray-400">{item.label}</div>
                                <div className="font-semibold">{item.value}%</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Response Timeline - Critical timing visualization
export function ResponseTimeline({ threat }) {
    const totalHours = 24;
    const elapsedHours = Math.random() * 2; // Time since detection
    const responseWindow = threat.responseWindowHours || 4;
    const viralPoint = responseWindow;

    const elapsedPercent = (elapsedHours / totalHours) * 100;
    const windowPercent = (responseWindow / totalHours) * 100;
    const viralPercent = (viralPoint / totalHours) * 100;

    return (
        <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold">Response Timeline</h3>
            </div>

            {/* Timeline Bar */}
            <div className="relative h-12 bg-slate-800 rounded-lg overflow-hidden">
                {/* Elapsed time */}
                <div
                    className="absolute top-0 left-0 h-full bg-blue-500/30 transition-all duration-1000"
                    style={{ width: `${elapsedPercent}%` }}
                />

                {/* Response Window */}
                <div
                    className="absolute top-0 left-0 h-full bg-orange-500/20 border-r-2 border-orange-500"
                    style={{ width: `${windowPercent}%` }}
                />

                {/* Viral Point Marker */}
                <div
                    className="absolute top-0 h-full w-1 bg-red-500"
                    style={{ left: `${viralPercent}%` }}
                >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                    </div>
                </div>

                {/* Current Time Indicator */}
                <div
                    className="absolute top-0 h-full w-1 bg-blue-500"
                    style={{ left: `${elapsedPercent}%` }}
                >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-4 text-xs">
                <div>
                    <div className="text-gray-500">Detected</div>
                    <div className="font-semibold text-blue-400">{elapsedHours.toFixed(1)}h ago</div>
                </div>
                <div className="text-center">
                    <div className="text-gray-500">Response Window</div>
                    <div className="font-semibold text-orange-400">{responseWindow}h</div>
                </div>
                <div className="text-right">
                    <div className="text-gray-500">Viral Point</div>
                    <div className="font-semibold text-red-400">{viralPoint.toFixed(1)}h</div>
                </div>
            </div>

            {/* Effectiveness Decay Warning */}
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-red-400">
                    <TrendingUp className="w-4 h-4 rotate-180" />
                    <span>Response effectiveness decays by <strong>{threat.effectivenessDecayPerHour}%/hour</strong></span>
                </div>
            </div>
        </div>
    );
}

// Channel Performance Comparison
export function ChannelComparison({ channels }) {
    const maxReach = Math.max(...(channels?.map(c => c.reach) || [1]));

    return (
        <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">Channel Distribution</h3>
            </div>
            <div className="space-y-4">
                {channels?.map(channel => (
                    <div key={channel.name}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">{channel.name}</span>
                            <span className="text-gray-400">{(channel.reach / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="relative h-8 bg-slate-800 rounded-lg overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(channel.reach / maxReach) * 100}%` }}
                                transition={{ duration: 1, delay: 0.1 }}
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-end pr-2"
                            >
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="flex items-center gap-1">
                                        <Activity className="w-3 h-3" />
                                        <span>{channel.velocity?.toFixed(1)}/h</span>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded ${channel.sentiment < -70 ? 'bg-red-500/30 text-red-300' :
                                        channel.sentiment < -40 ? 'bg-orange-500/30 text-orange-300' :
                                            'bg-yellow-500/30 text-yellow-300'
                                        }`}>
                                        {channel.sentiment}%
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Audience Demographics (from geography and languages)
export function AudienceDemographics({ geography, languages, currentReach }) {
    const allRegions = [
        geography?.primary,
        ...(geography?.secondary || []),
        ...(geography?.tertiary || [])
    ].filter(Boolean);

    const allLanguages = [
        languages?.primary,
        languages?.secondary,
        languages?.tertiary
    ].filter(Boolean);

    // Calculate geographic reach by numbers
    const calculateGeographicReach = () => {
        const totalReach = currentReach || 847000; // fallback
        const reaches = [];

        if (geography?.primary) {
            reaches.push({ region: geography.primary, reach: Math.floor(totalReach * 0.45) });
        }

        (geography?.secondary || []).forEach((region, idx) => {
            const percentage = idx === 0 ? 0.25 : 0.15;
            reaches.push({ region, reach: Math.floor(totalReach * percentage) });
        });

        (geography?.tertiary || []).forEach(region => {
            const percentage = 0.05;
            reaches.push({ region, reach: Math.floor(totalReach * percentage) });
        });

        return reaches.slice(0, 5);
    };

    const geographicReaches = calculateGeographicReach();

    // Format number to K/M notation
    const formatReach = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
        return num.toString();
    };

    return (
        <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Audience Demographics</h3>
            </div>

            {/* Geographic Distribution */}
            <div className="mb-6">
                <div className="text-sm text-gray-400 mb-3">Geographic Reach</div>
                <div className="space-y-2">
                    {geographicReaches.map((item, idx) => {
                        return (
                            <div key={item.region} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-green-500' :
                                            idx === 1 ? 'bg-blue-500' :
                                                idx === 2 ? 'bg-purple-500' :
                                                    'bg-gray-500'
                                        }`} />
                                    <div className="text-xs text-gray-300">{item.region}</div>
                                </div>
                                <div className="text-sm font-bold text-white">{formatReach(item.reach)}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Language Distribution - Pie Chart */}
            <div>
                <div className="text-sm text-gray-400 mb-3">Language Breakdown</div>
                <div className="flex items-center gap-4">
                    {/* Pie Chart */}
                    <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                            {allLanguages.reduce((acc, lang, idx) => {
                                const percentage = lang.percentage;
                                const colors = ['#10b981', '#3b82f6', '#8b5cf6'];
                                const color = colors[idx] || '#6b7280';

                                // Calculate cumulative percentage for offset
                                const cumulativePercentage = allLanguages
                                    .slice(0, idx)
                                    .reduce((sum, l) => sum + l.percentage, 0);

                                const circumference = 2 * Math.PI * 30; // radius = 30
                                const offset = circumference - (percentage / 100) * circumference;
                                const rotateOffset = (cumulativePercentage / 100) * circumference;

                                acc.push(
                                    <circle
                                        key={idx}
                                        cx="50"
                                        cy="50"
                                        r="30"
                                        fill="none"
                                        stroke={color}
                                        strokeWidth="20"
                                        strokeDasharray={`${circumference} ${circumference}`}
                                        strokeDashoffset={offset}
                                        style={{
                                            strokeDashoffset: offset,
                                            transformOrigin: '50% 50%',
                                            transform: `rotate(${(rotateOffset / circumference) * 360}deg)`
                                        }}
                                    />
                                );
                                return acc;
                            }, [])}
                        </svg>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-2">
                        {allLanguages.map((lang, idx) => {
                            const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500'];
                            const colorClass = colors[idx] || 'bg-gray-500';
                            return (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                                        <div className="text-xs text-gray-400 uppercase">{lang.code}</div>
                                    </div>
                                    <div className="text-sm font-bold text-white">{lang.percentage}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
