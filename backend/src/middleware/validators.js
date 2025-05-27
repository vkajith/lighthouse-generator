import { body, param } from 'express-validator';
import { validateRequest } from './validateRequest.js';

export const validateGenerateReport = [
  body('url')
    .isURL()
    .withMessage('Please provide a valid URL')
    .trim(),
  validateRequest
];

export const validateReportId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid report ID'),
  validateRequest
]; 