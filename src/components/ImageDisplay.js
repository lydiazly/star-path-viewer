// src/components/ImageDisplay.js
import React from 'react';
import { Box } from '@mui/material';

const ImageDisplay = ({ svgData }) => {
  return (
    <Box
      id="svg-container"
      sx={{
        width: '100%',
        '& svg': {
          width: '100%',
          height: 'auto'
        }
      }}
      dangerouslySetInnerHTML={{ __html: svgData }}
    />
  );
};

export default ImageDisplay;
