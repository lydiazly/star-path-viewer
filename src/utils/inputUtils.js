// src/utils/inputUtils.js
import * as actionTypes from '../context/dateInputActionTypes';

/* Validate location */
const validateLocationInputSync = (location, setLocationFieldError, setLocationValid) => {
  if (location.type === 'address' && !location.id) {
    setLocationFieldError((prev) => ({ ...prev, address: 'Please search and select a location.' }));
    setLocationValid(false);
    return false;
  } else if (!location.lat || !location.lng) {
    if (!location.lat) {
      setLocationFieldError((prev) => ({ ...prev, lat: 'Please enter a latitude.' }));
    }
    if (!location.lng) {
      setLocationFieldError((prev) => ({ ...prev, lng: 'Please enter a longitude.' }));
    }
    setLocationValid(false);
    return false;
  }
  return true;
};

/* Validate date */
const validateDateInputSync = (date, flag, dateDispatch) => {
  if (flag) {
    if (!date.year) {
      dateDispatch({ type: actionTypes.SET_YEAR_NULL_ERROR });
      dateDispatch({ type: actionTypes.SET_DATE_VALID, payload: false });
      return false;
    }
  } else if (!date.year || !date.month || !date.day) {
    if (!date.year) {
      dateDispatch({ type: actionTypes.SET_YEAR_NULL_ERROR });
    }
    if (!date.month) {
      dateDispatch({ type: actionTypes.SET_MONTH_NULL_ERROR });
    }
    if (!date.day) {
      dateDispatch({ type: actionTypes.SET_DAY_NULL_ERROR });
    }
    dateDispatch({ type: actionTypes.SET_DATE_VALID, payload: false });
    return false;
  }
  return true;
};

/* Validate star */
const validateStarInputSync = (star, setStarFieldError, setStarValid) => {
  if (star.type === 'name' && !star.name) {
    setStarFieldError((prev) => ({ ...prev, name: 'Please select a planet.' }));
    setStarValid(false);
    return false;
  } else if (star.type === 'hip' && !star.hip) {
    setStarFieldError((prev) => ({ ...prev, hip: 'Please enter a Hipparchus catalogue number.' }));
    setStarValid(false);
    return false;
  } else if (star.type === 'radec' && (!star.ra || !star.dec)) {
    if (!star.ra) {
      setStarFieldError((prev) => ({ ...prev, ra: 'Please enter a right ascension.' }));
    }
    if (!star.dec) {
      setStarFieldError((prev) => ({ ...prev, dec: 'Please enter a declination.' }));
    }
    setStarValid(false);
    return false;
  }
  return true;
};

/* Validate the input */
const validateInputSync = (
  location,
  date, flag,
  star,
  dateDispatch,
  setLocationFieldError,
  setStarFieldError,
  setLocationValid,
  setStarValid
) => {
  const isLocationValid = validateLocationInputSync(location, setLocationFieldError, setLocationValid);
  const isDateValid = validateDateInputSync(date, flag, dateDispatch);
  const isStarValid = validateStarInputSync(star, setStarFieldError, setStarValid);
  return isLocationValid && isDateValid && isStarValid;
};

/* Clear any field errors */
const clearFieldError = (dateDispatch, setLocationFieldError, setStarFieldError) => {
  setLocationFieldError({ address: '', lat: '', lng: '' });
  dateDispatch({ type: actionTypes.CLEAR_DATE_NULL_ERROR });
  setStarFieldError({ name: '', hip: '', ra: '', dec: '' });
};

export {
  validateLocationInputSync,
  validateDateInputSync,
  validateStarInputSync,
  validateInputSync,
  clearFieldError,
};
