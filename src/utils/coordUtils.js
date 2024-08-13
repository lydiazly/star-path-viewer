// src/utils/coordUtils.js
import { hmsToDecimal, decimalToHMS } from './dateUtils';

const pad = number => number.toString().padStart(2, '0');

/**
 * Converts DMS (Degrees, Minutes, Seconds) to decimal degrees.
 *
 * @param {Object} params - An object containing sign, absolute degrees, minutes, and seconds
 * @param {number} params.sign - -1 or 1
 * @param {number} params.degrees - The absolute degrees component
 * @param {number} params.minutes - The minutes component
 * @param {number} params.seconds - The seconds component
 * @returns {number} The decimal degrees of the given DMS values
 */
const dmsToDecimal = ({ sign, degrees, minutes, seconds }) => {
  const decimalDegrees = degrees + (minutes / 60) + (seconds / 3600);
  return sign * decimalDegrees;
};

/**
 * Converts decimal degrees to DMS (Degrees, Minutes, Seconds).
 *
 * @param {number} decimalDegrees - Decimal degrees
 * @returns {Object} An object containing sign, absolute degrees, minutes, and seconds
 */
const decimalToDMS = (decimalDegrees) => {
  const sign = decimalDegrees < 0 ? -1 : 1;
  const absDecimalDegrees = Math.abs(decimalDegrees);
  let absDegrees = Math.floor(absDecimalDegrees);
  const decimalMinutes = (absDecimalDegrees - absDegrees) * 60;
  let minutes = Math.floor(decimalMinutes);
  let seconds = Math.round((decimalMinutes - minutes) * 60);  // int
  // Handle carryover
  if (seconds === 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes === 60) {
    minutes = 0;
    absDegrees += 1;
  }
  if (absDegrees === 360) {
    absDegrees = 0;
  }
  return { sign, degrees: absDegrees, minutes, seconds };
};

/**
 * Formats DMS (Degrees, Minutes, Seconds) into a string.
 *
 * @param {Object} params - An object containing sign, absolute degrees, minutes, and seconds
 * @param {number} params.sign - -1 or 1
 * @param {number} params.degrees - The degrees component
 * @param {number} params.minutes - The minutes component
 * @param {number} params.seconds - The seconds component
 * @returns {string} The formatted DMS string
 */
const formatDMS = ({ sign, degrees, minutes, seconds }) => {
  // return `${sign < 0 ? '-' : '+'}${degrees}°${pad(minutes)}'${seconds.toFixed(2).padStart(5, '0')}"`;
  return `${sign < 0 ? '-' : '+'}${degrees}°${pad(minutes)}'${pad(seconds)}"`;
};

/**
 * Formats decimal degrees into a DMS string.
 *
 * @param {number} decimalDegrees - Decimal degrees
 * @returns {string} The formatted DMS string
 */
const formatDecimalDgrees = (decimalDegrees) => {
  const dms = decimalToDMS(decimalDegrees);
  return formatDMS(dms);
};

/**
 * Converts DMS (Degrees, Minutes, Seconds) to HMS (Hours, Minutes, Seconds).
 *
 * @param {Object} dms - An object containing degrees, minutes, and seconds
 * @returns {Object} An object containing hours, minutes, and seconds
 */
const dmsToHMS = (dms) => {
  const decimalDegrees = dmsToDecimal(dms);
  const decimalHours = decimalDegrees / 15;
  return decimalToHMS(decimalHours);
};

/**
 * Converts HMS (Hours, Minutes, Seconds) to DMS (Degrees, Minutes, Seconds).
 *
 * @param {Object} hms - An object containing sign, absolute hours, minutes, and seconds
 * @returns {Object} An object containing sign, absolute degrees, minutes, and seconds
 */
const hmsToDMS = (hms) => {
  const decimalHours = hmsToDecimal(hms);
  const decimalDegrees = decimalHours * 15;
  return decimalToDMS(decimalDegrees);
};

/**
 * Formats a geographic coordinate value into a string.
 *
 * @param {number} coordinate - A geographic coordinate value in decimal
 * @param {string} type - 'lat' or 'lng'
 * @returns {string} The formatted geographic coordinate string
 */
const formatCoordinate = (coordinate, type) => {
  const dms = decimalToDMS(coordinate);
  const direction = type === 'lat'
    ? coordinate < 0 ? 'S' : 'N'
    : coordinate < 0 ? 'W' : 'E';
  // return `${dms.degrees}°${pad(dms.minutes)}'${dms.seconds.toFixed(2).padStart(5, '0')}"${direction}`;
  return `${dms.degrees}°${pad(dms.minutes)}'${pad(dms.seconds)}"${direction}`;
};

export {
  dmsToDecimal,
  decimalToDMS,
  formatDMS,
  formatDecimalDgrees,
  dmsToHMS,
  hmsToDMS,
  formatCoordinate,
};
