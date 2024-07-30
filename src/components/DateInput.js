// src/components/DateInput.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Stack, TextField, MenuItem, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { MONTHS, EPH_DATE_MIN, EPH_DATE_MAX } from '../utils/constants';
import { dateToStr } from '../utils/dateUtils';
import Config from '../Config';
import debounce from 'lodash/debounce';

/* Adjust the date */
const adjustDate = (dateRef, setDate, setDisabledMonths, setLastDay, onDateChange, setAdjusting) => {
  const date = dateRef.current;
  const year = parseInt(date.year) || new Date().getFullYear();
  let month = parseInt(date.month) || 1;
  let day = parseInt(date.day) || 1;
  const newDisabledMonths = {};
  let dayMin = 1;
  let dayMax = 31;

  /* Reset the last day of a month */
  if (month === 2) {
    dayMax = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
  } else if ([4, 6, 9, 11].includes(month)) {
    dayMax = 30;
  }
  setLastDay(dayMax);

  if (year) {
    /* Enable all month options before EPH_DATE_MIN */
    Object.keys(newDisabledMonths).forEach((key) => {
      newDisabledMonths[key] = false;
    });

    if (year === EPH_DATE_MIN[0]) {
      /* Disable the month options before EPH_DATE_MIN */
      for (let i = EPH_DATE_MIN[1] - 1; i >= 1; i--) {
        newDisabledMonths[i] = true;
      }

      if (month <= EPH_DATE_MIN[1]) {
        month = EPH_DATE_MIN[1];
        dayMin = EPH_DATE_MIN[2];
      }
    } else if (year === EPH_DATE_MAX[0]) {
      /* Disable the month options after EPH_DATE_MAX */
      for (let i = EPH_DATE_MAX[1] + 1; i <= 12; i++) {
        newDisabledMonths[i] = true;
      }

      if (month >= EPH_DATE_MAX[1]) {
        month = EPH_DATE_MAX[1];
        dayMax = EPH_DATE_MAX[2];
      } else if (month === EPH_DATE_MAX[1]) {
        dayMax = EPH_DATE_MAX[2];
      }
    }

    setDisabledMonths(newDisabledMonths);
  }

  if (day < dayMin) {
    day = dayMin;
  }
  if (day > dayMax) {
    day = dayMax;
  }

  if (month.toString() !== date.month || day.toString() !== date.day) {
    const newDate = { ...date, month: month.toString(), day: day.toString() };
    setDate(newDate);
    onDateChange(newDate);
  }

  setAdjusting(false);
};

/* Validate the date */
const validateDateSync = (date) => {
  // console.log(`get date: '${date.year}' '${date.month}' '${date.day}'`);
  let newDateError = {
    general: { valid: true, error: '' },
    year: { valid: true, error: '' },
    month: { valid: true, error: '' },
    day: { valid: true, error: '' }
  };

  for (let key of ['year', 'month', 'day']) {
    if (!date[key]) {
      // setErrorMessage(`Please enter a ${key}.`);
      return { ...newDateError, [key]: { valid: false, error: `Please enter a ${key}.` } };
    }
    if (!/^-?\d*$/.test(date[key])) {
      // setErrorMessage(`The ${key} must be an integer.`);
      return { ...newDateError, [key]: { valid: false, error: `The ${key} must be an integer.` } };
    }
  }

  const year = parseInt(date.year);
  const month = parseInt(date.month);
  const day = parseInt(date.day);

  if (
    (year < EPH_DATE_MIN[0] ||
      (year === EPH_DATE_MIN[0] && (month < EPH_DATE_MIN[1] || (month === EPH_DATE_MIN[1] && day < EPH_DATE_MIN[2])))) ||
    (year > EPH_DATE_MAX[0] ||
      (year === EPH_DATE_MAX[0] && (month > EPH_DATE_MAX[1] || (month === EPH_DATE_MAX[1] && day > EPH_DATE_MAX[2]))))
  ) {
    // setErrorMessage(`Out of the ephemeris date range: ${dateToStr({ date: EPH_DATE_MIN })} \u2013 ${dateToStr({ date: EPH_DATE_MAX })}`);
    return { ...newDateError, general: { valid: false, error: `Out of the ephemeris date range: ${dateToStr({ date: EPH_DATE_MIN })} \u2013 ${dateToStr({ date: EPH_DATE_MAX })}` } };
  }
  // setErrorMessage('');
  return newDateError;
};

