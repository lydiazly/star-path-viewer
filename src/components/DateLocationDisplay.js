// src/components/DateLocationDisplay.js
import React from 'react';
import { Typography, Box } from '@mui/material';
import { formatDateTime } from '../utils/dateUtils';
import { formatCoordinate } from '../utils/coordUtils';

const DateLocationDisplay = ({ date, location }) => {
  const [year, month, day] = date;
  const dateStr = formatDateTime({
    year: parseInt(year),
    month: parseInt(month),
    day: parseInt(day),
    monthFirst: true,
    abbr: false,
  }).date;

  const latStr = formatCoordinate(parseFloat(location.lat), 'lat');
  const lngStr = formatCoordinate(parseFloat(location.lng), 'lng');

  return (
    <Box mt={4}>
      <Typography variant="body1">
        [DATE] {dateStr}&nbsp;&nbsp;&nbsp;&nbsp;[LAT/LNG] {latStr} / {lngStr}
      </Typography>
    </Box>
  );
};

export default DateLocationDisplay;
