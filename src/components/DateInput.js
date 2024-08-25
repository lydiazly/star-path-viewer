// src/components/DateInput.js
import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Stack, Typography } from '@mui/material';
import Config from '../Config';
import { useDateInput } from '../context/DateInputContext';
import { SET_DATE_FETCHING, SET_DATE_ERROR, SET_DATE_VALID } from '../context/dateInputActionTypes';
import { adjustDate, validateDateSync, fetchDate, clearDateError } from '../utils/dateInputUtils';
import CalendarToggle from './CalendarToggle';
import DateFields from './DateFields';
import QuickEntryAccordion from './QuickEntryAccordion';
import debounce from 'lodash/debounce';

const DateInput = ({ setErrorMessage, location }) => {
  // console.log('Rendering DateInput');
  const {
    date,
    flag,
    cal,  // '': Gregorian, 'j': Julian
    dateAdjusting,
    dateFetching,
    dateError,
    abortControllerRef,
    queryDateFromRef,  // 'click', 'change'
    latestDateRequest,
    dateDispatch,
  } = useDateInput();
  // const dateRef = useRef(date);
  // const flagRef = useRef(flag);
  const locationRef = useRef(location);

  /* Initialize */
  useEffect(() => {
    // clearError(setErrorMessage, setDateError);  // DEPRECATED
    clearDateError(dateDispatch, setErrorMessage);
    // dateRef.current = initialDate;
  }, [setErrorMessage, dateDispatch]);

  // useEffect(() => {
  //   if (!dateAdjusting && !dateFetching) {
  //     onDateChange({ ...date, flag, cal });
  //   }
  // }, [date, flag, cal, onDateChange, dateAdjusting, dateFetching]);  // DEPRECATED

  /* Reset error when user starts typing */
  useEffect(() => {
    // clearError(setErrorMessage, setDateError);  // DEPRECATED
    clearDateError(dateDispatch, setErrorMessage);
    // if (date.year && date.month && date.day) {
    //   dateDispatch({ type: 'SET_DATE_VALID', payload: true });
    // }
  }, [date, flag, cal, setErrorMessage, dateDispatch]);

  // useEffect(() => {
  //   dateRef.current = date;
  // }, [date]);

  // useEffect(() => {
  //   flagRef.current = flag;
  // }, [flag]);

  useEffect(() => {
    if (
      locationRef.current.lat !== location.lat ||
      locationRef.current.lng !== location.lng ||
      locationRef.current.tz !== location.tz
    ) {
      if (flag) {
        queryDateFromRef.current = 'change';
        // setFetching(true);  // DEPRECATED
        dateDispatch({ type: SET_DATE_FETCHING, payload: true });
      }
      locationRef.current = location;
    }
  }, [location, locationRef, flag, queryDateFromRef, dateDispatch]);

  const debouncedFetchDate = useMemo(
    () =>
      debounce(
        async (date, flag, locationRef, dateDispatch, setErrorMessage) => {
          // console.log("Last controller: ", abortControllerRef.current?.signal);
          if (abortControllerRef.current) {
            // console.log("Aborting...");
            abortControllerRef.current.abort();  // Cancel the previous request
          }
          const controller = new AbortController();
          // console.log("New controller: ", controller?.signal);
          abortControllerRef.current = controller;
          const requestId = ++latestDateRequest.current;  // Increment and capture the current request ID
          await fetchDate(
            date,
            flag,
            locationRef,
            dateDispatch,
            setErrorMessage,
            controller.signal,
            abortControllerRef,
            requestId,
            latestDateRequest
          );
          queryDateFromRef.current = '';
        },
        Config.TypingDelay
      ),
    [abortControllerRef, latestDateRequest, queryDateFromRef]
  );

  const debouncedFetchDateDelayed = useMemo(
    () =>
      debounce(
        async (date, flag, locationRef, dateDispatch, setErrorMessage) => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();  // Cancel the previous request
          }
          const controller = new AbortController();
          abortControllerRef.current = controller;
          const requestId = ++latestDateRequest.current;  // Increment and capture the current request ID
          await fetchDate(
            date,
            flag,
            locationRef,
            dateDispatch,
            setErrorMessage,
            controller.signal,
            abortControllerRef,
            requestId,
            latestDateRequest
          );
        },
        Config.TypingDelay + 300
      ),
    [abortControllerRef, latestDateRequest]
  );

  const debouncedAdjustDate = useMemo(
    () => debounce(adjustDate, Config.TypingDelay),
    []
  );

  const debouncedValidateDate = useMemo(
    () =>
      debounce((date, flag, cal) => {
        const validationResult = validateDateSync(date, flag, cal);
        const isValid = !Object.values(validationResult).some((item) => !!item);
        // setDateError(validationResult);  // DEPRECATED
        dateDispatch({ type: SET_DATE_ERROR, payload: validationResult });
        if (!flag || (date.year && locationRef.current.lat && locationRef.current.lng)) {
          dateDispatch({ type: SET_DATE_VALID, payload: isValid });
        }
      }, Config.TypingDelay),
    [locationRef, dateDispatch]
  );

  useEffect(() => {
    if (dateFetching) {  // start fetching
      if (queryDateFromRef.current === 'click') {
        debouncedFetchDate(date, flag, locationRef, dateDispatch, setErrorMessage);
      } else {
        debouncedFetchDateDelayed(date, flag, locationRef, dateDispatch, setErrorMessage);
      }
    }
    /* Cleanup function */
    return () => {
      debouncedFetchDate.cancel();
    };
  }, [date, flag, locationRef, dateFetching, queryDateFromRef, debouncedFetchDate, debouncedFetchDateDelayed, setErrorMessage, dateDispatch]);

  useEffect(() => {
    if (dateAdjusting) {  // start adjusting
      debouncedAdjustDate(date, cal, dateDispatch);
    }
    /* Cleanup function */
    return () => {
      debouncedAdjustDate.cancel();
    };
  }, [date, cal, dateAdjusting, debouncedAdjustDate, dateDispatch]);

  useEffect(() => {
    if (!dateAdjusting && !dateFetching && !abortControllerRef.current) {
      debouncedValidateDate(date, flag, cal);
    }
    /* Cleanup function */
    return () => {
      debouncedValidateDate.cancel();
    };
  }, [date, flag, cal, dateAdjusting, dateFetching, abortControllerRef, debouncedValidateDate]);

  return (
    <Stack direction="column">
      <div>
        <CalendarToggle />
        <DateFields />

        {dateError.general && (
          <Typography color="error" variant="body2" sx={{ marginTop: '4px', marginX: '14px', fontSize: '0.85rem', textAlign: 'left' }}>
            {dateError.general}
          </Typography>
        )}
      </div>

      <div>
        <QuickEntryAccordion />
      </div>
    </Stack>
  );
};

DateInput.propTypes = {
  setErrorMessage: PropTypes.func.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.string.isRequired,
    lng: PropTypes.string.isRequired,
  }).isRequired,
};

export default React.memo(DateInput);
