// Utility functions for Lighthouse report rendering

export const safeMarkdown = (value) => {
  if (typeof value === 'string') return value;
  if (value == null) return 'No recommendations available.';
  if (Array.isArray(value)) {
    return value.map(safeMarkdown).join('\n');
  }
  if (typeof value === 'object') {
    if (value.message && typeof value.message === 'string') return value.message;
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

export const getImpactColor = (impact, darkMode) => {
  switch (impact) {
    case 'serious': return darkMode ? '#ff4e42' : '#333446';
    case 'moderate': return darkMode ? '#ffa400' : '#7F8CAA';
    case 'minor': return darkMode ? '#0cce6b' : '#B8CFCE';
    default: return darkMode ? '#1a73e8' : '#EAEFEF';
  }
};

export const getVitalsStatusColor = (key, value) => {
  if (key === 'lcp') return value <= 2.5 ? '#0CCE6B' : '#FF4E42';
  if (key === 'fid') return value <= 100 ? '#0CCE6B' : '#FF4E42';
  if (key === 'cls') return value <= 0.1 ? '#0CCE6B' : '#FF4E42';
  if (key === 'fcp') return value <= 1.8 ? '#0CCE6B' : '#FF4E42';
  if (key === 'tti') return value <= 3.8 ? '#0CCE6B' : '#FF4E42';
  return '#B8CFCE';
}; 