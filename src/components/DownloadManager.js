// src/components/DownloadManager.js
import React from 'react';
import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

const DownloadManager = ({ svgData }) => {
  const handleDownload = async (format) => {
    const svgElement = document.getElementById('svg-container').querySelector('svg');
    if (!svgElement) return;

    const filename = 'star_trail';

    if (format === 'svg') {
      // Define XML and DOCTYPE headers
      const xmlHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
      // Concatenate headers with sanitized SVG data
      const svgWithHeaders = xmlHeader + svgData;

      const blob = new Blob([svgWithHeaders], { type: 'image/svg+xml' });
      saveAs(blob, `${filename}.svg`);

    } else if (format === 'png') {
      const canvas = await toCanvas(svgElement, { pixelRatio: 2 });
      canvas.toBlob((blob) => {
        saveAs(blob, `${filename}.png`);
      });

    } else if (format === 'pdf') {
      const width = svgElement.width.baseVal.value;
      const height = svgElement.height.baseVal.value;

      const pdfDoc = new jsPDF({
        unit: 'pt',
        format: [width, height]
      });

      pdfDoc
        .svg(svgElement, {
          x: 0,
          y: 0,
          width: width,
          height: height
        })
        .then(() => {
          pdfDoc.save(`${filename}.pdf`)
        })
    }
  };

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

export default DownloadManager;
