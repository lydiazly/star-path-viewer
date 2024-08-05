// src/components/DateInput.js
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Stack, TextField, MenuItem, RadioGroup, Radio, FormControl, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MONTHS, EPH_DATE_MIN, EPH_DATE_MAX, EPH_DATE_MIN_JULIAN, EPH_DATE_MAX_JULIAN, EQX_SOL_NAMES } from '../utils/constants';
import { dateToStr } from '../utils/dateUtils';
import Config from '../Config';
import CustomToggleButton from './ui/CustomToggleButton';
import CustomFormControlLabel from './ui/CustomFormControlLabel';
import debounce from 'lodash/debounce';
import { fetchEquinoxSolstice } from '../utils/fetchEquinoxSolstice';

/* Adjust the date */
const adjustDate = (date, flag, cal, locationRef, setDate, setDisabledMonths, setLastDay, onDateChange, setAdjusting, setErrorMessage) => {
  console.log('Adjusting...', date);
  // const date = dateRef.current;
  // const flag = flagRef.current;
  const location = locationRef.current;
  if (!date.year) {
    setAdjusting(false);
    return;
  }

  const year = parseInt(date.year);
  let month = parseInt(date.month) || 1;
  let day = parseInt(date.day) || 1;

  /* Get the date for the equinox/solstice of the given year -----------------*/
  if (flag) {
    if (!location.lat || !location.lng || year <= EPH_DATE_MIN[0] || year >= EPH_DATE_MAX[0]) {
      setAdjusting(false);
      return;
    }

    fetchEquinoxSolstice(location.lat, location.lng, year, flag)
      .then(({ month: newMonth, day: newDay }) => {
        month = newMonth;
        day = newDay;
        /* Reset the month and the day if needed */
        const newDate = {
          ...date,
          month: flag || date.month ? month.toString() : '',
          day: flag || date.day ? day.toString() : '',
        };
        setDate(newDate);
        setAdjusting(false);
      })
      .catch((error) => {
        setErrorMessage({ date: error.message });
        setAdjusting(false);
      });

    // try {
    //   const { month: newMonth, day: newDay } = await fetchEquinoxSolstice(location.lat, location.lng, year, flag);
    //   month = newMonth;
    //   day = newDay;
    // } catch (error) {
    //   setErrorMessage({ date: error.message });
    //   setAdjusting(false);
    //   return;
    // }

  /* Adjust the date ---------------------------------------------------------*/
  } else {
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

    /* Reset the month and the day if needed */
    if (month.toString() !== date.month || day.toString() !== date.day) {
      const newDate = {
        ...date,
        month: flag || date.month ? month.toString() : '',
        day: flag || date.day ? day.toString() : '',
      };
      setDate(newDate);
      // onDateChange(newDate);
    }
    setAdjusting(false);
  }
};

