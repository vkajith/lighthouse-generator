import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const getScoreColor = (score, darkMode) => {
  if (score >= 90) return darkMode ? '#0cce6b' : '#B8CFCE';
  if (score >= 50) return darkMode ? '#ffa400' : '#7F8CAA';
  return darkMode ? '#ff4e42' : '#333446';
};

const MetricCard = ({
  title,
  score,
  value,
  unit,
  details,
  tooltip,
  expanded,
  onExpand,
  darkMode,
}) => {
  const color = getScoreColor(score, darkMode);

  return (
    <Card 
      sx={{ 
        mb: 2,
        backgroundColor: darkMode ? '#16213e' : '#EAEFEF',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              color: darkMode ? '#EAEFEF' : '#333446',
              fontWeight: 600
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {tooltip && (
              <Tooltip title={tooltip}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: darkMode ? '#B8CFCE' : '#7F8CAA',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(184, 207, 206, 0.1)' : 'rgba(127, 140, 170, 0.1)',
                    }
                  }}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            )}
            <IconButton 
              onClick={onExpand} 
              size="small"
              sx={{ 
                color: darkMode ? '#B8CFCE' : '#7F8CAA',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(184, 207, 206, 0.1)' : 'rgba(127, 140, 170, 0.1)',
                }
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              color,
              mr: 1,
              fontWeight: 700
            }}
          >
            {value}
          </Typography>
          {unit && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#B8CFCE' : '#7F8CAA',
                fontWeight: 500
              }}
            >
              {unit}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={score}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: darkMode ? '#1a1a2e' : '#EAEFEF',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                  borderRadius: 4,
                },
              }}
            />
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: darkMode ? '#B8CFCE' : '#7F8CAA',
              fontWeight: 600,
              minWidth: 35
            }}
          >
            {score}
          </Typography>
        </Box>

        {expanded && details && (
          <Box 
            sx={{ 
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${darkMode ? '#1a1a2e' : '#B8CFCE'}`
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#EAEFEF' : '#333446',
                lineHeight: 1.6
              }}
            >
              {details}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard; 