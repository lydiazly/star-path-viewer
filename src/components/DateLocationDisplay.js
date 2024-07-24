// src/components/DateLocationDisplay.js
import React, { useMemo } from 'react';
import { Typography, Box, Stack } from '@mui/material';
import { formatDateTime, formatDateTimeISO } from '../utils/dateUtils';
import { formatCoordinate } from '../utils/coordUtils';

const DateLocationDisplay = ({ date, location, star }) => {
  const dateStr = useMemo(() => formatDateTime({
    year: parseInt(date.year),
    month: parseInt(date.month),
    day: parseInt(date.day),
    monthFirst: true,
    abbr: false
  }).date, [date]);

  const dateStrISO = useMemo(() => formatDateTimeISO({
    year: parseInt(date.year),
    month: parseInt(date.month),
    day: parseInt(date.day)
  }).date, [date]);

  const latStr = useMemo(() => formatCoordinate(parseFloat(location.lat), 'lat'), [location.lat]);
  const lngStr = useMemo(() => formatCoordinate(parseFloat(location.lng), 'lng'), [location.lng]);
  
  const { name, hip, ra, dec } = star;

  return (
    <Box mt={4}>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
        <Typography variant="subtutle2">
          [DATE] {dateStrISO} ({dateStr})
        </Typography>

        <Typography variant="subtutle2">
          [COORDINATES] {latStr}/{lngStr}
        </Typography>
        
        {name ? (
          <Typography variant="subtutle2">
            [NAME] {name}
          </Typography>
        ) : (
          hip ? (
            <Typography variant="subtutle2">
              [HIPPARCHUS] {hip}
            </Typography>
          ) : (ra && dec && (
            <Typography variant="subtutle2">
              [RA/DEC] {ra}/{dec}
            </Typography>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default DateLocationDisplay;
