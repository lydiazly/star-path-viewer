// src/utils/constants.js
const EPH_DATE_MIN = [-3000, 1, 29];  // 29 January 3001 BCE
const EPH_DATE_MAX = [3000, 5, 6];    // 6 May 3000 CE

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

const STARS = {
  Mercury: 'mercury',
  Venus: 'venus',
  Mars: 'mars',
  Jupiter: 'jupiter',
  Saturn: 'saturn',
  Uranus: 'uranus',
  Neptune: 'neptune',
  Pluto: 'pluto'
};

const PT_NAMES = {
  R: 'Rising',
  S: 'Setting',
};

export { EPH_DATE_MIN, EPH_DATE_MAX, MONTHS, STARS, PT_NAMES };
