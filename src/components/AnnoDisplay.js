// src/components/AnnoDisplay.js
import React, { useMemo } from 'react';
import { Box, Stack, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CustomDivider from './ui/CustomDivider';
import { dateTimeToStr, formatTimezone } from '../utils/dateUtils';
import { formatDecimalDgrees } from '../utils/coordUtils';
import { PT_DETAIL, LINE_DETAIL } from '../utils/constants';

const redAsterisk = <span style={{ color: 'red' }}>*</span>;

const labelStyle = { textAlign: 'left', fontWeight: 500 };
const detailStyle = { textAlign: 'left', color: 'rgba(0, 0, 0, 0.75)' };
const headStyle = { textAlign: 'center' };
const cellStyleHead = { paddingX: 1.5, paddingY: 1.5, textAlign: 'center', fontWeight: 500 };
const cellStyleCenter = { paddingX: 1.5, paddingY: 1.5, textAlign: 'center' };
const cellStyleRight = { paddingX: 1.5, paddingY: 1.5, textAlign: 'right' };
const timeMinWidth = 100;

const Line = styled('div')(({ type }) => ({
  width: '35px',
  height: '0px',
  borderBottom: type === 'dotted' ? '2px dotted rgba(0, 0, 0, 0.35)' :
                type === 'solid' ? '3px solid black' :
                type === 'lightDashed' ? '3px dashed rgba(0, 0, 0, 0.35)' :
                type === 'darkDashed' ? '3px dashed black' :
                'none',
  display: 'inline-block',
  marginBottom: '6px',
  verticalAlign: 'middle',
}));

const AnnoDisplay = ({ anno }) => {
  // console.log('Rendering AnnoDisplay');
  const filteredAnno = useMemo(() => anno.filter(item => item.is_displayed), [anno]);
  const tzStr = useMemo(() => formatTimezone(filteredAnno[0].time_zone), [filteredAnno]);

  return (
    <Box>
      <CustomDivider sx={{ pt: 1.5, mb: 0.5 }} />
      <Stack direction="column" spacing={1} sx={{ width: '100%', pt: 1, pl: '6%', pr: '4%' }}>
        {Object.keys(LINE_DETAIL).map((type, index) => (
          <Grid container key={index} display="flex" alignItems="start" flexWrap="wrap">
            <Grid item xs={12} sm={1} md={2.5} sx={labelStyle}>
              <Line type={type} />
            </Grid>
            <Grid item xs={12} sm={11} md={9.5}>
              <Typography variant="body2" sx={detailStyle}>
                {LINE_DETAIL[type]}
              </Typography>
            </Grid>
          </Grid>
        ))}

        {filteredAnno.map((item, index) => (
          <Grid container key={index} display="flex" alignItems="start">
            <Grid item xs={12} sm={12} md={2.5}>
              <Box display="flex" alignItems="start" flexWrap="wrap">
                <Typography variant="body2" color="red" sx={{ ...labelStyle, minWidth: '2rem' }}>
                  &#9679; {item.name}
                </Typography>
                <Typography variant="body2" sx={labelStyle}>
                  ({PT_DETAIL[item.name].name})
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={9.5}>
              <Typography variant="body2" sx={detailStyle}>
                {PT_DETAIL[item.name].detail}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Stack>
      <CustomDivider sx={{ mt: 0.5, mb: 2.5 }} />

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} sx={headStyle}>Point</TableCell>
              <TableCell rowSpan={2} sx={headStyle}>Altitude</TableCell>
              <TableCell rowSpan={2} sx={headStyle}>Azimuth</TableCell>
              <TableCell colSpan={2} sx={headStyle}>{`Standard Time (${tzStr})`} {redAsterisk}</TableCell>
              <TableCell colSpan={2} sx={headStyle}>Universal Time (UT1)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ ...headStyle, minWidth: timeMinWidth }}>Gregorian</TableCell>
              <TableCell sx={{ ...headStyle, minWidth: timeMinWidth }}>Julian</TableCell>
              <TableCell sx={{ ...headStyle, minWidth: timeMinWidth }}>Gregorian</TableCell>
              <TableCell sx={{ ...headStyle, minWidth: timeMinWidth }}>Julian</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnno.map((item, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" sx={cellStyleHead}>{item.name}</TableCell>
                <TableCell sx={cellStyleRight}>{formatDecimalDgrees(item.alt)}</TableCell>
                <TableCell sx={cellStyleRight}>{formatDecimalDgrees(item.az)}</TableCell>
                <TableCell sx={cellStyleCenter}>{dateTimeToStr({ dateTime: item.time_local })}</TableCell>
                <TableCell sx={cellStyleCenter}>{dateTimeToStr({ dateTime: item.time_local_julian })}</TableCell>
                <TableCell sx={cellStyleCenter}>{dateTimeToStr({ dateTime: item.time_ut1 })}</TableCell>
                <TableCell sx={cellStyleCenter}>{dateTimeToStr({ dateTime: item.time_ut1_julian })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left', mt: 1, ml: 1 }}>
        {redAsterisk} Daylight Saving Time not included.
      </Typography>
    </Box>
  );
};

export default React.memo(AnnoDisplay);
