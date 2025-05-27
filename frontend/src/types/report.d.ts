// Type definitions for Lighthouse Report
export interface Report {
  _id: string;
  url: string;
  timestamp: string;
  summary: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: Metrics;
  fullReport: {
    json: any;
    html: string;
  };
  recommendations: string;
}

export interface Metrics {
  coreWebVitals: Record<string, any>;
  performance: Record<string, any>;
  accessibility: Record<string, any>;
  seo: Record<string, any>;
  bestPractices: Record<string, any>;
} 