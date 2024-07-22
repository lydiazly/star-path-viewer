// src/utils/dateUtils.js
import { MONTHS } from './constants';

const pad = number => number.toString().padStart(2, '0');

/**
 * Formats the date and time into strings as '1 Jan 2000 CE' and '12:00:00[.000]'
 *
 * @param {Object} params - The parameters for the function.
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
 * @param {number[]} time - An array containing [year, month, day, hour, minute, second]
 * @returns {string} The formatted date and time string.
 */
const dateTimeToStr = (time) => {
  if (!Array.isArray(time) || time.length < 6) return '';

  const [year, month, day, hour, minute, second] = time.map((value, index) => {
    if (index === 5) return parseFloat(value);  // Parse the second as float
    return parseInt(value, 10);  // Parse other values as int
  });
  
  const dateTimeStrList = formatDateTime({ year, month, day, hour, minute, second });
  return `${dateTimeStrList.date}, ${dateTimeStrList.time}`;
};

/**
 * Converts decimal time to HMS (Hours, Minutes, Seconds).
 * 
 * @param {number} t - Positive decimal time
 * @returns {Object} An object containing hours, minutes, and rounded seconds
 */
const decimalToHMS = (t) => {
  const hours = Math.floor(t);
  const minutes = Math.floor((t - hours) * 60);
  const seconds = Math.round(((t - hours) * 60 - minutes) * 60);
  return { hours, minutes, seconds };
};

/**
 * Formats a decimal UTC offset into a string.
 * 
 * @param {number} tz - Decimal UTC offset
 * @returns {string} The formatted UTC offset string
 */
const formatTimezone = (tz) => {
  const { hours, minutes } = decimalToHMS(Math.abs(tz));
  return `${tz < 0 ? '-' : '+'}${pad(hours)}${pad(minutes)}`;
};

export {
  formatDateTime,
  dateTimeToStr,
  decimalToHMS,
  formatTimezone
};
