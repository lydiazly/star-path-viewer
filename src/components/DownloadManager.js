// src/components/DownloadManager.js
import React, { useCallback } from 'react';
import { Stack, Button } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
import { Canvg } from 'canvg';
import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

const DownloadManager = ({ svgData, filenameBase = 'star_trail', dpi = 300, setErrorMessage }) => {
  const handleDownload = useCallback(async (format) => {
    const svgElement = document.getElementById('svg-container').querySelector('svg');
    if (!svgElement) return;

    const widthPx = parseFloat(svgElement.width.baseVal.value);
    const heightPx = parseFloat(svgElement.height.baseVal.value);
    // console.log(`width: ${widthPx}, height: ${heightPx}`);

    const filename = `${filenameBase}.${format}`;
    /* ---------------------------------------------------------------------- */
    if (format === 'svg') {
      /* Define XML and DOCTYPE headers */
      const xmlHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
      /* Concatenate headers with sanitized SVG data */
      const svgWithHeaders = xmlHeader + svgData;

      const blob = new Blob([svgWithHeaders], { type: 'image/svg+xml' });
      saveAs(blob, filename);
    /* ---------------------------------------------------------------------- */
    } else if (format === 'png') {
      /* Assuming the current DPI is 96 (standard for SVGs) */
      const scaleFactor = parseFloat(dpi) / 96;
      const newWidthPx = widthPx * scaleFactor;
      const newHeightPx = heightPx * scaleFactor;

      const canvas = await document.createElement('canvas');
      if (!canvas || !canvas.getContext) {
        setErrorMessage('Your browser does not support the HTML5 Canvas feature.');
        return;
      }
      
      canvas.width = newWidthPx;
      canvas.height = newHeightPx;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setErrorMessage('Your browser does not support the 2D rendering context.');
        return;
      }

      /* Center the SVG on the canvas */
      ctx.translate((newWidthPx - widthPx) / 2, (newHeightPx - heightPx) / 2);

      /* Render the SVG onto the canvas */
      const v = await Canvg.fromString(ctx, svgData, {
        ignoreDimensions: true,  // Ignore the SVG's width and height attributes
        scaleWidth: newWidthPx,
        scaleHeight: newHeightPx
      });
      await v.render();

      canvas.toBlob((blob) => {
        saveAs(blob, filename);
      });
    /* ---------------------------------------------------------------------- */
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
          pdfDoc.save(filename);
        });
    }
    /* ---------------------------------------------------------------------- */
  }, [svgData, filenameBase, dpi, setErrorMessage]);

  return (
    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
      <Grid item xs={12} sm={4} md={4}>
        <Button variant="contained" onClick={() => handleDownload('svg')} startIcon={<DownloadIcon />} fullWidth>
          SVG
        </Button>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Button variant="contained" onClick={() => handleDownload('png')} startIcon={<DownloadIcon />} fullWidth>
          PNG
        </Button>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Button variant="contained" onClick={() => handleDownload('pdf')} startIcon={<DownloadIcon />} fullWidth>
          PDF
        </Button>
      </Grid>
    </Grid>
  );
};

export default DownloadManager;
