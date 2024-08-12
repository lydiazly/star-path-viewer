// src/utils/constants.js
const EPH_DATE_MIN = [-3000, 1, 29];  // 29 January 3001 BCE
const EPH_DATE_MAX = [3000, 5, 6];    // 6 May 3000 CE

const EPH_DATE_MIN_JULIAN = [-3000, 2, 23];  // 23 February 3001 BCE
const EPH_DATE_MAX_JULIAN = [3000, 4, 15];   // 15 April 3000 CE

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
  { abbr: 'Dec', name: 'December' },
];

const STARS = {
  Mercury: 'mercury',
  Venus: 'venus',
  Mars: 'mars',
  Jupiter: 'jupiter',
  Saturn: 'saturn',
  Uranus: 'uranus',
  Neptune: 'neptune',
  // Pluto: 'pluto',
};

const PT_DETAIL = {
  D1: { name: "Nautical Dawn", detail: "The star's position when the sun is 12 degrees below the horizon before sunrise." },
  D2: { name: "Civil Dawn", detail: "The star's position when the sun is 6 degrees below the horizon before sunrise." },
  D3: { name: "Sunrise", detail: "The star's position at sunrise." },
  N1: { name: "Sunset", detail: "The star's position at sunset." },
  N2: { name: "Civil Dusk", detail: "The star's position when the sun is 6 degrees below the horizon after sunset." },
  N3: { name: "Nautical Dusk", detail: "The star's position when the sun is 12 degrees below the horizon after sunset." },
  R: { name: 'Rising Point', detail: 'The point where the star appears to rise above the horizon, despite being 34 arc minutes below it due to atmospheric refraction.' },
  T: { name: 'Meridian Transit', detail: 'The point where the star transits the meridian.' },
  S: { name: 'Setting Point', detail: 'The point where the star appears to dip below the horizon, despite already being 34 arc minutes below it due to atmospheric refraction.' },
  NCP: { name: 'North Celestial Pole', detail: '' },
  SCP: { name: 'South Celestial Pole', detail: '' },
  Z: { name: 'zenith', detail: '' },
};

const LINE_DETAIL = {
  dotted: "The star's path in the daytime sky.",
  solid: "The star's path in the nighttime sky.",
  lightDashed: "The star's path during civil twilight.",
  darkDashed: "The star's path during nautical twilight.",
}

const EQX_SOL_NAMES = {
  ve: 'Vernal Equinox',
  ss: 'Summer Solstice',
  ae: 'Autumnal Equinox',
  ws: 'Winter Solstice',
};

const EQX_SOL_KEYS = {
  ve: 'vernal_time',
  ss: 'summer_time',
  ae: 'autumnal_time',
  ws: 'winter_time',
};

export { EPH_DATE_MIN, EPH_DATE_MAX, EPH_DATE_MIN_JULIAN, EPH_DATE_MAX_JULIAN, MONTHS, STARS, PT_DETAIL, LINE_DETAIL, EQX_SOL_NAMES, EQX_SOL_KEYS };
