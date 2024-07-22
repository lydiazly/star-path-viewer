// src/components/ImageDisplay.js
import React from 'react';
import { Box } from '@mui/material';

const ImageDisplay = ({ svgData }) => {
  return (
    <Box id="svg-container" dangerouslySetInnerHTML={{ __html: svgData }} />
  );
};

export default ImageDisplay;
