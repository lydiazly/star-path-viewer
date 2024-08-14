// src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ pt: 2, pb: 1, px: 2, textAlign: 'center', width: '100%' }}
    >
      <Typography variant="body2" color="rgba(0, 0, 0, 0.55)">
        &copy; {new Date().getFullYear()} Star Trail Viewer. All rights reserved.
      </Typography>
    </Box>
  );
};

export default React.memo(Footer);
