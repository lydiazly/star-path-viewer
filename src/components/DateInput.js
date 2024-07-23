// src/components/DateInput.js
import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Stack } from '@mui/material';
import { MONTHS } from '../utils/constants';

const DateInput = ({ onDateChange, setErrorMessage }) => {
  const [date, setDate] = useState({ year: '', month: '', day: '' });
  // const now = new Date();

  useEffect(() => {
    setErrorMessage(null);
  }, [date, setErrorMessage]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const newDate = { ...date, [name]: value };
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <Stack direction='column' spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Year"
          variant="outlined"
          name="year"
          type="number"
          value={date.year}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          select
          label="Month"
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
