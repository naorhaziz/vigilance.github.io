import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Country to coordinates mapping (for 2D projection)
const countryCoordinates = {
  'United States': { x: 18, y: 35 },
  'Canada': { x: 18, y: 25 },
  'UK': { x: 47, y: 32 },
  'United Kingdom': { x: 47, y: 32 },
  'France': { x: 48, y: 37 },
  'Germany': { x: 50, y: 35 },
  'Israel': { x: 56, y: 48 },
  'Middle East': { x: 58, y: 47 },
  'China': { x: 70, y: 40 },
  'India': { x: 65, y: 48 },
  'Asia': { x: 68, y: 43 },
  'Europe': { x: 50, y: 35 },
  'Palestine': { x: 56, y: 48 },
  'Gaza': { x: 56, y: 49 },
  'West Bank': { x: 57, y: 47 },
  'Russia': { x: 62, y: 28 },
  'Ukraine': { x: 54, y: 36 },
  'Japan': { x: 78, y: 42 },
  'South Korea': { x: 76, y: 44 },
  'Australia': { x: 77, y: 73 },
  'Brazil': { x: 32, y: 62 },
  'Mexico': { x: 16, y: 48 },
  'Egypt': { x: 54, y: 50 },
  'Saudi Arabia': { x: 59, y: 51 },
  'UAE': { x: 60, y: 52 },
  'Turkey': { x: 55, y: 43 },
  'Iran': { x: 61, y: 46 },
  'Pakistan': { x: 64, y: 47 },
  'Afghanistan': { x: 63, y: 45 },
  'Iraq': { x: 59, y: 47 },
  'Syria': { x: 57, y: 46 },
  'Lebanon': { x: 56, y: 46 },
  'Jordan': { x: 57, y: 48 },
};

export default function WorldMap({ threats = [] }) {
  const [hoveredThreat, setHoveredThreat] = useState(null);
  const canvasRef = useRef(null);

  // Calculate threat markers from geography data
  const getThreatMarkers = () => {
    const markers = [];
    const locationCounts = {};

    threats.forEach(threat => {
      const primary = threat.geography?.primary;

      if (primary && countryCoordinates[primary]) {
        const coords = countryCoordinates[primary];
        const key = `${coords.x},${coords.y}`;

        if (!locationCounts[key]) {
          locationCounts[key] = {
            coords,
            threats: [],
            severity: 'low',
            location: primary
          };
        }

        locationCounts[key].threats.push(threat);

        if (threat.severity === 'critical') {
          locationCounts[key].severity = 'critical';
        } else if (threat.severity === 'high' && locationCounts[key].severity !== 'critical') {
          locationCounts[key].severity = 'high';
        } else if (threat.severity === 'medium' && locationCounts[key].severity === 'low') {
          locationCounts[key].severity = 'medium';
        }
      }

      // Add secondary locations
      threat.geography?.secondary?.forEach(country => {
        if (countryCoordinates[country]) {
          const coords = countryCoordinates[country];
          const key = `${coords.x},${coords.y}-sec`;

          if (!locationCounts[key]) {
            locationCounts[key] = {
              coords,
              threats: [threat],
              severity: 'low',
              isSecondary: true,
              location: country
            };
          }
        }
      });
    });

    return Object.values(locationCounts);
  };

  const getMarkerColor = (severity) => {
    switch (severity) {
      case 'critical': return {
        primary: 'rgba(239, 68, 68, 0.9)',
        glow: 'rgba(239, 68, 68, 0.4)',
        ring: '#ef4444'
      };
      case 'high': return {
        primary: 'rgba(249, 115, 22, 0.9)',
        glow: 'rgba(249, 115, 22, 0.4)',
        ring: '#f97316'
      };
      case 'medium': return {
        primary: 'rgba(234, 179, 8, 0.9)',
        glow: 'rgba(234, 179, 8, 0.4)',
        ring: '#eab308'
      };
      default: return {
        primary: 'rgba(59, 130, 246, 0.9)',
        glow: 'rgba(59, 130, 246, 0.4)',
        ring: '#3b82f6'
      };
    }
  };

  const markers = getThreatMarkers();

  // Animated grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrame;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Animated grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;

      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        const offset = Math.sin(time + x * 0.01) * 5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        const offset = Math.cos(time + y * 0.01) * 5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Scan line effect
      const scanY = ((time * 50) % canvas.height);
      const gradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 50, canvas.width, 100);

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />

      {/* World Map SVG with Glow */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))',
          opacity: 0.25
        }}
      >
        <img
          src="/world-map.svg"
          alt="World Map"
          className="w-full h-full object-contain"
          style={{
            filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(196deg) brightness(101%) contrast(97%)'
          }}
        />
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {markers.map((marker, idx) => {
          if (idx === 0 || marker.isSecondary) return null;
          const prev = markers[idx - 1];
          if (!prev) return null;

          return (
            <motion.line
              key={idx}
              x1={prev.coords.x}
              y1={prev.coords.y}
              x2={marker.coords.x}
              y2={marker.coords.y}
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="0.1"
              strokeDasharray="1,1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 2, delay: idx * 0.1 }}
            />
          );
        })}
      </svg>

      {/* Threat Markers */}
      <div className="absolute inset-0">
        {markers.map((marker, idx) => {
          const colors = getMarkerColor(marker.severity);
          const size = marker.isSecondary ? 'w-3 h-3' : marker.threats.length > 2 ? 'w-8 h-8' : 'w-6 h-6';

          return (
            <motion.div
              key={idx}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onMouseEnter={() => setHoveredThreat(marker)}
              onMouseLeave={() => setHoveredThreat(null)}
              transition={{
                duration: 0.5,
                delay: idx * 0.1,
                type: "spring",
                stiffness: 200
              }}
              className="absolute cursor-pointer group"
              style={{
                left: `${marker.coords.x}%`,
                top: `${marker.coords.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Pulsing rings */}
              {!marker.isSecondary && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: colors.glow,
                      filter: 'blur(8px)'
                    }}
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{
                      borderColor: colors.ring,
                      boxShadow: `0 0 20px ${colors.glow}`
                    }}
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                </>
              )}

              {/* Main marker */}
              <div
                className={`${size} rounded-full relative z-10 transition-all duration-300 group-hover:scale-125`}
                style={{
                  backgroundColor: colors.primary,
                  boxShadow: `0 0 30px ${colors.glow}, 0 0 60px ${colors.glow}`,
                  border: `2px solid ${colors.ring}`
                }}
              >
                {!marker.isSecondary && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-[8px]">
                    {marker.threats.length}
                  </div>
                )}
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredThreat === marker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                  >
                    <div className="glass rounded-lg p-3 min-w-[200px] border border-white/20 backdrop-blur-xl"
                      style={{ boxShadow: `0 0 30px ${colors.glow}` }}>
                      <div className="text-xs font-bold mb-2 text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.ring }}></div>
                        {marker.location}
                      </div>
                      <div className="text-[10px] text-gray-300 mb-1">
                        {marker.threats.length} Active Threat{marker.threats.length > 1 ? 's' : ''}
                      </div>
                      <div className="space-y-1">
                        {marker.threats.slice(0, 3).map((threat, i) => (
                          <div key={i} className="text-[9px] text-gray-400 truncate">
                            • {threat.title}
                          </div>
                        ))}
                        {marker.threats.length > 3 && (
                          <div className="text-[9px] text-gray-500 italic">
                            +{marker.threats.length - 3} more...
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 glass border-l border-t border-white/20"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-blue-500/30"></div>
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-blue-500/30"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-500/30"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-blue-500/30"></div>
    </div>
  );
}
