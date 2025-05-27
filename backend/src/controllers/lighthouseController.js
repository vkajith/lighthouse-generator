import Report from '../models/Report.js';
import { runLighthouseAudit, generateRecommendations } from '../services/lighthouseService.js';
import { logger } from '../utils/logger.js';

export const healthCheck = (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
};

export const generateReport = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  try {
    logger.info('Starting report generation for URL:', url);
    const auditResults = await runLighthouseAudit(url);
    logger.info('Lighthouse audit completed, generating recommendations...');
    if (auditResults.fullReport && auditResults.fullReport.html) {
      logger.info('HTML report length:', auditResults.fullReport.html.length);
    } else {
      logger.warn('No HTML report generated!');
    }
    const recommendations = await generateRecommendations(
      auditResults.summary,
      {
        accessibility: auditResults.metrics.accessibility.issues,
        seo: auditResults.metrics.seo.issues,
        bestPractices: auditResults.metrics.bestPractices.issues
      }
    );
    logger.info('Recommendations generated successfully');
    const report = new Report({
      url,
      summary: auditResults.summary,
      metrics: auditResults.metrics,
      recommendations,
      fullReport: auditResults.fullReport
    });
    logger.info('Saving report to database...');
    await report.save();
    logger.info('Report saved successfully');
    res.json({ success: true, data: report });
  } catch (error) {
    logger.error('Error generating report:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate report',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    logger.error('Error retrieving report:', error);
    res.status(500).json({ error: 'Failed to retrieve report' });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({}, 'url timestamp summary');
    res.json(reports);
  } catch (error) {
    logger.error('Error retrieving all reports:', error);
    res.status(500).json({ error: 'Failed to retrieve reports' });
  }
};

export const downloadReportHtml = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report || !report.fullReport || !report.fullReport.html) {
      return res.status(404).json({ error: 'HTML report not found' });
    }
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="lighthouse-report-${report.id}.html"`);
    res.send(report.fullReport.html);
  } catch (error) {
    logger.error('Error downloading HTML report:', error);
    res.status(500).json({ error: 'Failed to download report' });
  }
};

export const downloadReportJson = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report || !report.fullReport || !report.fullReport.json) {
      return res.status(404).json({ error: 'JSON report not found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="lighthouse-report-${report.id}.json"`);
    res.send(JSON.stringify(report.fullReport.json, null, 2));
  } catch (error) {
    logger.error('Error downloading JSON report:', error);
    res.status(500).json({ error: 'Failed to download JSON report' });
  }
}; 