// src/components/DownloadManager.js
import React from 'react';
import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import { Canvg } from 'canvg';
import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

const DownloadManager = ({ svgData, filenameBase = 'star_trail', dpi = 300 }) => {
  const handleDownload = async (format) => {
    const svgElement = document.getElementById('svg-container').querySelector('svg');
    if (!svgElement) return;

    const widthPx = parseFloat(svgElement.width.baseVal.value);  // 720 pt (= 10 inch = 960 px)
    const heightPx = parseFloat(svgElement.height.baseVal.value);  // 720 pt (= 10 inch = 960 px)
    // console.log(`width: ${widthPx}, height: ${heightPx}`);

    const filename = `${filenameBase}.${format}`;
    //-------------------------------------------------------------------------|
    if (format === 'svg') {
      // Define XML and DOCTYPE headers
      const xmlHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
      // Concatenate headers with sanitized SVG data
      const svgWithHeaders = xmlHeader + svgData;

      const blob = new Blob([svgWithHeaders], { type: 'image/svg+xml' });
      saveAs(blob, filename);
    //-------------------------------------------------------------------------|
    } else if (format === 'png') {
      // Assuming the current DPI is 96 (standard for SVGs)
      const scaleFactor = parseFloat(dpi) / 96;
      const newWidthPx = widthPx * scaleFactor;
      const newHeightPx = heightPx * scaleFactor;

      const canvas = await document.createElement('canvas')
      canvas.width = newWidthPx;
      canvas.height = newHeightPx;
      const ctx = canvas.getContext('2d');
      // Center the SVG on the canvas
      ctx.translate((newWidthPx - widthPx) / 2, (newHeightPx - heightPx) / 2);

      // Render the SVG onto the canvas
      const v = await Canvg.fromString(ctx, svgData, {
        ignoreDimensions: true, // Ignore the SVG's width and height attributes
        scaleWidth: newWidthPx,
        scaleHeight: newHeightPx
      });
      await v.render();

      canvas.toBlob((blob) => {
        saveAs(blob, filename);
      });
    //-------------------------------------------------------------------------|
    } else if (format === 'pdf') {
      const pdfDoc = new jsPDF({
        unit: 'pt',
        format: [widthPx, heightPx]
      });

      pdfDoc
        .svg(svgElement, {
          x: 0,
          y: 0,
          width: widthPx,
          height: heightPx
        })
        .then(() => {
          pdfDoc.save(filename)
        })
    }
    //-------------------------------------------------------------------------|
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
