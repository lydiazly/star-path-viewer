// src/components/AnnoDisplay.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { dateTimeToStr, formatTimezone } from '../utils/dateUtils';
import { formatDecimalDgrees } from '../utils/coordUtils';
import { PT_NAMES } from '../utils/constants';

const AnnoDisplay = ({ anno }) => {
  const filteredAnno = anno.filter(item => item.is_displayed);
  const tzStr = formatTimezone(parseFloat(filteredAnno[0].time_zone));
  const redAsterisk = <span style={{ color: 'red' }}>*</span>;

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2}>Point</TableCell>
              <TableCell rowSpan={2}>Altitude</TableCell>
              <TableCell rowSpan={2}>Azimuth</TableCell>
              <TableCell colSpan={2}>{`Standard Time`}{redAsterisk}{` (${tzStr})`}</TableCell>
              <TableCell colSpan={2}>UT1 Time</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gregorian</TableCell>
              <TableCell>Julian</TableCell>
              <TableCell>Gregorian</TableCell>
              <TableCell>Julian</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnno.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{PT_NAMES[item.name] || item.name}</TableCell>
                <TableCell>{formatDecimalDgrees(parseFloat(item.alt))}</TableCell>
                <TableCell>{formatDecimalDgrees(parseFloat(item.az))}</TableCell>
                <TableCell>{dateTimeToStr({ dateTime: item.time_local })}</TableCell>
                <TableCell>{dateTimeToStr({ dateTime: item.time_local_julian })}</TableCell>
                <TableCell>{dateTimeToStr({ dateTime: item.time_ut1})}</TableCell>
                <TableCell>{dateTimeToStr({ dateTime: item.time_ut1_julian })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left', mt: 1 }}>
        {redAsterisk} Not in Daylight Saving Time.
      </Typography>
    </Box>
  );
};

export default AnnoDisplay;
