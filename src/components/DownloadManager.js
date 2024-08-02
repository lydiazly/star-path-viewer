// src/components/DownloadManager.js
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Stack, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
import { Canvg } from 'canvg';
import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

const DownloadManager = ({ svgData, filenameBase = 'star_trail', dpi = 300, setErrorMessage }) => {
  const handleDownload = useCallback(async (format) => {
    const svgElement = document.getElementById('svg-container').querySelector('svg');
    if (!svgElement) {
      setErrorMessage('SVG element not found');
      return;
    }

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

      const canvas = document.createElement('canvas');
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
        scaleHeight: newHeightPx,
      });
      await v.render();

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, filename);
        } else {
          setErrorMessage('Failed to generate PNG.');
        }
      });
    /* ---------------------------------------------------------------------- */
    } else if (format === 'pdf') {
      const pdfDoc = new jsPDF({
        unit: 'pt',
        format: [widthPx, heightPx],
      });

      pdfDoc
        .svg(svgElement, {
          x: 0,
          y: 0,
          width: widthPx,
          height: heightPx,
        })
        .then(() => {
          pdfDoc.save(filename);
        })
        .catch((error) => {
          setErrorMessage('Failed to generate PDF.');
          console.error(error);
        });
    }
    /* ---------------------------------------------------------------------- */
  }, [svgData, filenameBase, dpi, setErrorMessage]);

  return (
    <Stack direction='row' spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent='center'>
      {['svg', 'png', 'pdf'].map((format) => (
        <Button
          variant="contained"
          key={format}
          onClick={() => handleDownload(format)}
          startIcon={<DownloadIcon />}
          sx={{ minWidth: '15%' }}
        >
          {format}
        </Button>
      ))}
    </Stack>
  );
};

DownloadManager.propTypes = {
  svgData: PropTypes.string.isRequired,
  filenameBase: PropTypes.string,
  dpi: PropTypes.number,
  setErrorMessage: PropTypes.func.isRequired,
};

export default DownloadManager;
