// src/components/DateFormat.js
const MONTHS = [
  { abbr: '', name: '' },
  { abbr: 'Jan', name: 'January' },
  { abbr: 'Feb', name: 'February' },
  { abbr: 'Mar', name: 'March' },
  { abbr: 'Apr', name: 'April' },
  { abbr: 'May', name: 'May' },
  { abbr: 'Jun', name: 'June' },
  { abbr: 'Jul', name: 'July' },
  { abbr: 'Aug', name: 'August' },
  { abbr: 'Sep', name: 'September' },
  { abbr: 'Oct', name: 'October' },
  { abbr: 'Nov', name: 'November' },
  { abbr: 'Dec', name: 'December' }
];

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
  const pad = number => number.toString().padStart(2, '0');
  const yearStr = year > 0 ? `${year} CE` : `${-year + 1} BCE`;
  const monthStr = MONTHS[month].abbr;
  const dateStr = `${day} ${monthStr} ${yearStr}`;
  const secondStr = Number.isInteger(second) ? pad(second) : second.toFixed(3).padStart(6, '0');
  const timeStr = `${pad(hour)}:${pad(minute)}:${secondStr}`;
  return [dateStr, timeStr];
};

/**
 * Converts a date and time array into a formatted string.
 * 
 * @param {number[]} time - An array containing [year, month, day, hour, minute, second]
 * @returns {string} The formatted date and time string.
 */
const DateTimeListToStr = (time) => {
  if (!Array.isArray(time) || time.length < 6) return '';

  const [year, month, day, hour, minute, second] = time.map((value, index) => {
    if (index === 5) return parseFloat(value);  // Parse the second as float
    return parseInt(value, 10);  // Parse other values as int
  });
  
  const dateTimeStrList = formatDateTime({ year, month, day, hour, minute, second });
  return `${dateTimeStrList[0]}, ${dateTimeStrList[1]}`;
};

export { formatDateTime, DateTimeListToStr };
