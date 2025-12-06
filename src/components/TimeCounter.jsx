import { useEffect, useState } from 'react';
import { formatTimeRemaining } from '../lib/utils';

export default function TimeCounter({ hours }) {
  const [timeLeft, setTimeLeft] = useState(hours);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - (1 / 3600)));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { hours: h, minutes: m } = formatTimeRemaining(timeLeft);
  const seconds = Math.floor((timeLeft * 3600) % 60);

  const isUrgent = timeLeft < 2;
  const isCritical = timeLeft < 1;

  return (
    <div className={`text-sm font-mono font-bold ${isCritical ? 'text-red-500 animate-pulse' : isUrgent ? 'text-orange-500' : 'text-white'}`}>
      {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
