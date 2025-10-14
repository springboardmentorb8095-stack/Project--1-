import React from 'react';
import { Typography, Box } from '@mui/material';

const Header = ({ title, subtitle }) => {
  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="h6" color="textSecondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default Header;
