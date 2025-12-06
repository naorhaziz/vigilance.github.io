import { motion } from 'framer-motion';

export default function WorldMap({ threats = [] }) {
  // Calculate threat hotspots from geography data
  const getRegionThreats = () => {
    const regions = {
      'North America': { threats: 0, x: 20, y: 30, size: 0 },
      'Europe': { threats: 0, x: 50, y: 25, size: 0 },
      'Middle East': { threats: 0, x: 58, y: 40, size: 0 },
      'Asia': { threats: 0, x: 75, y: 35, size: 0 },
    };

    threats.forEach(threat => {
      const primary = threat.geography?.primary;

      if (primary?.includes('United States') || primary?.includes('Canada')) {
        regions['North America'].threats++;
      } else if (primary?.includes('UK') || primary?.includes('France') || primary?.includes('Germany') || primary?.includes('Europe')) {
        regions['Europe'].threats++;
      } else if (primary?.includes('Israel') || primary?.includes('Middle East')) {
        regions['Middle East'].threats++;
      } else if (primary?.includes('China') || primary?.includes('India') || primary?.includes('Asia')) {
        regions['Asia'].threats++;
      }

      threat.geography?.secondary?.forEach(country => {
        if (country.includes('UK') || country.includes('France') || country.includes('Germany')) {
          regions['Europe'].threats += 0.5;
        }
      });
    });

    // Calculate sizes based on threat count
    Object.keys(regions).forEach(key => {
      regions[key].size = Math.max(40, regions[key].threats * 15);
    });

    return regions;
  };

  const regions = getRegionThreats();

  const getColorIntensity = (count) => {
    if (count >= 3) return { bg: 'bg-red-500', glow: 'shadow-red-500' };
    if (count >= 2) return { bg: 'bg-orange-500', glow: 'shadow-orange-500' };
    if (count >= 1) return { bg: 'bg-yellow-500', glow: 'shadow-yellow-500' };
    return { bg: 'bg-blue-500', glow: 'shadow-blue-500' };
  };

  return (
    <div className="relative w-full h-full min-h-[300px] bg-gradient-to-br from-blue-950/40 to-purple-950/40 rounded-lg overflow-hidden">
      {/* Simplified World Map SVG Background */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        {/* Simplified continents */}
        <path d="M 100 150 Q 120 120, 200 130 L 250 140 Q 280 135, 300 150 L 320 180 Q 310 200, 280 210 L 200 200 Q 150 190, 120 180 Z" fill="#60a5fa" opacity="0.3" />
        <path d="M 350 100 Q 400 90, 450 100 L 500 120 Q 520 140, 500 170 L 480 200 Q 450 190, 400 180 L 350 160 Q 330 130, 350 100 Z" fill="#60a5fa" opacity="0.3" />
        <path d="M 450 200 Q 500 190, 550 200 L 600 220 Q 620 250, 600 280 L 550 290 Q 500 280, 470 260 L 450 230 Q 440 210, 450 200 Z" fill="#60a5fa" opacity="0.3" />
        <path d="M 550 150 Q 600 140, 650 150 L 700 170 Q 720 200, 700 230 L 650 240 Q 600 230, 570 210 L 550 180 Q 540 160, 550 150 Z" fill="#60a5fa" opacity="0.3" />
      </svg>

      {/* Threat Hotspots */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Object.entries(regions).map(([name, data]) => {
          const colors = getColorIntensity(data.threats);
          if (data.threats === 0) return null;

          return (
            <motion.div
              key={name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute"
              style={{
                left: `${data.x}%`,
                top: `${data.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Pulsing ring */}
              <div className="relative" style={{ width: data.size, height: data.size }}>
                <motion.div
                  className={`absolute inset-0 ${colors.bg} rounded-full opacity-20 ${colors.glow}`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ filter: 'blur(10px)' }}
                />

                {/* Main dot */}
                <div className={`absolute inset-0 ${colors.bg} rounded-full opacity-60 ${colors.glow}`} style={{ boxShadow: `0 0 20px var(--tw-shadow-color)` }} />

                {/* Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white font-bold text-xs bg-black/50 px-2 py-1 rounded-full whitespace-nowrap">
                    {Math.round(data.threats)}
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-gray-300 font-semibold whitespace-nowrap bg-black/50 px-2 py-1 rounded">
                {name}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />
    </div>
  );
}
