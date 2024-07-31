// src/components/DateLocationDisplay.js
import React, { useMemo } from 'react';
import { Typography, Box, Stack } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { EQX_SOL } from '../utils/constants';
import { formatDateTime, formatDateTimeISO } from '../utils/dateUtils';
import { formatCoordinate } from '../utils/coordUtils';

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const DateLocationDisplay = ({ date, location, star }) => {
  const flag = date.flag;
  
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
    <Box mt={4} sx={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        <Grid container rowSpacing={1} columnSpacing={{ xs:1, sm: 2, md: 10 }}>
          <Grid item xs={12} sm={8} md="auto">
            <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>
              {dateStrISO} ({dateStr}) {flag && `#${EQX_SOL[flag]}`}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4} md="auto">
            <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>
              {latStr}/{lngStr}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={12} md="auto">
            <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>
            {name ? (
                `${capitalize(name)}`
            ) : (
              hip ? (
                `Hipparchus: ${hip}`
              ) : (ra && dec && (
                `RA/Dec: ${ra}/${dec}`
              ))
            )}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
};

export default DateLocationDisplay;
