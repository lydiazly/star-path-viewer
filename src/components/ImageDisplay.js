// src/components/ImageDisplay.js
import React from 'react';

const ImageDisplay = ({ svgData }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: svgData }} />
  );
};

export default ImageDisplay;
