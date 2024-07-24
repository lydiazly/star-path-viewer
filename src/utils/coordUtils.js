// src/utils/coordUtils.js
import { hmsToDecimal, decimalToHMS } from './dateUtils';

/**
 * Converts DMS (Degrees, Minutes, Seconds) to decimal degrees.
 * 
 * @param {Object} params - An object containing degrees, minutes, and seconds
 * @param {number} params.degrees - The degrees component
 * @param {number} params.minutes - The minutes component
 * @param {number} params.seconds - The seconds component
 * @returns {number} The decimal degrees of the given DMS values
 */
const dmsToDecimal = ({ degrees, minutes, seconds }) => {
  const sign = degrees < 0 ? -1 : 1;
  const decimalDegrees = Math.abs(degrees) + (minutes / 60) + (seconds / 3600);
  return sign * decimalDegrees;
};

/**
 * Converts decimal hours to DMS (Degrees, Minutes, Seconds).
 * 
 * @param {number} decimalDegrees - Decimal degrees
 * @returns {Object} An object containing degrees, minutes, and seconds
 */
const decimalToDMS = (decimalDegrees) => {
  const sign = decimalDegrees < 0 ? -1 : 1;
  const absdecimalDegrees = Math.abs(decimalDegrees);
  const absDegrees = Math.floor(absdecimalDegrees);
  const minutes = Math.floor((absdecimalDegrees - absDegrees) * 60);
  const seconds = ((absdecimalDegrees - absDegrees) * 60 - minutes) * 60;
  return { degrees: parseInt(sign * absDegrees), minutes, seconds };
};

const formatDMS = ({ degrees, minutes, seconds }) => {
  return `${degrees < 0 ? '-' : '+'}${Math.abs(degrees)}°${minutes}'${seconds.toFixed(2)}"`;
};

const formatDecimalDgrees = (decimalDegrees) => {
  const dms = decimalToDMS(decimalDegrees);
  return formatDMS(dms);
};

/**
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
 * 
 * @param {Object} hms - An object containing hours, minutes, and seconds
 * @returns {Object} An object containing degrees, minutes, and seconds
 */
const hmsToDMS = (hms) => {
  const decimalHours = hmsToDecimal(hms);
  const decimalDegrees = decimalHours * 15;
  return decimalToDMS(decimalDegrees);
};

/**
 * Formats a geographic coordinate value into a string.
 * 
 * @param {number} coordinate - A geographic coordinate value
 * @param {string} type - 'lat' or 'lng'
 * @returns {string} The formatted geographic coordinate string
 */
const formatCoordinate = (coordinate, type) => {
  const { degrees, minutes, seconds } = decimalToDMS(coordinate);
  const direction = type === 'lat'
    ? coordinate >= 0 ? 'N' : 'S'
    : coordinate >= 0 ? 'E' : 'W';
  return `${Math.abs(degrees)}°${minutes}'${seconds.toFixed(2)}"${direction}`;
};

export {
  dmsToDecimal,
  decimalToDMS,
  formatDMS,
  formatDecimalDgrees,
  dmsToHMS,
  hmsToDMS,
  formatCoordinate
};
