// src/utils/coordUtils.js

/**
 * Converts DMS (Degrees, Minutes, Seconds) to decimal degrees.
 * 
 * @param {Object} dms - An object containing degrees, minutes, and seconds
 * @param {number} dms.degrees - The degrees component
 * @param {number} dms.minutes - The minutes component
 * @param {number} dms.seconds - The seconds component
 * @returns {number} The decimal representation of the given DMS value
 */
const dmsToDecimal = ({ degrees, minutes, seconds }) => {
  const sign = degrees < 0 ? -1 : 1;
  const absDegrees = Math.abs(degrees);
  const decimal = absDegrees + minutes / 60 + seconds / 3600;
  return sign * decimal;
};

/**
 * Converts a decimal value to DMS (Degrees, Minutes, Seconds).
 * 
 * @param {number} value - Positive decimal value
 * @returns {Object} An object containing degrees, minutes, and seconds
 */
const decimalToDMS = (value) => {
  const degrees = Math.floor(value);
  const minutes = Math.floor((value - degrees) * 60);
  const seconds = ((value - degrees) * 60 - minutes) * 60;
  return { degrees, minutes, seconds };
};

/**
 * Formats a geographic coordinate value into a string.
 * 
 * @param {number} coordinate - A geographic coordinate value
 * @param {string} type - 'lat' or 'lng'
 * @returns {string} The formatted geographic coordinate string
 */
const formatCoordinate = (coordinate, type) => {
  const { degrees, minutes, seconds } = decimalToDMS(Math.abs(coordinate));
  const direction = type === 'lat'
    ? coordinate >= 0 ? 'N' : 'S'
    : coordinate >= 0 ? 'E' : 'W';
  
  return `${degrees}°${minutes}'${Number.isInteger(seconds) ? seconds : seconds.toFixed(2)}" ${direction}`;
};

export { formatCoordinate, dmsToDecimal, decimalToDMS };
