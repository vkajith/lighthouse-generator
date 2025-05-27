// Lighthouse UI constants
export const CATEGORY_DESCRIPTIONS = {
  performance: 'Audits that have impact on the performance of your site',
  accessibility: 'Opportunities to improve the accessibility for your visitors',
  'best practices': 'Standards that your site should follow',
  seo: 'Checks that ensure your page follows basic search engine advices',
};

export const COLOR_THEME = {
  gold: '#DDA853',
  darkBlue: '#183B4E',
  blue: '#27548A',
  cream: '#F3F3E0',
};

// Lighthouse constants

export const VITALS_INFO = {
  lcp: {
    label: 'LCP',
    full: 'Largest Contentful Paint',
    description: 'Measures loading performance. Good: ≤2.5s',
  },
  fid: {
    label: 'FID',
    full: 'First Input Delay',
    description: 'Measures interactivity. Good: ≤100ms',
  },
  cls: {
    label: 'CLS',
    full: 'Cumulative Layout Shift',
    description: 'Measures visual stability. Good: ≤0.1',
  },
  fcp: {
    label: 'FCP',
    full: 'First Contentful Paint',
    description: 'Measures time to first content. Good: ≤1.8s',
  },
  tti: {
    label: 'TTI',
    full: 'Time to Interactive',
    description: 'Measures time to interactive. Good: ≤3.8s',
  },
};

export const categoryOrder = ['performance', 'accessibility', 'best practices', 'seo'];

export const summaryKeyMap = {
  performance: 'performance',
  accessibility: 'accessibility',
  'best practices': 'bestPractices',
  seo: 'seo',
}; 