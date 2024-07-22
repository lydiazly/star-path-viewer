// src/components/DateLocationDisplay.js
import React from 'react';
import { formatDateTime } from '../utils/dateUtils';

const DateLocationDisplay = ({ date, location }) => {
  const [year, month, day] = date;
  const dateStr = formatDateTime({ year, month, day }).date;

  const formatCoordinate = (coordinate, type) => {
    const absValue = Math.abs(coordinate);
    const degrees = Math.floor(absValue);
    const minutes = Math.floor((absValue - degrees) * 60);
    const seconds = ((absValue - degrees - minutes / 60) * 3600).toFixed(2);
    const direction = type === 'lat'
      ? coordinate >= 0 ? 'N' : 'S'
      : coordinate >= 0 ? 'E' : 'W';
    
    return `${degrees}°${minutes}'${seconds}" ${direction}`;
  };

  const latStr = formatCoordinate(location.lat, 'lat');
  const lngStr = formatCoordinate(location.lng, 'lng');

  return (
    <p>
      Date: {dateStr}, Latitude: {latStr}, Longitude: {lngStr}
    </p>
  );
};

export default DateLocationDisplay;
