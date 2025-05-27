import { body, param } from 'express-validator';
import { validateRequest } from './validateRequest.js';

const normalizeUrl = (url) => {
  if (!url) return url;
  // Remove any whitespace
  url = url.trim();
  // Add https:// if no protocol is specified
  if (!url.match(/^https?:\/\//i)) {
    url = 'https://' + url;
  }
  return url;
};

export const validateGenerateReport = [
  body('url')
    .custom((value) => {
      const normalizedUrl = normalizeUrl(value);
      // Basic URL validation regex that allows domains without protocol
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlRegex.test(normalizedUrl)) {
        throw new Error('Please provide a valid URL or domain name');
      }
      return true;
    })
    .customSanitizer(normalizeUrl),
  validateRequest
];

export const validateReportId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid report ID'),
  validateRequest
]; 