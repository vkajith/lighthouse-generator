import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Alert,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import ReportDashboard from './components/ReportDashboard';
import { healthCheck, generateReport } from './services/reportService';

// Lighthouse SVG icon
const LighthouseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#DDA853"/>
    <rect x="13.5" y="10" width="5" height="12" rx="2.5" fill="#183B4E"/>
    <rect x="14.5" y="7" width="3" height="4" rx="1.5" fill="#27548A"/>
    <rect x="15.25" y="22" width="1.5" height="3" rx="0.75" fill="#27548A"/>
    <ellipse cx="16" cy="10" rx="4" ry="1.5" fill="#F3F3E0"/>
  </svg>
);

const App = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  const handleGenerateReport = async (targetUrl) => {
    setLoading(true);
    setError(null);

    try {
      const data = await generateReport(targetUrl);
      setReport(data.data);
    } catch (err) {
      setError(err.message || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleGenerateReport(url);
  };

  const handleBack = () => {
    setReport(null);
    setError(null);
    setUrl('');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#F3F3E0',
      transition: 'background-color 0.3s ease'
    }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#183B4E',
          boxShadow: '0 2px 10px rgba(24,59,78,0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <LighthouseIcon />
          </Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: '#DDA853',
              fontWeight: 700,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Lighthouse Report Generator
          </Typography>
          <IconButton 
            color="inherit"
            onClick={() => window.open('https://github.com/yourusername/lighthouse-generator', '_blank')}
            sx={{ 
              color: '#DDA853',
              '&:hover': {
                backgroundColor: alpha('#DDA853', 0.1)
              }
            }}
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* Spacer for fixed AppBar */}

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {!report && (
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              mb: 4,
              backgroundColor: '#F3F3E0',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(24,59,78,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3
              }}
            >
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  color: '#183B4E',
                  fontWeight: 700,
                  textAlign: 'center',
                  mb: 2
                }}
              >
                Generate Lighthouse Report
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#27548A',
                  textAlign: 'center',
                  maxWidth: '600px',
                  mb: 2
                }}
              >
                Enter a URL to analyze its performance, accessibility, SEO, and best practices using Google Lighthouse.
              </Typography>

              <Box 
                sx={{ 
                  display: 'flex',
                  gap: 2,
                  width: '100%',
                  maxWidth: '600px'
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter website URL or domain (e.g., example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F3F3E0',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: '#DDA853',
                      },
                      '&:hover fieldset': {
                        borderColor: '#27548A',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#183B4E',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#183B4E',
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !url}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                  sx={{
                    backgroundColor: '#DDA853',
                    color: '#183B4E',
                    px: 4,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#27548A',
                      color: '#F3F3E0',
                    },
                    '&:disabled': {
                      backgroundColor: '#F3F3E0',
                      color: '#DDA853',
                    },
                  }}
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </Box>

              {error && (
                <Alert 
                  severity="error"
                  sx={{ 
                    width: '100%',
                    maxWidth: '600px',
                    backgroundColor: '#F3F3E0',
                    color: '#183B4E',
                    '& .MuiAlert-icon': {
                      color: '#183B4E',
                    },
                    mt: 2
                  }}
                >
                  {error}
                </Alert>
              )}
            </Box>
          </Paper>
        )}

        {report && (
          <Box sx={{ 
            backgroundColor: '#F3F3E0',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(24,59,78,0.1)',
            transition: 'all 0.3s ease'
          }}>
            <ReportDashboard 
              report={report} 
              darkMode={true} 
              onBack={handleBack}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default App;
