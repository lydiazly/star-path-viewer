// src/components/InfoDisplay.js
import React, { useMemo } from 'react';
import { Typography, Box, Stack } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
// import { EQX_SOL_NAMES } from '../utils/constants';
import CustomDivider from './ui/CustomDivider';
import { formatDateTime, formatDateTimeISO, decimalToHMS, formatHMS } from '../utils/dateUtils';
import { formatCoordinate, formatDecimalDgrees } from '../utils/coordUtils';

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const InfoDisplay = ({ info }) => {
  // console.log('Rendering InfoDisplay');
  const latStr = useMemo(() => formatCoordinate(parseFloat(info.lat), 'lat'), [info.lat]);
  const lngStr = useMemo(() => formatCoordinate(parseFloat(info.lng), 'lng'), [info.lng]);

  const dateStrG = useMemo(() => formatDateTime({
    year: parseInt(info.dateG.year),
    month: parseInt(info.dateG.month),
    day: parseInt(info.dateG.day),
    monthFirst: true,
    abbr: false,
  }).date, [info]);

  const dateStrIsoG = useMemo(() => formatDateTimeISO({
    year: parseInt(info.dateG.year),
    month: parseInt(info.dateG.month),
    day: parseInt(info.dateG.day),
  }).date, [info]);


  const dateStrJ = useMemo(() => formatDateTime({
    year: parseInt(info.dateJ.year),
    month: parseInt(info.dateJ.month),
    day: parseInt(info.dateJ.day),
    monthFirst: true,
    abbr: false,
  }).date, [info]);

  const dateStrIsoJ = useMemo(() => formatDateTimeISO({
    year: parseInt(info.dateJ.year),
    month: parseInt(info.dateJ.month),
    day: parseInt(info.dateJ.day),
  }).date, [info]);

  const raStr = useMemo(() => info.ra ? formatHMS(decimalToHMS(parseFloat(info.ra) / 15)) : '', [info.ra]);
  const decStr = useMemo(() => info.dec ? formatDecimalDgrees(parseFloat(info.dec)) : '', [info.dec]);

  // const eqxSolTimeStr = useMemo(() => {
  //   if (EQX_SOL_NAMES.hasOwnProperty(info.flag) && info.eqxSolTime.length === 6) {
  //     return `${EQX_SOL_NAMES[info.flag]}: ${dateTimeToStr({ dateTime: info.eqxSolTime })}`;
  //   } else {
  //     return '';
  //   }
  // }, [info.flag, info.eqxSolTime]);

  return (
    <Box mt={1}>
      <CustomDivider sx={{ mb: 0.5 }} />
      <Grid container paddingRight={10} rowSpacing={0.5} columnSpacing={5} sx={{ maxWidth: '100%', margin: 'auto' }}>
        <Grid item xs={12} sm={12} md={6.5}>
          <Stack direction="column" spacing={0.5}>
            <Box display="flex" alignItems="start">
              <Typography variant="subtitle1" textAlign="left" sx={{ minWidth: '5.5rem', fontWeight: 'bold' }}>
                [Gregorian]
              </Typography>
              <Typography variant="subtitle1" textAlign="left" sx={{ textAlign: 'left' }}>
                {dateStrIsoG} ({dateStrG})
              </Typography>
            </Box>
            <Box display="flex" alignItems="start">
              <Typography variant="subtitle1" textAlign="left" sx={{ minWidth: '5.5rem', fontWeight: 'bold' }}>
                [Julian]
              </Typography>
              <Typography variant="subtitle1" textAlign="left" sx={{ textAlign: 'left' }}>
                {dateStrIsoJ} ({dateStrJ})
              </Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12} md={5.5}>
          <Stack direction="column" spacing={0.5}>
            <Box display="flex" alignItems="start">
              <Typography variant="subtitle1" textAlign="left" sx={{ minWidth: '5.5rem', fontWeight: 'bold' }}>
                [Location]
              </Typography>
              <Typography variant="subtitle1" textAlign="left" sx={{ textAlign: 'left' }}>
                {latStr}/{lngStr}
              </Typography>
            </Box>

            {info.name ? (
              <Box display="flex" alignItems="start">
                <Typography variant="subtitle1" textAlign="left" sx={{ minWidth: '5.5rem', fontWeight: 'bold' }}>
                  [Planet]
                </Typography>
                <Typography variant="subtitle1" textAlign="left" sx={{ textAlign: 'left' }}>
                  {capitalize(info.name)}
                </Typography>
              </Box>
            ) : (
              info.hip ? (
                <Box display="flex" alignItems="start">
                  <Typography variant="subtitle1" textAlign="left" sx={{ fontWeight: 'bold' }}>
                    [Hipparchus Catalogue Number]
                  </Typography>
                  <Typography variant="subtitle1" textAlign="left" ml={1} sx={{ textAlign: 'left' }}>
                    {info.hip}
                  </Typography>
                </Box>
              ) : (
                info.ra && info.dec && (
                  <Box display="flex" alignItems="start">
                    <Typography variant="subtitle1" textAlign="left" sx={{ minWidth: '5.5rem', fontWeight: 'bold' }}>
                      [RA/Dec]
                    </Typography>
                    <Typography variant="subtitle1" textAlign="left" sx={{ textAlign: 'left' }}>
                      {raStr}/{decStr}
                    </Typography>
                  </Box>
                )
              )
            )}
          </Stack>
        </Grid>

        {/* {eqxSolTimeStr && (
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>
              {eqxSolTimeStr}
            </Typography>
          </Grid>
        )} */}
      </Grid>
      <CustomDivider />
    </Box>
  );
};

export default React.memo(InfoDisplay);
