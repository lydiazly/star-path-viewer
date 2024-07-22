// src/utils/dateUtils.js
import { MONTHS } from './constants';

const pad = number => number.toString().padStart(2, '0');

/**
 * Converts HMS (Hours, Minutes, Seconds) to decimal hours.
 * 
 * @param {Object} params - An object containing hours, minutes, and seconds
 * @param {number} params.hours - The hours component
 * @param {number} params.minutes - The minutes component
 * @param {number} params.seconds - The seconds component
 * @returns {number} The decimal degrees of the given HMS values
 */
const hmsToDecimal = ({ hours, minutes, seconds }) => {
  const sign = hours < 0 ? -1 : 1;
  const decimalHours = Math.abs(hours) + (minutes / 60) + (seconds / 3600);
  return sign * decimalHours;
};

/**
 * Converts decimal hours to HMS (Hours, Minutes, Seconds).
 * 
 * @param {number} decimalHours - Decimal hours
 * @returns {Object} An object containing hours, minutes, and seconds
 */
const decimalToHMS = (decimalHours) => {
  const sign = decimalHours < 0 ? -1 : 1;
  const absDecimalHours = Math.abs(decimalHours);
  const absHours = Math.floor(absDecimalHours);
  const minutes = Math.floor((absDecimalHours - absHours) * 60);
  const seconds = ((absDecimalHours - absHours) * 60 - minutes) * 60;
  return { hours: sign * absHours, minutes, seconds };
};

const formatHMS = ({ hours, minutes, seconds }) => {
  return `${hours < 0 ? '-' : '+'}${Math.abs(hours)}h ${minutes}m ${seconds.toFixed(2)}s`;
};

const formatDecimalHours = (decimalHours) => {
  const hms = decimalToHMS(decimalHours);
  return formatHMS(hms);
};

/**
 * Formats the date and time into strings as '1 Jan 2000 CE' and '12:00:00[.000]'
 *
 * @param {Object} params - An object containing year, month, day, hour, minute, second
 * @param {number} params.year - 0 is 1 BCE
 * @param {number} [params.month=1] - Starts from 1
 * @param {number} [params.day=1] - Day of the month
 * @param {number} [params.hour=12] - 24-hour format
 * @param {number} [params.minute=0] - Minutes
 * @param {number} [params.second=0] - Seconds (can be an integer or float)
 * @returns {string[]} An array containing two strings: the formatted date and the formatted time.
 */
const formatDateTime = ({ year, month = 1, day = 1, hour = 12, minute = 0, second = 0 }) => {
  const yearStr = year > 0 ? `${year} CE` : `${-year + 1} BCE`;
  const monthStr = MONTHS[month].abbr;
  const dateStr = `${day} ${monthStr} ${yearStr}`;
  const secondStr = Number.isInteger(second) ? pad(second) : second.toFixed(3).padStart(6, '0');
  const timeStr = `${pad(hour)}:${pad(minute)}:${secondStr}`;
  return { date: dateStr, time: timeStr };
};

/**
 * Formats a date and time array into a string.
 * 
 * @param {number[]} dateTime - An array containing [year, month, day, hour, minute, second]
 * @returns {string} The formatted date and time string.
 */
const dateTimeToStr = (dateTime) => {
  if (!Array.isArray(dateTime) || dateTime.length < 6) return '';

  const [year, month, day, hour, minute, second] = dateTime.map((value, index) => {
    if (index === 5) return parseFloat(value);  // Parse the second as float
    return parseInt(value, 10);  // Parse other values as int
  });
  
  const dateTimeStrList = formatDateTime({ year, month, day, hour, minute, second });
  return `${dateTimeStrList.date}, ${dateTimeStrList.time}`;
};

/**
 * Formats a decimal UTC offset into a string.
 * 
 * @param {number} tz - Decimal UTC offset
 * @returns {string} The formatted UTC offset string
 */
const formatTimezone = (tz) => {
  const { hours, minutes } = decimalToHMS(Math.abs(tz));
  return `${hours < 0 ? '-' : '+'}${pad(Math.abs(hours))}${pad(minutes)}`;
};

export {
  decimalToHMS,
  hmsToDecimal,
  formatHMS,
  formatDecimalHours,
  formatDateTime,
  dateTimeToStr,
  formatTimezone
};
