// src/components/AnnoDisplay.js
import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { dateTimeToStr, formatTimezone } from '../utils/dateUtils';
import { formatDecimalDgrees } from '../utils/coordUtils';
import { PT_NAMES } from '../utils/constants';

const AnnoDisplay = ({ anno }) => {
  // console.log('Rendering AnnoDisplay');
  const filteredAnno = useMemo(() => anno.filter(item => item.is_displayed), [anno]);
  const tzStr = useMemo(() => formatTimezone(filteredAnno[0].time_zone), [filteredAnno]);
  const redAsterisk = useMemo(() => <span style={{ color: 'red' }}>*</span>, []);

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <caption>{redAsterisk} Daylight Saving Time not included.</caption>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} sx={{ textAlign: 'center' }}>Point</TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: 'center' }}>Altitude</TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: 'center' }}>Azimuth</TableCell>
              <TableCell colSpan={2} sx={{ textAlign: 'center' }}>{`Standard Time (${tzStr})`} {redAsterisk}</TableCell>
              <TableCell colSpan={2} sx={{ textAlign: 'center' }}>Universal Time (UT1)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ textAlign: 'center' }}>Gregorian</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Julian</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Gregorian</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Julian</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnno.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ textAlign: 'center' }}>{PT_NAMES[item.name] || item.name}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{formatDecimalDgrees(parseFloat(item.alt))}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{formatDecimalDgrees(parseFloat(item.az))}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{dateTimeToStr({ dateTime: item.time_local })}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{dateTimeToStr({ dateTime: item.time_local_julian })}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{dateTimeToStr({ dateTime: item.time_ut1 })}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{dateTimeToStr({ dateTime: item.time_ut1_julian })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left', mt: 1 }}>
        {redAsterisk} Not in Daylight Saving Time.
      </Typography> */}
    </Box>
  );
};

export default React.memo(AnnoDisplay);
