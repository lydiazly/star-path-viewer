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
 * Formats the date and time into strings.
 *
 * @param {Number} year - 0 is 1 BCE
 * @param {Number} month - starts from 1, default is 1
 * @param {Number} day - default is 1
 * @param {Number} hour - 24-hour format, default is 12
 * @param {Number} minute - default is 0
 * @param {Number} second - default is 0
 * @returns {Array.<string>} An array containing two strings: the formatted date and the formatted time.
 */
const formatTimeList = (year, month = 1, day = 1, hour = 12, minute = 0, second = 0) => {
    const pad = number => number.toString().padStart(2, '0');
    const yearStr = year > 0 ? `${year} CE` : `${-year + 1} BCE`;
    const monthStr = MONTHS[month].abbr;
    const dateStr = `${day} ${monthStr} ${yearStr}`;
    const secondStr = Number.isInteger(second) ? pad(second) : second.toFixed(3).padStart(6, '0');
    const timeStr = `${pad(hour)}:${pad(minute)}:${secondStr}`;
    return [dateStr, timeStr];
};

const formatTime = (time) => {
  if (!time) return 'N/A';
  const year = parseInt(time[0]);
  const month = parseInt(time[1]);
  const day = parseInt(time[2]);
  const hour = parseInt(time[3]);
  const minute = parseInt(time[4]);
  const second = parseFloat(time[5]);
  const dateTimeStrList = formatTimeList(year, month, day, hour, minute, second);
  return `${dateTimeStrList[0]} ${dateTimeStrList[1]}`;
};

export { formatTimeList, formatTime };
