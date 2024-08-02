// src/components/InfoDisplay.js
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { EQX_SOL_NAMES } from '../utils/constants';
import { formatDateTime, formatDateTimeISO, dateTimeToStr, decimalToHMS, formatHMS } from '../utils/dateUtils';
import { formatCoordinate, formatDecimalDgrees } from '../utils/coordUtils';

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const InfoDisplay = ({ date, location, star, flag = '', eqxSolTime = [] }) => {
  const dateStr = useMemo(() => formatDateTime({
    year: parseInt(date.year),
    month: parseInt(date.month),
    day: parseInt(date.day),
    monthFirst: true,
    abbr: false,
  }).date, [date]);

  const dateStrISO = useMemo(() => formatDateTimeISO({
    year: parseInt(date.year),
    month: parseInt(date.month),
    day: parseInt(date.day),
  }).date, [date]);

  const latStr = useMemo(() => formatCoordinate(parseFloat(location.lat), 'lat'), [location.lat]);
  const lngStr = useMemo(() => formatCoordinate(parseFloat(location.lng), 'lng'), [location.lng]);
  
  const { name, hip, ra, dec } = star;

  const raStr = useMemo(() => formatHMS(decimalToHMS(parseFloat(ra) / 15)), [ra]);
  const decStr = useMemo(() => formatDecimalDgrees(parseFloat(dec)), [dec]);

  const eqxSolTimeStr = useMemo(() => {
    if (EQX_SOL_NAMES.hasOwnProperty(flag) && eqxSolTime.length === 6) {
      return `${EQX_SOL_NAMES[flag]}: ${dateTimeToStr({ dateTime: eqxSolTime })}`;
    } else {
      return '';
    }
  }, [flag, eqxSolTime]);

  return (
    <Box mt={4} sx={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item xs={12} sm={8} md="auto">
            <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>
              [DATE] {dateStrISO} ({dateStr})
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4} md="auto">
            <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>
              [COORDINATES] {latStr}/{lngStr}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={12} md="auto">
            <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>
              {name ? (
                `[NAME] ${capitalize(name)}`
              ) : (
                hip ? (
                  `[HIPPARCHUS] ${hip}`
                ) : (ra && dec && (
                  `[RA/DEC] ${raStr}/${decStr}`
                ))
              )}
            </Typography>
          </Grid>

          {eqxSolTimeStr && (
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>
                {eqxSolTimeStr}
              </Typography>
            </Grid>
          )}
        </Grid>
      </div>
    </Box>
  );
};

InfoDisplay.propTypes = {
  date: PropTypes.shape({
    year: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    lat: PropTypes.string.isRequired,
    lng: PropTypes.string.isRequired,
  }).isRequired,
  star: PropTypes.shape({
    name: PropTypes.string,
    hip: PropTypes.string,
    ra: PropTypes.string,
    dec: PropTypes.string,
  }).isRequired,
  flag: PropTypes.string,
  eqxSolTime: PropTypes.arrayOf(PropTypes.number),
};

export default InfoDisplay;
