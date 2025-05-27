import React from 'react';
import { Card, CardActionArea, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { ArrowForwardIos as ArrowIcon } from '@mui/icons-material';

const getScoreColor = (score) => {
  return score >= 90 ? '#0CCE6B' : '#FF4E42'; // green or red
};

const descriptions = {
  performance: 'Audits that have impact on the performance of your site',
  accessibility: 'Opportunities to improve the accessibility for your visitors',
  'best practices': 'Standards that your site should follow',
  seo: 'Checks that ensure your page follows basic search engine advices',
};

const CategoryCard = ({
  category,
  score,
  subtitle,
  onClick,
  expanded,
  darkMode,
}) => {
  const color = getScoreColor(score);
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        backgroundColor: darkMode ? '#183B4E' : '#F3F3E0',
        boxShadow: '0 1px 4px rgba(24,59,78,0.06)',
        mb: 2,
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(39,84,138,0.10)',
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ position: 'relative', width: 48, height: 48 }}>
            <CircularProgress
              variant="determinate"
              value={score}
              size={48}
              thickness={5}
              sx={{ color }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: darkMode ? '#F3F3E0' : '#183B4E',
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {score}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: darkMode ? '#F3F3E0' : '#183B4E', fontWeight: 700 }}>{label}</Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: darkMode ? '#DDA853' : '#27548A', mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton edge="end" size="small" sx={{ color: darkMode ? '#DDA853' : '#27548A' }}>
          <ArrowIcon />
        </IconButton>
      </CardActionArea>
    </Card>
  );
};

export default CategoryCard; 