// src/components/DateLocationDisplay.js
import React from 'react';
import { formatDateTime } from '../utils/dateUtils';
import { formatCoordinate } from '../utils/coordUtils';

const DateLocationDisplay = ({ date, location }) => {
  const [year, month, day] = date;
  const dateStr = formatDateTime({ year, month, day }).date;

  const latStr = formatCoordinate(parseFloat(location.lat), 'lat');
  const lngStr = formatCoordinate(parseFloat(location.lng), 'lng');

  return (
    <p>
      [DATE] {dateStr}&nbsp;&nbsp;&nbsp;&nbsp;[LAT/LNG] {latStr} / {lngStr}
    </p>
  );
};

export default DateLocationDisplay;