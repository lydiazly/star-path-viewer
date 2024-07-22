// src/components/DateInput.js
import React, { useState } from 'react';
import { TextField, MenuItem, Stack, Box } from '@mui/material';
import { MONTHS } from '../utils/constants';

const DateInput = ({ onDateChange }) => {
  const [date, setDate] = useState({ year: '', month: '', day: '' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const newDate = { ...date, [name]: value };
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2} direction="row" sx={{ width: '100%', marginTop: 2, justifyContent: 'center' }}>
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
    </Box>
  );
};

export default DateInput;
