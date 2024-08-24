// src/components/DateInput.js
import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Stack, Typography } from '@mui/material';
import Config from '../Config';
import { useDateInput } from '../context/DateInputContext';
import { adjustDate, validateDateSync, fetchDate, clearError } from '../utils/dateInputUtils';
import CalendarToggle from './CalendarToggle';
import DateFields from './DateFields';
import QuickEntryAccordion from './QuickEntryAccordion';
import debounce from 'lodash/debounce';


const DateInput = ({ onDateChange, setErrorMessage, setDateValid, fieldError, setFieldError, location }) => {
  // console.log('Rendering DateInput');
  const {
    date, setDate,
    flag,
    cal,  // '': Gregorian, 'j': Julian
    setDisabledMonths,
    setLastDay,
    adjusting, setAdjusting,
    fetching, setFetching,
    dateError, setDateError,
    abortControllerRef,
    fetchingFromRef,  // 'click', 'change'
    latestRequest,
  } = useDateInput();
  // const dateRef = useRef(date);
  // const flagRef = useRef(flag);
  const locationRef = useRef(location);

  /* Initialize */
  useEffect(() => {
    clearError(setErrorMessage, setDateError);
    // const now = new Date();
    // const initialDate = {
    //   year: now.getFullYear().toString(),
    //   month: (now.getMonth() + 1).toString(),
    //   day: now.getDate().toString(),
    // };
    // setDate(initialDate);
    // dateRef.current = initialDate;
  }, [setErrorMessage, setDateError]);

  useEffect(() => {
    if (!adjusting && !fetching) {
      onDateChange({ ...date, flag, cal });
    }
  }, [date, flag, cal, onDateChange, adjusting, fetching]);

  /* Reset error when user starts typing */
  useEffect(() => {
    clearError(setErrorMessage, setDateError);
    // if (date.year && date.month && date.day) {
    //   setDateValid(true);
    // }
  }, [date, flag, cal, setErrorMessage, setDateError]);

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
    if (locationRef.current.lat !== location.lat || locationRef.current.lng !== location.lng || locationRef.current.tz !== location.tz) {
      if (flag) {
        fetchingFromRef.current = 'change';
        setFetching(true);
      }
      locationRef.current = location;
    }
  }, [location, locationRef, flag, fetchingFromRef, setFetching]);

  const debouncedFetchDate = useMemo(
    () => debounce(async (date, flag, locationRef, setDate, setFetching, setErrorMessage, setDateValid) => {
      // console.log("Last controller: ", abortControllerRef.current?.signal);
      if (abortControllerRef.current) {
        // console.log("Aborting...");
        abortControllerRef.current.abort();  // Cancel the previous request
      }
      const controller = new AbortController();
      // console.log("New controller: ", controller?.signal);
      abortControllerRef.current = controller;
      const requestId = ++latestRequest.current; // Increment and capture the current request ID
      await fetchDate(date, flag, locationRef, setDate, setFetching, setErrorMessage, setDateValid, controller.signal, abortControllerRef, requestId, latestRequest);
      fetchingFromRef.current = '';
    }, Config.TypingDelay),
    [abortControllerRef, latestRequest, fetchingFromRef]
  );

  const debouncedFetchDateDelayed = useMemo(
    () => debounce(async (date, flag, locationRef, setDate, setFetching, setErrorMessage, setDateValid) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();  // Cancel the previous request
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const requestId = ++latestRequest.current; // Increment and capture the current request ID
      await fetchDate(date, flag, locationRef, setDate, setFetching, setErrorMessage, setDateValid, controller.signal, abortControllerRef, requestId, latestRequest);
    }, Config.TypingDelay + 300),
    [abortControllerRef, latestRequest]
  );

  const debouncedAdjustDate = useMemo(
    () => debounce(adjustDate, Config.TypingDelay),
    []
  );

  const debouncedValidateDate = useMemo(
    () => debounce((date, flag, cal) => {
      const validationResult = validateDateSync(date, flag, cal);
      const isValid = !Object.values(validationResult).some(item => !!item);
      setDateError(validationResult);
      if (!flag || (date.year && locationRef.current.lat && locationRef.current.lng)) {
        setDateValid(isValid);
      }
    }, Config.TypingDelay),
    [locationRef, setDateValid, setDateError]
  );

  useEffect(() => {
    if (fetching) {  // start fetching
      if (fetchingFromRef.current === 'click') {
        debouncedFetchDate(date, flag, locationRef, setDate, setFetching, setErrorMessage, setDateValid);
      } else {
        debouncedFetchDateDelayed(date, flag, locationRef, setDate, setFetching, setErrorMessage, setDateValid);
      }
    }
    /* Cleanup function */
    return () => {
      debouncedFetchDate.cancel();
    };
  }, [date, flag, locationRef, fetching, fetchingFromRef, debouncedFetchDate, debouncedFetchDateDelayed, setDate, setFetching, setErrorMessage, setDateValid]);

  useEffect(() => {
    if (adjusting) {  // start adjusting
      debouncedAdjustDate(date, cal, setDate, setDisabledMonths, setLastDay, setAdjusting);
    }
    /* Cleanup function */
    return () => {
      debouncedAdjustDate.cancel();
    };
  }, [date, cal, adjusting, debouncedAdjustDate, setDate, setDisabledMonths, setLastDay, setAdjusting]);

  useEffect(() => {
    if (!adjusting && !fetching && !abortControllerRef.current) {
      debouncedValidateDate(date, flag, cal);
    }
    /* Cleanup function */
    return () => {
      debouncedValidateDate.cancel();
    };
  }, [date, flag, cal, adjusting, fetching, abortControllerRef, debouncedValidateDate]);

  return (
    <Stack direction="column">
      <div>
        <CalendarToggle />
        <DateFields
          dateError={dateError}
          fieldError={fieldError}
        />

        {dateError.general && (
          <Typography color="error" variant="body2" sx={{ marginTop: '4px', marginX: '14px', fontSize: '0.85rem', textAlign: 'left' }}>
            {dateError.general}
          </Typography>
        )}
      </div>

      <div>
        <QuickEntryAccordion setDateValid={setDateValid} />
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
