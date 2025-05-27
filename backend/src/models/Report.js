import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  summary: {
    performance: { type: Number, required: true },
    accessibility: { type: Number, required: true },
    bestPractices: { type: Number, required: true },
    seo: { type: Number, required: true },
  },
  metrics: {
    coreWebVitals: {
      lcp: { value: { type: Number }, score: { type: Number }, unit: { type: String } },
      fid: { value: { type: Number }, score: { type: Number }, unit: { type: String } },
      cls: { value: { type: Number }, score: { type: Number }, unit: { type: String } },
      fcp: { value: { type: Number }, score: { type: Number }, unit: { type: String } },
      tti: { value: { type: Number }, score: { type: Number }, unit: { type: String } }
    },
    performance: {
      speedIndex: { value: { type: Number }, score: { type: Number }, unit: { type: String } },
      totalBlockingTime: { value: { type: Number }, score: { type: Number }, unit: { type: String } },
      resources: {
        total: { type: Number },
        javascript: { type: Number },
        css: { type: Number },
        images: { type: Number },
        fonts: { type: Number },
        other: { type: Number }
      }
    },
    accessibility: {
      issues: [{
        id: { type: String },
        title: { type: String },
        impact: { type: String },
        elements: { type: Number }
      }]
    },
    seo: {
      metaTags: {
        present: { type: Number },
        missing: { type: Number }
      },
      structuredData: {
        present: { type: Boolean },
        type: { type: String }
      },
      mobileFriendly: { type: Boolean },
      issues: [{
        id: { type: String },
        title: { type: String },
        impact: { type: String }
      }]
    },
    bestPractices: {
      security: {
        https: { type: Boolean },
        securityHeaders: {
          present: { type: Number },
          missing: { type: Number }
        }
      },
      consoleErrors: { type: Number },
      deprecatedApis: { type: Number },
      issues: [{
        id: { type: String },
        title: { type: String },
        impact: { type: String }
      }]
    }
  },
  fullReport: {
    json: { type: Object },
    html: { type: String }
  },
  recommendations: {
    type: String,
    default: ''
  }
}, { strict: true });

export default mongoose.model('Report', reportSchema); 