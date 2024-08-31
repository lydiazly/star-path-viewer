// src/components/Output/AnnoDisplay.js
import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import AnnoLegend from './AnnoLegend';
import AnnoTable from './AnnoTable';

const AnnoDisplay = ({ anno }) => {
  // console.log('Rendering AnnoDisplay');
  const filteredAnno = useMemo(() => anno.filter(item => item.is_displayed), [anno]);

  return (
    <Box>
      <AnnoLegend anno={filteredAnno} />
      <AnnoTable anno={filteredAnno} />
    </Box>
  );
};

export default React.memo(AnnoDisplay);