/* Validate the date */
const validateDateSync = (date, flag, cal) => {
  console.log('Validating...', date);
  // console.log(`get date: '${date.year}' '${date.month}' '${date.day}' '${flag}'`);
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

const DateInput = ({ onDateChange, setErrorMessage, setDateValid, fieldError, setFieldError, location }) => {
  // console.log('Rendering DateInput');
  const [date, setDate] = useState({ year: '', month: '', day: '' });
  const [flag, setFlag] = useState('');
  const [cal, setCal] = useState('');  // '': Gregorian, 'j': Julian
  const [disabledMonths, setDisabledMonths] = useState({});
  const [lastDay, setLastDay] = useState(31);
  const [adjusting, setAdjusting] = useState(false);
  const [dateError, setDateError] = useState({ general: '', year: '', month: '', day: '' });
  // const dateRef = useRef(date);
  // const flagRef = useRef(flag);
  const locationRef = useRef(location);

  const clearError = useCallback(() => {
    setErrorMessage((prev) => ({ ...prev, date: '' }));
    setDateError({ general: '', year: '', month: '', day: '' });
  }, [setErrorMessage]);

  /* Initialize */
  useEffect(() => {
    clearError();
    // const now = new Date();
    // const initialDate = {
    //   year: now.getFullYear().toString(),
    //   month: (now.getMonth() + 1).toString(),
    //   day: now.getDate().toString(),
    // };
    // setDate(initialDate);
    // dateRef.current = initialDate;
  }, [clearError]);

  useEffect(() => {
    if (!adjusting) {
      onDateChange({ ...date, flag, cal});
    }
  }, [date, flag, cal, onDateChange, adjusting]);

  /* Reset error when user starts typing */
  useEffect(() => {
    clearError();
    // setDateValid(true);
    if (date.year && date.month && date.day) {
      setDateValid(true);
    }
  }, [date, flag, cal, setErrorMessage, clearError, setDateValid]);

  useEffect(() => {
    setFieldError((prev) => ({ ...prev, year: '' }));
  }, [date.year, flag, cal, setFieldError]);

  useEffect(() => {
    setFieldError((prev) => ({ ...prev, month: '' }));
  }, [date.month, flag, cal, setFieldError]);

  useEffect(() => {
    setFieldError((prev) => ({ ...prev, day: '' }));
  }, [date.day, flag, cal, setFieldError]);

  // useEffect(() => {
  //   dateRef.current = date;
  // }, [date]);

  // useEffect(() => {
  //   flagRef.current = flag;
  // }, [flag]);

  useEffect(() => {
    if (locationRef.current.lat !== location.lat || locationRef.current.lng !== location.lng) {
      setAdjusting(true);
      locationRef.current = location;
    }
  }, [location]);

  const handleCalChange = useCallback((event) => {
    /* Keep the date values */
    setCal(event.target.value);
  }, []);

  const handleFlagChange = useCallback((event, newFlag) => {
    if (flag === newFlag) {
      setFlag('');  // deselect
      // onDateChange({ ...date, flag: '' });
    } else {
      setFlag(newFlag);  // select another
      if (newFlag) {
        setCal('');  // Force to use Gregorian
        // onDateChange({ ...date, flag: newFlag, cal: '' });
      }
      // else {
      //   onDateChange({ ...date, flag: newFlag });
      // }
    }
    setAdjusting(true);
  }, [flag]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setDate((prev) => ({ ...prev, [name]: value }));
    setAdjusting(true);
  }, []);

  const debouncedAdjustDate = useMemo(
    () => debounce(adjustDate, Config.TypingDebouncePeriod),
    []
  );

  const debouncedValidateDate = useMemo(
    () => debounce((date, flag, cal) => {
      const validationResult = validateDateSync(date, flag, cal);
      const isValid = !Object.values(validationResult).some(item => !!item);
      setDateError(validationResult);
      setDateValid(isValid);
    }, Config.TypingDebouncePeriod),
    [setDateValid]
  );

  useEffect(() => {
    if (adjusting) {  // start adjusting
      debouncedAdjustDate(date, flag, cal, locationRef, setDate, setDisabledMonths, setLastDay, onDateChange, setAdjusting, setErrorMessage);
    }
    /* Cleanup function */
    return () => {
      debouncedAdjustDate.cancel();
    };
  }, [date, flag, cal, adjusting, onDateChange, debouncedAdjustDate, setErrorMessage]);

  useEffect(() => {
    if (!adjusting) {
      debouncedValidateDate(date, flag, cal);
    }
    /* Cleanup function */
    return () => {
      debouncedValidateDate.cancel();
    };
  }, [date, flag, cal, adjusting, debouncedValidateDate]);

  return (
    <Stack direction="column">
      <div>
        <FormControl>
          <RadioGroup
            row
            sx={{ marginTop: -1, marginBottom: 1, justifyContent: 'space-around' }}
            value={cal}
            onChange={handleCalChange}
          >
            <CustomFormControlLabel
              size="small"
              value=""
              control={<Radio />}
              label="Gregorian Calendar"
              checked={cal === ''}
            />
            <CustomFormControlLabel
              size="small"
              value="j"
              control={<Radio disabled={!!flag} />}
              label="Julian Calendar"
              checked={cal === 'j'}
            />
          </RadioGroup>
        </FormControl>

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
                  'backgroundColor': !flag ? null : '#f5f5f5',
                },
              }}
            >
              <MenuItem key="none" value="" sx={{ color: 'GrayText' }}>-- Select a month --</MenuItem>
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
                  'backgroundColor': !flag ? null : '#f5f5f5',
                },
              }}
            />
          </Grid>
        </Grid>

        {!!dateError.general && (
          <Typography color="error" variant="body2" sx={{ marginTop: '4px', marginX: '14px', fontSize: '0.85rem', textAlign: 'left' }}>
            {dateError.general}
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
  fieldError: PropTypes.shape({
    year: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired,
  }).isRequired,
  setFieldError: PropTypes.func.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.string.isRequired,
    lng: PropTypes.string.isRequired,
  }).isRequired,
};

export default React.memo(DateInput);
