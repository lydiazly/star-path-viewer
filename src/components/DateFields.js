// src/components/DateFields.js
import React, { useCallback } from 'react';
import { Grid, TextField, MenuItem, InputAdornment, CircularProgress } from '@mui/material';
import { useDateInput } from '../context/DateInputContext';
import { MONTHS } from '../utils/constants';

const DateFields = ({ dateError, fieldError }) => {
  const {
    date, setDate,
    flag,
    disabledMonths,
    lastDay,
    setAdjusting,
    fetching, setFetching,
    fetchingFromRef,
  } = useDateInput();

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setDate((prev) => ({ ...prev, [name]: value }));
    if (!flag) {
      setAdjusting(true);
    } else {
      fetchingFromRef.current = 'change';
      setFetching(true);
      // setDateValid(false);
    }
  }, [flag, fetchingFromRef, setDate, setAdjusting, setFetching]);

  return (
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
          error={!!dateError.year || !!fieldError.year}
          helperText={dateError.year || fieldError.year}
        />
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <TextField
          required
          select
          label="Month"
          InputLabelProps={{ htmlFor: 'month-select' }}
          inputProps={{ id: 'month-select' }}
          size="small"
          variant="outlined"
          name="month"
          value={date.month}
          onChange={handleInputChange}
          disabled={!!flag}
          fullWidth
          error={!!dateError.month || !!fieldError.month}
          helperText={dateError.month || fieldError.month}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: !flag ? null : '#f5f5f5',
            },
          }}
          InputProps={{
            endAdornment: date.year && fetching ? (
              <InputAdornment position="end" sx={{ mr: 2 }}>
                <CircularProgress size={20} sx={{ color: 'action.disabled' }} />
              </InputAdornment>
            ) : null,
          }}
        >
          <MenuItem key="none" value="" sx={{ color: 'action.active' }}>-- Select a month --</MenuItem>
          {MONTHS.slice(1).map((month, index) => (
            <MenuItem key={index} value={(index + 1).toString()} disabled={!!disabledMonths[index + 1]}>
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
          disabled={!!flag}
          fullWidth
          error={!!dateError.day || !!fieldError.day}
          helperText={dateError.day || fieldError.day}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: !flag ? null : '#f5f5f5',
            },
          }}
          InputProps={{
            endAdornment: date.year && fetching ? (
              <InputAdornment position="end">
                <CircularProgress size={20} sx={{ color: 'action.disabled' }} />
              </InputAdornment>
            ) : null,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default React.memo(DateFields);
