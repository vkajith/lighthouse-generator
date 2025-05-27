/**
 * Server configuration constants
 */
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
};

/**
 * Lighthouse configuration constants
 */
export const LIGHTHOUSE_CONFIG = {
  CHROME_FLAGS: ['--headless', '--no-sandbox', '--disable-gpu'],
  CATEGORIES: ['performance', 'accessibility', 'best-practices', 'seo'],
  OUTPUT_FORMATS: ['json', 'html']
};

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100
}; 