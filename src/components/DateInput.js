// src/components/DateInput.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TextField, MenuItem, Stack, Button } from '@mui/material';
import { MONTHS, EPH_DATE_MIN, EPH_DATE_MAX } from '../utils/constants';
import { dateToStr } from '../utils/dateUtils';
import Config from '../Config';
import debounce from 'lodash/debounce';

/* Adjust the date */
const adjustDate = (dateRef, setDate, setDisabledMonths, setLastDay, onDateChange, setAdjusting) => {
  const date = dateRef.current;
  const year = parseInt(date.year);
  let month = parseInt(date.month);
  let day = parseInt(date.day);
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
const validateDate = (date, setErrorMessage) => {
  // console.log(`get date: '${date.year}' '${date.month}' '${date.day}'`);
  if (!date.year || !date.month || !date.day) {
    return;
  }

  if (!/^-?\d*$/.test(date.year)) {
    setErrorMessage('Year must be an integer.');
    return;
  }

  if (!/^-?\d*$/.test(date.day)) {
    setErrorMessage('Day must be an integer.');
    return;
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
    setErrorMessage(`Out of the ephemeris date range: ${dateToStr({ date: EPH_DATE_MIN })} \u2013 ${dateToStr({ date: EPH_DATE_MAX })}`);
    return false;
  }
  return true;
};

const DateInput = ({ onDateChange, setErrorMessage }) => {
  const [date, setDate] = useState({ year: '', month: '', day: '' });
  const [disabledMonths, setDisabledMonths] = useState({});
  const [lastDay, setLastDay] = useState(31);
  const [adjusting, setAdjusting] = useState(false);
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
  }, [onDateChange]);

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
    setAdjusting(true);
  };

  const debouncedAdjustDate = useMemo(
    () =>
      debounce(
        (dateRef, setDate, setDisabledMonths, setLastDay, onDateChange, setAdjusting) => {
          adjustDate(dateRef, setDate, setDisabledMonths, setLastDay, onDateChange, setAdjusting);
        }, Config.typingTimeout
      ),
    []
  );

  const debouncedValidateDate = useMemo(
    () =>
      debounce(
        (date, setErrorMessage) => {
          validateDate(date, setErrorMessage);
        }, Config.typingTimeout
      ),
    []
  );

  useEffect(() => {
    if (adjusting) {  // start adjusting
      debouncedAdjustDate(dateRef, setDate, setDisabledMonths, setLastDay, onDateChange, setAdjusting);
    }
    /* Cleanup function */
    return () => {
      debouncedAdjustDate.cancel();
    };
  }, [date.year, date.month, onDateChange, debouncedAdjustDate, adjusting]);

  useEffect(() => {
    if (!adjusting) {
      debouncedValidateDate(date, setErrorMessage);
    }

    /* Cleanup function */
    return () => {
      debouncedValidateDate.cancel();
    };
  }, [date, setErrorMessage, debouncedValidateDate, adjusting]);

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Year"
          size="small"
          variant="outlined"
          name="year"
          type="number"
          value={date.year}
          inputProps={{ min: -5000, max: 5000 }}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          select
          label="Month"
          size="small"
          variant="outlined"
          name="month"
          value={date.month}
          onChange={handleInputChange}
          fullWidth
        >
          {MONTHS.slice(1).map((month, index) => (
            <MenuItem key={index} value={index + 1} disabled={!!disabledMonths[index + 1]}>
              {month.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Day"
          size="small"
          variant="outlined"
          name="day"
          type="number"
          value={date.day}
          onChange={handleInputChange}
          inputProps={{ min: 1, max: lastDay }}
          fullWidth
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" fullWidth>Vernal Equinox</Button>
        <Button variant="contained" fullWidth>Summer Solstice</Button>
        <Button variant="contained" fullWidth>Autumnal Equinox</Button>
        <Button variant="contained" fullWidth>Winter Solstice</Button>
      </Stack>
    </Stack>
  );
};

export default DateInput;
