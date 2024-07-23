// src/components/DateInput.js
import React, { useState, useEffect, useCallback } from 'react';
import { TextField, MenuItem, Stack } from '@mui/material';
import { MONTHS, EPH_DATE_MIN, EPH_DATE_MAX } from '../utils/constants';
import { dateToStr } from '../utils/dateUtils';

const DateInput = ({ onDateChange, setErrorMessage }) => {
  const [date, setDate] = useState({ year: '', month: '', day: '' });

  useEffect(() => {
    setErrorMessage(null);
  }, [date, setErrorMessage]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const newDate = { ...date, [name]: value };
    setDate(newDate);
    onDateChange(newDate);
  };

  const adjustDate = useCallback(() => {
    const year = parseInt(date.year) || new Date().getFullYear();
    const month = parseInt(date.month);
    let maxDay = 31;

    if (month === 2) {
      maxDay = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(month)) {
      maxDay = 30;
    }

    if (parseInt(date.day) > maxDay) {
      setDate((prevDate) => ({ ...prevDate, day: maxDay.toString() }));
    }

    if (year === EPH_DATE_MIN[0] && month < EPH_DATE_MIN[1]) {
      setDate((prevDate) => ({ ...prevDate, month: EPH_DATE_MIN[1].toString() }));
    } else if (year === EPH_DATE_MIN[0] && month === EPH_DATE_MIN[1] && parseInt(date.day) < EPH_DATE_MIN[2]) {
      setDate((prevDate) => ({ ...prevDate, day: EPH_DATE_MIN[2].toString() }));
    }

    if (year === EPH_DATE_MAX[0] && month > EPH_DATE_MAX[1]) {
      setDate((prevDate) => ({ ...prevDate, month: EPH_DATE_MAX[1].toString() }));
    } else if (year === EPH_DATE_MAX[0] && month === EPH_DATE_MAX[1] && parseInt(date.day) > EPH_DATE_MAX[2]) {
      setDate((prevDate) => ({ ...prevDate, day: EPH_DATE_MAX[2].toString() }));
    }
  }, [date]);

  const validateDate = useCallback(() => {
    const year = parseInt(date.year);
    const month = parseInt(date.month);
    const day = parseInt(date.day);
    
    if ((date.year && year.toString() !== date.year) || (date.day && day.toString() !== date.day)) {
      setErrorMessage('Year and day must be integers.');
      return;
    }

    if (
      (year < EPH_DATE_MIN[0] ||
        (year === EPH_DATE_MIN[0] && (month < EPH_DATE_MIN[1] || (month === EPH_DATE_MIN[1] && day < EPH_DATE_MIN[2])))) ||
      (year > EPH_DATE_MAX[0] ||
        (year === EPH_DATE_MAX[0] && (month > EPH_DATE_MAX[1] || (month === EPH_DATE_MAX[1] && day > EPH_DATE_MAX[2]))))
    ) {
      setErrorMessage(`Out of the ephemeris date range: ${dateToStr({ date: EPH_DATE_MIN })} \u2013 ${dateToStr({ date: EPH_DATE_MAX })}`);
      return false;
    }
    setErrorMessage(null);
    return true;
  }, [date, setErrorMessage]);

  useEffect(() => {
    adjustDate();
  }, [date.year, date.month, adjustDate]);

  useEffect(() => {
    validateDate();
  }, [date, validateDate]);

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
            <MenuItem key={index} value={index + 1}>
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
          inputProps={{ min: 1, max: 31 }}
          fullWidth
        />
      </Stack>
    </Stack>
  );
};

export default DateInput;
