import { OpenAI } from 'openai';
import { logger } from '../utils/logger.js';
import { createLighthousePrompt, OPENAI_CONFIG } from '../utils/promptUtils.js';
import { LighthouseError } from '../utils/errors.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runLighthouseAudit(url) {
  try {
    logger.info('Starting PageSpeed Insights audit for URL:', url);
    
    const apiKey = process.env.PAGESPEED_API_KEY;
    if (!apiKey) {
      throw new LighthouseError('PageSpeed API key is required');
    }

    // Build URL with multiple category parameters
    const baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    const params = new URLSearchParams({
      url,
      key: apiKey,
      strategy: 'mobile'
    });

    // Add each category separately
    ['performance', 'accessibility', 'best-practices', 'seo'].forEach(category => {
      params.append('category', category);
    });

    const response = await fetch(`${baseUrl}?${params}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new LighthouseError(`PageSpeed API request failed: ${response.statusText}. Details: ${errorText}`);
    }

    const results = await response.json();
    logger.info('PageSpeed Insights audit completed successfully');

    const { categories, audits } = results.lighthouseResult;
    
    // Extract summary scores
    const summary = {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
    };

    // Extract Core Web Vitals
    const coreWebVitals = {
      lcp: {
        value: Number((audits['largest-contentful-paint'].numericValue / 1000).toFixed(2)),
        score: Math.round(audits['largest-contentful-paint'].score * 100),
        unit: 's'
      },
      fid: {
        value: Number(audits['max-potential-fid'].numericValue.toFixed(2)),
        score: Math.round(audits['max-potential-fid'].score * 100),
        unit: 'ms'
      },
      cls: {
        value: Number(audits['cumulative-layout-shift'].numericValue.toFixed(2)),
        score: Math.round(audits['cumulative-layout-shift'].score * 100),
        unit: ''
      },
      fcp: {
        value: Number((audits['first-contentful-paint'].numericValue / 1000).toFixed(2)),
        score: Math.round(audits['first-contentful-paint'].score * 100),
        unit: 's'
      },
      tti: {
        value: Number((audits['interactive'].numericValue / 1000).toFixed(2)),
        score: Math.round(audits['interactive'].score * 100),
        unit: 's'
      }
    };

    // Extract Performance Metrics
    const performance = {
      speedIndex: {
        value: Number((audits['speed-index'].numericValue / 1000).toFixed(2)),
        score: Math.round(audits['speed-index'].score * 100),
        unit: 's'
      },
      totalBlockingTime: {
        value: Number(audits['total-blocking-time'].numericValue.toFixed(2)),
        score: Math.round(audits['total-blocking-time'].score * 100),
        unit: 'ms'
      },
      resources: {
        total: audits['resource-summary'].details?.items?.length || 0,
        javascript: audits['resource-summary'].details?.items?.filter(item => item.resourceType === 'script').length || 0,
        css: audits['resource-summary'].details?.items?.filter(item => item.resourceType === 'stylesheet').length || 0,
        images: audits['resource-summary'].details?.items?.filter(item => item.resourceType === 'image').length || 0,
        fonts: audits['resource-summary'].details?.items?.filter(item => item.resourceType === 'font').length || 0,
        other: audits['resource-summary'].details?.items?.filter(item => 
          !['script', 'stylesheet', 'image', 'font'].includes(item.resourceType)
        ).length || 0
      }
    };

    // Extract Accessibility Issues
    const accessibility = {
      issues: Object.entries(audits)
        .filter(([id, audit]) => id.startsWith('accessibility-') && audit.score !== null && audit.score < 1)
        .map(([id, audit]) => ({
          id,
          title: audit.title,
          impact: audit.score < 0.5 ? 'serious' : audit.score < 0.9 ? 'moderate' : 'minor',
          elements: audit.details?.items?.length || 0
        }))
    };

    // Extract SEO Analysis
    const seo = {
      metaTags: {
        present: Object.entries(audits)
          .filter(([id, audit]) => id.startsWith('meta-') && audit.score === 1)
          .length,
        missing: Object.entries(audits)
          .filter(([id, audit]) => id.startsWith('meta-') && audit.score === 0)
          .length
      },
      structuredData: {
        present: audits['structured-data'].score === 1,
        type: audits['structured-data'].details?.items?.[0]?.type || 'None'
      },
      mobileFriendly: audits['viewport'].score === 1,
      issues: Object.entries(audits)
        .filter(([id, audit]) => id.startsWith('seo-') && audit.score !== null && audit.score < 1)
        .map(([id, audit]) => ({
          id,
          title: audit.title,
          impact: audit.score < 0.5 ? 'serious' : audit.score < 0.9 ? 'moderate' : 'minor'
        }))
    };

    // Extract Best Practices
    const bestPractices = {
      security: {
        https: audits['is-on-https'].score === 1,
        securityHeaders: {
          present: Object.entries(audits)
            .filter(([id, audit]) => id.startsWith('security-headers-') && audit.score === 1)
            .length,
          missing: Object.entries(audits)
            .filter(([id, audit]) => id.startsWith('security-headers-') && audit.score === 0)
            .length
        }
      },
      consoleErrors: audits['errors-in-console'].details?.items?.length || 0,
      deprecatedApis: audits['deprecations'].details?.items?.length || 0,
      issues: Object.entries(audits)
        .filter(([id, audit]) => id.startsWith('best-practices-') && audit.score !== null && audit.score < 1)
        .map(([id, audit]) => ({
          id,
          title: audit.title,
          impact: audit.score < 0.5 ? 'serious' : audit.score < 0.9 ? 'moderate' : 'minor'
        }))
    };

    return {
      summary,
      metrics: {
        coreWebVitals,
        performance,
        accessibility,
        seo,
        bestPractices
      },
      fullReport: {
        json: results.lighthouseResult,
        html: results.lighthouseResult.fullReport
      }
    };
  } catch (error) {
    logger.error('Error during PageSpeed Insights audit:', error);
    throw new LighthouseError(`Failed to run PageSpeed Insights audit: ${error.message}`);
  }
}

async function generateRecommendations(summary, issues) {
  try {
    const prompt = createLighthousePrompt(summary, issues);
    logger.info('OpenAI prompt:', prompt);

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      ...OPENAI_CONFIG
    });

    logger.info('OpenAI API response:', JSON.stringify(completion, null, 2));

    return completion.choices[0].message.content;
  } catch (error) {
    logger.error('Error generating AI recommendations:', error);
    throw new LighthouseError('Failed to generate AI recommendations');
  }
}

export {
  runLighthouseAudit,
  generateRecommendations,
}; 