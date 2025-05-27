import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
  ArrowBack as ArrowBackIcon,
  Code as CodeIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import MetricCard from './MetricCard';
import CategoryCard from './CategoryCard';
import { safeMarkdown, getImpactColor, getVitalsStatusColor } from '../utils/reportUtils';
import { VITALS_INFO, categoryOrder, summaryKeyMap } from '../constants/lighthouse';
import { downloadReport } from '../services/reportService';

const ReportDashboard = ({ report, darkMode, onBack }) => {
  const [expandedMetrics, setExpandedMetrics] = useState({});
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [downloadingHtml, setDownloadingHtml] = useState(false);
  const [downloadingJson, setDownloadingJson] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const toggleMetric = (metricId) => {
    setExpandedMetrics(prev => ({
      ...prev,
      [metricId]: !prev[metricId]
    }));
  };

  const handleCopyRecommendations = () => {
    setCopying(true);
    navigator.clipboard.writeText(report.recommendations).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setCopying(false);
      }, 2000);
    });
  };

  const handleDownload = async (format) => {
    try {
      const blob = await downloadReport(report.id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lighthouse-report-${report.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!report.metrics) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            backgroundColor: darkMode ? '#183B4E' : '#F3F3E0',
            color: '#183B4E',
            borderRadius: 2
          }}
        >
          Report data is incomplete. Please try generating the report again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4,
          backgroundColor: '#183B4E',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(24,59,78,0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #DDA853, #27548A)',
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={onBack}
              sx={{ 
                color: '#DDA853',
                '&:hover': {
                  backgroundColor: 'rgba(221,168,83,0.1)',
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                color: '#F3F3E0',
                fontWeight: 700
              }}
            >
              Lighthouse Report
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Download HTML Report">
              <span>
                <IconButton
                  onClick={() => handleDownload('html')}
                  sx={{
                    backgroundColor: '#DDA853',
                    color: '#183B4E',
                    '&:hover': {
                      backgroundColor: '#27548A',
                      color: '#F3F3E0',
                    },
                    mx: 1,
                  }}
                  disabled={downloadingHtml}
                >
                  {downloadingHtml ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <DownloadIcon />
                  )}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Download JSON Report">
              <span>
                <IconButton
                  onClick={() => handleDownload('json')}
                  sx={{
                    backgroundColor: '#27548A',
                    color: '#F3F3E0',
                    '&:hover': {
                      backgroundColor: '#DDA853',
                      color: '#183B4E',
                    },
                    mx: 1,
                  }}
                  disabled={downloadingJson}
                >
                  {downloadingJson ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <CodeIcon />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: '#F3F3E0',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {report.url}
        </Typography>
      </Paper>

      {/* Category Scores */}
      <Box sx={{ mb: 4 }}>
        {categoryOrder.map((category) => {
          let subtitle = '';
          if (category === 'performance') {
            const lcp = report.metrics.coreWebVitals?.lcp?.value;
            subtitle = lcp ? `Largest Contentful Paint: ${lcp}s` : '';
          } else if (category === 'accessibility') {
            const issues = report.metrics.accessibility?.issues?.length;
            subtitle = `Contrast issues found: ${issues ?? 0}`;
          } else if (category === 'best practices') {
            const https = report.metrics.bestPractices?.security?.https;
            subtitle = `HTTPS: ${https ? 'Enabled' : 'Not enabled'}`;
          } else if (category === 'seo') {
            const meta = report.metrics.seo?.metaTags?.present;
            subtitle = `Meta description: ${meta > 0 ? 'Present' : 'Missing'}`;
          }
          return (
            <Box key={category}>
              <CategoryCard
                category={category}
                score={report.summary[summaryKeyMap[category]]}
                subtitle={subtitle}
                onClick={() => toggleMetric(category)}
                expanded={!!expandedMetrics[category]}
                darkMode={true}
              />
              {expandedMetrics[category] && (
                <Box sx={{ pl: 7, pr: 2, pb: 2 }}>
                  {/* Render details for each category */}
                  {category === 'performance' && (
                    <>
                      <Typography variant="subtitle1" sx={{ color: '#27548A', fontWeight: 600, mb: 1 }}>Performance Metrics</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <MetricCard
                            title="Speed Index"
                            score={report.metrics.performance.speedIndex.score}
                            value={report.metrics.performance.speedIndex.value}
                            unit={report.metrics.performance.speedIndex.unit}
                            darkMode={true}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <MetricCard
                            title="Total Blocking Time"
                            score={report.metrics.performance.totalBlockingTime.score}
                            value={report.metrics.performance.totalBlockingTime.value}
                            unit={report.metrics.performance.totalBlockingTime.unit}
                            darkMode={true}
                          />
                        </Grid>
                      </Grid>
                      <Typography variant="subtitle2" sx={{ mt: 2, color: '#27548A', fontWeight: 500 }}>Resource Summary</Typography>
                      <Grid container spacing={2}>
                        {Object.entries(report.metrics.performance.resources).map(([type, count]) => (
                          <Grid item xs={6} sm={4} md={2} key={type}>
                            <Paper 
                              sx={{ 
                                p: 2, 
                                textAlign: 'center',
                                backgroundColor: '#F3F3E0',
                                borderRadius: 2,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            >
                              <Typography 
                                variant="h6"
                                sx={{ 
                                  color: '#27548A',
                                  fontWeight: 700
                                }}
                              >
                                {count}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#27548A',
                                  fontWeight: 500
                                }}
                              >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                  {category === 'accessibility' && (
                    <>
                      <Typography variant="subtitle1" sx={{ color: '#27548A', fontWeight: 600, mb: 1 }}>Accessibility Issues</Typography>
                      <List>
                        {report.metrics.accessibility.issues.map((issue) => (
                          <ListItem 
                            key={issue.id}
                            sx={{
                              backgroundColor: '#F3F3E0',
                              borderRadius: 1,
                              mb: 1,
                              '&:hover': {
                                backgroundColor: '#DDA853',
                              }
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography sx={{ color: '#333446', fontWeight: 500 }}>
                                  {issue.title}
                                </Typography>
                              }
                              secondary={
                                <Typography sx={{ color: '#7F8CAA' }}>
                                  {issue.elements} elements affected
                                </Typography>
                              }
                            />
                            <Chip
                              label={issue.impact}
                              sx={{ 
                                backgroundColor: getImpactColor(issue.impact, true),
                                color: '#333446',
                                fontWeight: 600
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                  {category === 'best practices' && (
                    <>
                      <Typography variant="subtitle1" sx={{ color: '#7F8CAA', fontWeight: 600, mb: 1 }}>Best Practices</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Paper 
                            sx={{ 
                              p: 2,
                              backgroundColor: '#EAEFEF',
                              borderRadius: 2,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          >
                            <Typography 
                              variant="h6" 
                              gutterBottom
                              sx={{ 
                                color: '#333446',
                                fontWeight: 600
                              }}
                            >
                              Security
                            </Typography>
                            <List>
                              <ListItem>
                                <ListItemText
                                  primary={
                                    <Typography sx={{ color: '#333446', fontWeight: 500 }}>
                                      HTTPS
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography sx={{ color: '#7F8CAA' }}>
                                      {report.metrics.bestPractices.security.https ? 'Enabled' : 'Not enabled'}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary={
                                    <Typography sx={{ color: '#333446', fontWeight: 500 }}>
                                      Security Headers
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography sx={{ color: '#7F8CAA' }}>
                                      {`${report.metrics.bestPractices.security.securityHeaders.present} present, ${report.metrics.bestPractices.security.securityHeaders.missing} missing`}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            </List>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Paper 
                            sx={{ 
                              p: 2,
                              backgroundColor: '#EAEFEF',
                              borderRadius: 2,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          >
                            <Typography 
                              variant="h6" 
                              gutterBottom
                              sx={{ 
                                color: '#333446',
                                fontWeight: 600
                              }}
                            >
                              Console & APIs
                            </Typography>
                            <List>
                              <ListItem>
                                <ListItemText
                                  primary={
                                    <Typography sx={{ color: '#333446', fontWeight: 500 }}>
                                      Console Errors
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography sx={{ color: '#7F8CAA' }}>
                                      {`${report.metrics.bestPractices.consoleErrors} found`}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary={
                                    <Typography sx={{ color: '#333446', fontWeight: 500 }}>
                                      Deprecated APIs
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography sx={{ color: '#7F8CAA' }}>
                                      {`${report.metrics.bestPractices.deprecatedApis} found`}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            </List>
                          </Paper>
                        </Grid>
                      </Grid>
                      <Typography variant="subtitle2" sx={{ mt: 2, color: '#7F8CAA', fontWeight: 500 }}>Issues</Typography>
                      <List>
                        {report.metrics.bestPractices.issues.map((issue) => (
                          <ListItem 
                            key={issue.id}
                            sx={{
                              backgroundColor: '#EAEFEF',
                              borderRadius: 1,
                              mb: 1,
                              '&:hover': {
                                backgroundColor: '#B8CFCE',
                              }
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography sx={{ color: '#333446', fontWeight: 500 }}>
                                  {issue.title}
                                </Typography>
                              }
                            />
                            <Chip
                              label={issue.impact}
                              sx={{ 
                                backgroundColor: getImpactColor(issue.impact, true),
                                color: '#333446',
                                fontWeight: 600
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                  {category === 'seo' && (
                    <>
                      <Typography variant="subtitle1" sx={{ color: '#7F8CAA', fontWeight: 600, mb: 1 }}>SEO Analysis</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Paper 
                            sx={{ 
                              p: 2,
                              backgroundColor: '#EAEFEF',
                              borderRadius: 2,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          >
                            <Typography 
                              variant="h6" 
                              gutterBottom
                              sx={{ 
                                color: '#333446',
                                fontWeight: 600
                              }}
                            >
                              Meta Tags
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography sx={{ color: '#7F8CAA' }}>
                                Present: {report.metrics.seo.metaTags.present}
                              </Typography>
                              <Typography sx={{ color: '#7F8CAA' }}>
                                Missing: {report.metrics.seo.metaTags.missing}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Paper 
                            sx={{ 
                              p: 2,
                              backgroundColor: '#EAEFEF',
                              borderRadius: 2,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          >
                            <Typography 
                              variant="h6" 
                              gutterBottom
                              sx={{ 
                                color: '#333446',
                                fontWeight: 600
                              }}
                            >
                              Structured Data
                            </Typography>
                            <Typography sx={{ color: '#7F8CAA' }}>
                              {report.metrics.seo.structuredData.present ? 
                                `Present (${report.metrics.seo.structuredData.type})` : 
                                'Not found'}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                      <Typography variant="subtitle2" sx={{ mt: 2, color: '#7F8CAA', fontWeight: 500 }}>Issues</Typography>
                      <List>
                        {report.metrics.seo.issues.map((issue) => (
                          <ListItem 
                            key={issue.id}
                            sx={{
                              backgroundColor: '#EAEFEF',
                              borderRadius: 1,
                              mb: 1,
                              '&:hover': {
                                backgroundColor: '#B8CFCE',
                              }
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography sx={{ color: '#333446', fontWeight: 500 }}>
                                  {issue.title}
                                </Typography>
                              }
                            />
                            <Chip
                              label={issue.impact}
                              sx={{ 
                                backgroundColor: getImpactColor(issue.impact, true),
                                color: '#333446',
                                fontWeight: 600
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Core Web Vitals */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4,
          backgroundColor: '#F3F3E0',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(24,59,78,0.1)'
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            color: '#27548A',
            fontWeight: 600,
            mb: 3
          }}
        >
          Core Web Vitals
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(report.metrics.coreWebVitals).map(([metric, data]) => {
            const info = VITALS_INFO[metric] || {};
            const color = getVitalsStatusColor(metric, data.value);
            return (
              <Grid item xs={12} sm={6} md={4} key={metric}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(24,59,78,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: '#fff',
                    minHeight: 170,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" sx={{ color: color, fontWeight: 700, fontSize: 22 }}>{info.label || metric.toUpperCase()}</Typography>
                    <Tooltip title={info.description || ''} placement="top">
                      <InfoOutlinedIcon fontSize="small" sx={{ color: '#7F8CAA' }} />
                    </Tooltip>
                  </Box>
                  <Typography variant="subtitle2" sx={{ color: '#183B4E', fontWeight: 600, mb: 1 }}>
                    {info.full || metric.toUpperCase()}
                  </Typography>
                  <Typography variant="h4" sx={{ color, fontWeight: 700, mb: 0.5 }}>
                    {data.value} {data.unit}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7F8CAA', fontWeight: 500 }}>
                    Score: {data.score}/100
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Recommendations */}
      <Paper 
        sx={{ 
          p: 0,
          backgroundColor: '#F3F3E0',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(24,59,78,0.1)'
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, #27548A 60%, #DDA853 100%)',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          px: 3,
          py: 2,
          mb: 0
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#fff',
              fontWeight: 700,
              mb: 0
            }}
          >
            AI Insights
          </Typography>
          <Tooltip title={copied ? "Copied!" : "Copy Insights"}>
            <span>
              <IconButton
                onClick={handleCopyRecommendations}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#DDA853',
                    color: '#183B4E',
                  },
                  ml: 1,
                }}
                disabled={copying}
              >
                {copying ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <CopyIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        {/* AI Insights Content */}
        <Box sx={{ p: 3 }}>
          {(() => {
            // Split recommendations into summary and categories by blank lines
            const rec = safeMarkdown(report.recommendations);
            const sections = rec.split(/\n\s*\n/);
            const summary = sections[0];
            const categories = sections.slice(1);
            return (
              <>
                {categories.map((cat, idx) => {
                  // Try to extract the category name (first line)
                  const lines = cat.trim().split('\n');
                  const header = lines[0];
                  const body = lines.slice(1).join('\n');
                  return (
                    <Box key={idx} sx={{
                      background: '#F3F3E0',
                      borderRadius: 2,
                      boxShadow: '0 1px 4px rgba(24,59,78,0.04)',
                      p: 2,
                      mb: 2,
                    }}>
                      <Typography variant="subtitle1" sx={{ color: '#183B4E', fontWeight: 700, mb: 1 }}>
                        {header}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#333446', fontSize: 16, whiteSpace: 'pre-line' }}>
                        {body}
                      </Typography>
                    </Box>
                  );
                })}
              </>
            );
          })()}
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            backgroundColor: snackbar.severity === 'success' ? '#DDA853' : '#d32f2f',
            color: snackbar.severity === 'success' ? '#183B4E' : '#fff',
            fontWeight: 600,
            fontSize: 16,
          }
        }}
      />
    </Container>
  );
};

export default ReportDashboard; 