export function formatTimeRemaining(hours) {
  const totalMinutes = Math.floor(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return { hours: h, minutes: m };
}

export function formatNumber(num) {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}

export function getSeverityColor(severity) {
  const colors = {
    critical: 'red',
    high: 'orange',
    medium: 'blue',
    low: 'green'
  };
  return colors[severity] || 'gray';
}

export function getViralityColor(progress) {
  if (progress >= 60) return 'red';
  if (progress >= 40) return 'orange';
  return 'blue';
}
