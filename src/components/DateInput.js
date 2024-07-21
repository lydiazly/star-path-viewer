// src/components/DateInput.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

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


const DateInput = ({ onDateChange }) => {
  const [date, setDate] = useState({ year: '', month: '', day: '' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const newDate = { ...date, [name]: value };
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <div>
      <TextField
        label="Year"
        variant="outlined"
        name="year"
        type="number"
        value={date.year}
        onChange={handleInputChange}
      />
      <TextField
        select
        label="Month"
        variant="outlined"
        name="month"
        value={date.month}
        onChange={handleInputChange}
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
      />
    </div>
  );
};

export default DateInput;
