// src/components/DateLocationDisplay.js
import React, { useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import { formatDateTime } from '../utils/dateUtils';
import { formatCoordinate } from '../utils/coordUtils';

const DateLocationDisplay = ({ date, location }) => {
  const [year, month, day] = date;
  const dateStr = useMemo(() => formatDateTime({
    year: parseInt(year),
    month: parseInt(month),
    day: parseInt(day),
    monthFirst: true,
    abbr: false,
  }).date, [year, month, day]);

  const latStr = useMemo(() => formatCoordinate(parseFloat(location.lat), 'lat'), [location.lat]);
  const lngStr = useMemo(() => formatCoordinate(parseFloat(location.lng), 'lng'), [location.lng]);

  return (
    <Box mt={4}>
      <Typography variant="body1">
        [DATE] {dateStr}&nbsp;&nbsp;&nbsp;&nbsp;[LAT/LNG] {latStr} / {lngStr}
      </Typography>
    </Box>
  );
};

export default DateLocationDisplay;
