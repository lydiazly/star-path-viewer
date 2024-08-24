// src/utils/dateInputUtils.js
import { EPH_DATE_MIN, EPH_DATE_MAX, EPH_DATE_MIN_JULIAN, EPH_DATE_MAX_JULIAN } from './constants';
import { dateToStr } from './dateUtils';
import { fetchEquinoxSolstice } from './fetchEquinoxSolstice';

/* Fetch the date for the equinox/solstice of the given year */
const fetchDate = async (date, flag, locationRef, setDate, setFetching, setErrorMessage, setDateValid, signal, abortControllerRef, requestId, latestRequest) => {
  // console.log('Fetching date...', date.year, locationRef.current, flag);
  // const date = dateRef.current;
  // const flag = flagRef.current;
  const location = locationRef.current;

  if (!flag || !date.year || !location.lat || !location.lng || !location.tz) {
    setFetching(false);
    abortControllerRef.current = null;
    return;
  }

  const year = parseInt(date.year);

  if (year <= EPH_DATE_MIN[0] || year >= EPH_DATE_MAX[0]) {
    setFetching(false);
    abortControllerRef.current = null;
    return;
  }

  try {
    const { month: newMonth, day: newDay } = await fetchEquinoxSolstice(location.lat, location.lng, location.tz, year, flag, signal);
    if (requestId === latestRequest.current) {
      if (!(newMonth > 0 && newDay > 0)) {
        setErrorMessage((prev) => ({ ...prev, date: 'Unable to fetch the date.' }));
        setFetching(false);
        abortControllerRef.current = null;
        return;
      }

      const month = newMonth;
      const day = newDay;
      /* Reset month and day if needed */
      const newDate = {
        ...date,
        month: month.toString(),
        day: day.toString(),
      };
      setDate(newDate);
      setFetching(false);
      setDateValid(true);
      abortControllerRef.current = null;
    }
  } catch (error) {
    if (error.name !== 'CanceledError' && requestId === latestRequest.current) {
      setErrorMessage((prev) => ({ ...prev, date: error.message }));
      setFetching(false);
      abortControllerRef.current = null;
    }
    // else {
    //   console.log(`Request for ${date.year}-${flag} canceled.`);
    // }
  }
};

/* Adjust the date based on the selected calendar and flag */
const adjustDate = (date, cal, setDate, setDisabledMonths, setLastDay, setAdjusting) => {
  // console.log('Adjusting...', date);
  // const date = dateRef.current;
  if (!date.year) {
    setAdjusting(false);
    return;
  }

  const year = parseInt(date.year);
  let month = parseInt(date.month) || 1;
  let day = parseInt(date.day) || 1;

  const ephDateMin = cal === 'j' ? EPH_DATE_MIN_JULIAN : EPH_DATE_MIN;
  const ephDateMax = cal === 'j' ? EPH_DATE_MAX_JULIAN : EPH_DATE_MAX;
  const newDisabledMonths = {};
  let dayMin = 1;
  let dayMax = 31;

  /* Reset the last day of a month */
  if (month === 2) {
    dayMax = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
  } else if ([4, 6, 9, 11].includes(month)) {
    dayMax = 30;
  }

  /* Enable all month options */
  Object.keys(newDisabledMonths).forEach((key) => {
    newDisabledMonths[key] = false;
  });

  if (year === ephDateMin[0]) {
    /* Disable the month options before ephDateMin */
    for (let i = ephDateMin[1] - 1; i >= 1; i--) {
      newDisabledMonths[i] = true;
    }

    if (date.month && month <= ephDateMin[1]) {
      month = ephDateMin[1];
      dayMin = ephDateMin[2];
    }
  } else if (year === ephDateMax[0]) {
    /* Disable the month options after ephDateMax */
    for (let i = ephDateMax[1] + 1; i <= 12; i++) {
      newDisabledMonths[i] = true;
    }

    if (date.month && month >= ephDateMax[1]) {
      month = ephDateMax[1];
      dayMax = ephDateMax[2];
    } else if (month === ephDateMax[1]) {
      dayMax = ephDateMax[2];
    }
  }

  if (date.day && day < dayMin) {
    day = dayMin;
  }
  if (date.day && day > dayMax) {
    day = dayMax;
  }

  setDisabledMonths(newDisabledMonths);
  setLastDay(dayMax);

  /* Reset month and day if needed */
  if (month.toString() !== date.month || day.toString() !== date.day) {
    const newDate = {
      ...date,
      month: date.month ? month.toString() : '',
      day: date.day ? day.toString() : '',
    };
    setDate(newDate);
    // onDateChange(newDate);
  }
  setAdjusting(false);
};

/* Validate the date */
const validateDateSync = (date, flag, cal) => {
  // console.log('Validating...', date);
  let newDateError = { general: '', year: '', month: '', day: '' };
  const ephDateMin = cal === 'j' ? EPH_DATE_MIN_JULIAN : EPH_DATE_MIN;
  const ephDateMax = cal === 'j' ? EPH_DATE_MAX_JULIAN : EPH_DATE_MAX;

  for (let key of ['year', 'month', 'day']) {
    if (!/^-?\d*$/.test(date[key])) {
      return { ...newDateError, [key]: `The ${key} must be an integer.` };
    }
  }

  if (date.year) {
    const year = parseInt(date.year);
    const month = parseInt(date.month);
    const day = parseInt(date.day);

    if (
      (year < ephDateMin[0] ||
        (year === ephDateMin[0] && (flag ||
          month < ephDateMin[1] || (month === ephDateMin[1] && day < ephDateMin[2])))) ||
      (year > ephDateMax[0] ||
        (year === ephDateMax[0] && (flag ||
          month > ephDateMax[1] || (month === ephDateMax[1] && day > ephDateMax[2]))))
    ) {
      return { ...newDateError, general: `Out of the ephemeris date range: ${dateToStr({ date: ephDateMin })} \u2013 ${dateToStr({ date: ephDateMax })} (${cal === 'j' ? 'Julian' : 'Gregorian'})` };
    }
  }

  return newDateError;
};

/* Clear any date-related errors */
const clearError = (setErrorMessage, setDateError) => {
  setErrorMessage((prev) => ({ ...prev, date: '' }));
  setDateError({ general: '', year: '', month: '', day: '' });
};

export {
  fetchDate,
  adjustDate,
  validateDateSync,
  clearError,
};