const DateInput = ({ onDateChange, setErrorMessage, setDateValid }) => {
  const [date, setDate] = useState({ year: '2000', month: '1', day: '1' });
  const [disabledMonths, setDisabledMonths] = useState({});
  const [lastDay, setLastDay] = useState(31);
  const [adjusting, setAdjusting] = useState(false);
  const [dateError, setDateError] = useState({
    general: { valid: true, error: '' },
    year: { valid: true, error: '' },
    month: { valid: true, error: '' },
    day: { valid: true, error: '' }
  });
  const dateRef = useRef(date);

  /* Initiate with the current date */
  useEffect(() => {
    const now = new Date();
    const initialDate = {
      year: now.getFullYear().toString(),
      month: (now.getMonth() + 1).toString(),
      day: now.getDate().toString(),
    };
    setDate(initialDate);
    dateRef.current = initialDate;
    onDateChange(initialDate);
    setDateValid(true);
  }, [onDateChange, setDateValid]);

  useEffect(() => {
    dateRef.current = date;
  }, [date]);

  useEffect(() => {
    setErrorMessage('');
  }, [date, setErrorMessage]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const newDate = { ...date, [name]: value.toString() };
    setDate(newDate);
    onDateChange(newDate);
    setDateValid(true);
    setAdjusting(true);
    setDateError({
      general: { valid: true, error: '' },
      year: { valid: true, error: '' },
      month: { valid: true, error: '' },
      day: { valid: true, error: '' }
    });  // Reset error when user starts typing
  };

  const debouncedAdjustDate = useMemo(
    () => debounce(adjustDate),
    []
  );

  const debouncedValidateDate = useMemo(
    () => debounce((date) => {
      const validationResult = validateDateSync(date);
      const isValid = !Object.values(validationResult).some(item => !item.valid);
      setDateError(validationResult);
      setDateValid(isValid);
    }, Config.typingTimeout),
    [setDateValid]
  );

  useEffect(() => {
    if (adjusting) {  // start adjusting
      debouncedAdjustDate(dateRef, setDate, setDisabledMonths, setLastDay, onDateChange, setAdjusting);
    }
    /* Cleanup function */
    return () => {
      debouncedAdjustDate.cancel();
    };
  }, [date.year, date.month, adjusting, onDateChange, debouncedAdjustDate]);

  useEffect(() => {
    if (!adjusting) {
      debouncedValidateDate(date);
    }

    /* Cleanup function */
    return () => {
      debouncedValidateDate.cancel();
    };
  }, [date, adjusting, debouncedValidateDate]);

  return (
    <Stack direction="column" spacing={2}>
      <div>
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              required
              label="Year"
              size="small"
              variant="outlined"
              name="year"
              type="number"
              value={date.year}
              inputProps={{ min: -5000, max: 5000 }}
              onChange={handleInputChange}
              fullWidth
              error={!dateError.year.valid}
              helperText={!dateError.year.valid && dateError.year.error}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              required
              select
              label="Month"
              size="small"
              variant="outlined"
              name="month"
              value={date.month}
              onChange={handleInputChange}
              fullWidth
              error={!dateError.month.valid}
              helperText={!dateError.month.valid && dateError.month.error}
            >
              {MONTHS.slice(1).map((month, index) => (
                <MenuItem key={index} value={index + 1} disabled={!!disabledMonths[index + 1]}>
                  {month.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              required
              label="Day"
              size="small"
              variant="outlined"
              name="day"
              type="number"
              value={date.day}
              onChange={handleInputChange}
              inputProps={{ min: 1, max: lastDay }}
              fullWidth
              error={!dateError.day.valid}
              helperText={!dateError.day.valid && dateError.day.error}
            />
          </Grid>

          {!dateError.general.valid && (
            <Grid item xs={12}>
              <Typography color="error" variant="body2">
                {dateError.general.error}
              </Typography>
            </Grid>
          )}

        </Grid>
      </div>

      <div>
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth>Vernal Equinox</Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth>Summer Solstice</Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth>Autumnal Equinox</Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" fullWidth>Winter Solstice</Button>
          </Grid>
        </Grid>
      </div>
    </Stack>
  );
};

DateInput.propTypes = {
  onDateChange: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setDateValid: PropTypes.func.isRequired,
};

export default DateInput;
