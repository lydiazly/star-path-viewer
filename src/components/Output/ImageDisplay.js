// src/components/Output/ImageDisplay.js
import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const ImageDisplay = ({ svgData }) => {
  return (
    <Box
      id="svg-container"
      sx={{mr: 0.5,
        '& svg': {
          width: '100%',
          height: 'auto',
        }
      }}
      dangerouslySetInnerHTML={{ __html: svgData }}
    />
  );
};

ImageDisplay.propTypes = {
  svgData: PropTypes.string.isRequired,
};

export default React.memo(ImageDisplay);
