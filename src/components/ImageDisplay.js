// ImageDisplay.js
import React from 'react';

const ImageDisplay = ({ svgData }) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: svgData }} />
    </div>
  );
};

export default ImageDisplay;
