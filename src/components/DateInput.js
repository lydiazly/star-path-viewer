// src/components/DateInput.js
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Stack, TextField, MenuItem, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MONTHS, EPH_DATE_MIN, EPH_DATE_MAX, EQX_SOL_NAMES } from '../utils/constants';
import { dateToStr } from '../utils/dateUtils';
import Config from '../Config';
import CustomToggleButton from './ui/CustomToggleButton';
import debounce from 'lodash/debounce';
import { fetchEquinoxSolstice } from '../utils/fetchEquinoxSolstice';

/* Adjust the date */
const adjustDate = async (dateRef, flagRef, setDate, setDisabledMonths, setLastDay, onDateChange, setAdjusting, setErrorMessage) => {
  const date = dateRef.current;
  const flag = flagRef.current;
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

  if (flag && year > EPH_DATE_MIN[0] && year < EPH_DATE_MAX[0]) {
    /* Get the date for the equinox/solstice of the given year */
    try {
      const { month: newMonth, day: newDay } = await fetchEquinoxSolstice(year, flag);
      month = newMonth;
      day = newDay;
    } catch (error) {
      setAdjusting(false);
      setErrorMessage({ id: 'date', message: error.message });
      return;
    }
  }
  
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
const validateDateSync = (date, flag) => {
  // console.log(`get date: '${date.year}' '${date.month}' '${date.day}' '${flag}'`);
  let newDateError = {
    general: { valid: true, error: '' },
    year: { valid: true, error: '' },
    month: { valid: true, error: '' },
    day: { valid: true, error: '' },
  };

  for (let key of ['year', 'month', 'day']) {
    if (!date[key]) {
      return { ...newDateError, [key]: { valid: false, error: `Please enter a ${key}.` } };
    }
    if (!/^-?\d*$/.test(date[key])) {
      return { ...newDateError, [key]: { valid: false, error: `The ${key} must be an integer.` } };
    }
  }

  const year = parseInt(date.year);
  const month = parseInt(date.month);
  const day = parseInt(date.day);

  if (
    (year < EPH_DATE_MIN[0] || (flag && year === EPH_DATE_MIN[0]) ||
      (year === EPH_DATE_MIN[0] && (month < EPH_DATE_MIN[1] || (month === EPH_DATE_MIN[1] && day < EPH_DATE_MIN[2])))) ||
    (year > EPH_DATE_MAX[0] || (flag && year === EPH_DATE_MAX[0]) ||
      (year === EPH_DATE_MAX[0] && (month > EPH_DATE_MAX[1] || (month === EPH_DATE_MAX[1] && day > EPH_DATE_MAX[2]))))
  ) {
    return { ...newDateError, general: { valid: false, error: `Out of the ephemeris date range: ${dateToStr({ date: EPH_DATE_MIN })} \u2013 ${dateToStr({ date: EPH_DATE_MAX })}` } };
  }
  return newDateError;
};

const DateInput = ({ onDateChange, setErrorMessage, setDateValid }) => {
  const [date, setDate] = useState({ year: '2000', month: '1', day: '1' });
  const [flag, setFlag] = useState('');
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
  const flagRef = useRef(flag);

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
    flagRef.current = '';
    // onDateChange({ ...initialDate, flag: '' });
    setDateValid(true);
  }, [setDateValid]);

  useEffect(() => {
    if (!adjusting) {
      onDateChange({ ...date, flag });
    }
  }, [date, flag, onDateChange, adjusting]);

  useEffect(() => {
    setErrorMessage(null);
  }, [date, flag, setErrorMessage]);

  useEffect(() => {
    dateRef.current = date;
  }, [date]);

  useEffect(() => {
    flagRef.current = flag;
  }, [flag]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    const newDate = { ...date, [name]: value };
    setDate(newDate);
    // onDateChange({ ...newDate, flag });
    setDateValid(true);
    setDateError({
      general: { valid: true, error: '' },
      year: { valid: true, error: '' },
      month: { valid: true, error: '' },
      day: { valid: true, error: '' },
    });  // Reset error when user starts typing
    setAdjusting(true);
  }, [date, setDateValid]);

  const handleFlagChange = useCallback(async (event, newFlag) => {
    if (flag === newFlag) {
      setFlag('');  // deselect
      onDateChange({ ...date, flag: '' });
    } else {
      setFlag(newFlag);  // select another
      onDateChange({ ...date, flag: newFlag });
    }
    setDateValid(true);
    setDateError({
      general: { valid: true, error: '' },
      year: { valid: true, error: '' },
      month: { valid: true, error: '' },
      day: { valid: true, error: '' },
    });  // Reset error when user changes the flag
    setAdjusting(true);
  }, [date, flag, onDateChange, setDateValid]);

  const debouncedAdjustDate = useMemo(
    () => debounce(adjustDate),
    []
  );

  const debouncedValidateDate = useMemo(
    () => debounce((date, flag) => {
      const validationResult = validateDateSync(date, flag);
      const isValid = !Object.values(validationResult).some(item => !item.valid);
      setDateError(validationResult);
      setDateValid(isValid);
    }, Config.typingTimeout),
    [setDateValid]
  );

  useEffect(() => {
    if (adjusting) {  // start adjusting
      debouncedAdjustDate(dateRef, flagRef, setDate, setDisabledMonths, setLastDay, onDateChange, setAdjusting, setErrorMessage);
    }
    /* Cleanup function */
    return () => {
      debouncedAdjustDate.cancel();
    };
  }, [date.year, date.month, flag, adjusting, onDateChange, debouncedAdjustDate, setErrorMessage]);

  useEffect(() => {
    if (!adjusting) {
      debouncedValidateDate(date, flag);
    }
    /* Cleanup function */
    return () => {
      debouncedValidateDate.cancel();
    };
  }, [date, flag, adjusting, debouncedValidateDate]);

  return (
    <Stack direction="column">
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
              error={!dateError.year.valid || !dateError.general.valid}
              helperText={!dateError.year.valid && dateError.year.error}
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
              error={!dateError.month.valid || !dateError.general.valid}
              helperText={!dateError.month.valid && dateError.month.error}
              sx={{
                '& .MuiOutlinedInput-root': {
                  'backgroundColor': !flag ? null : '#f5f5f5',
                },
              }}
            >
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
              error={!dateError.day.valid || !dateError.general.valid}
              helperText={!dateError.day.valid && dateError.day.error}
              sx={{
                '& .MuiOutlinedInput-root': {
                  'backgroundColor': !flag ? null : '#f5f5f5',
                },
              }}
            />
          </Grid>
        </Grid>

        {!dateError.general.valid && (
          <Typography color="error" variant="body2" sx={{ marginTop: '4px', marginX: '14px', fontSize: '0.85rem', textAlign: 'left' }}>
            {dateError.general.error}
          </Typography>
        )}
      </div>

      <div>
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              minHeight: 0,
              '& .MuiAccordionSummary-content': {
                'marginY': 1,
              }
            }}
          >
            <Typography color="dimgray" variant="body1">
              Quick Entry
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: 1.5, paddingTop: 0, paddingBottom: 1.5 }}>
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
              {Object.entries(EQX_SOL_NAMES).map(([key, value]) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <CustomToggleButton
                    color="primary"
                    size="small"
                    value={key}
                    selected={flag === key}
                    onChange={handleFlagChange}
                    aria-label={value}
                    fullWidth
                  >
                    {value}
                  </CustomToggleButton>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
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
