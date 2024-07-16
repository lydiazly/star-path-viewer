// DownloadOptions.js
import React from 'react';
import Button from '@mui/material/Button';

const DownloadOptions = ({ svgData, handleDownload }) => {
  const handleDownloadSVG = () => handleDownload('svg');
  const handleDownloadPNG = () => handleDownload('png');
  const handleDownloadPDF = () => handleDownload('pdf');

  return (
    <div>
      <Button variant="contained" onClick={handleDownloadSVG}>
        Download SVG
      </Button>
      <Button variant="contained" onClick={handleDownloadPNG}>
        Download PNG
      </Button>
      <Button variant="contained" onClick={handleDownloadPDF}>
        Download PDF
      </Button>
    </div>
  );
};

export default DownloadOptions;
