import express from 'express';
import * as lighthouseController from '../controllers/lighthouseController.js';
import { validateGenerateReport } from '../middleware/validators.js';

const router = express.Router();

// Health check endpoint
router.get('/health', lighthouseController.healthCheck);

// Generate new report
router.post('/generate', validateGenerateReport, lighthouseController.generateReport);

// Get report by ID
router.get('/reports/:id', lighthouseController.getReportById);

// Get all reports
router.get('/reports', lighthouseController.getAllReports);

// Download report HTML by ID
router.get('/reports/:id/download', lighthouseController.downloadReportHtml);

// Download report JSON by ID
router.get('/reports/:id/download-json', lighthouseController.downloadReportJson);

export default router; 