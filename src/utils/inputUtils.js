// src/utils/inputUtils.js
import * as locationActionTypes from '../context/locationInputActionTypes';
import * as dateActionTypes from '../context/dateInputActionTypes';
import { TYPE_ADD } from './constants';

/* Validate the location */
const validateLocationInputSync = (location, inputType, locationDispatch) => {
  if (inputType === TYPE_ADD) {
    if (!location.id) {
      locationDispatch({ type: locationActionTypes.SET_ADDRESS_NULL_ERROR });
      locationDispatch({ type: locationActionTypes.SET_LOCATION_VALID, payload: false });
      return false;
    }
  } else if (!location.lat || !location.lng) {
    if (!location.lat) {
      locationDispatch({ type: locationActionTypes.SET_LAT_NULL_ERROR });
    }
    if (!location.lng) {
      locationDispatch({ type: locationActionTypes.SET_LNG_NULL_ERROR });
    }
    locationDispatch({ type: locationActionTypes.SET_LOCATION_VALID, payload: false });
    return false;
  }
  return true;
};

/* Validate the date */
const validateDateInputSync = (date, flag, dateDispatch) => {
  if (flag) {
    if (!date.year) {
      dateDispatch({ type: dateActionTypes.SET_YEAR_NULL_ERROR });
      dateDispatch({ type: dateActionTypes.SET_DATE_VALID, payload: false });
      return false;
    }
  } else if (!date.year || !date.month || !date.day) {
    if (!date.year) {
      dateDispatch({ type: dateActionTypes.SET_YEAR_NULL_ERROR });
    }
    if (!date.month) {
      dateDispatch({ type: dateActionTypes.SET_MONTH_NULL_ERROR });
    }
    if (!date.day) {
      dateDispatch({ type: dateActionTypes.SET_DAY_NULL_ERROR });
    }
    dateDispatch({ type: dateActionTypes.SET_DATE_VALID, payload: false });
    return false;
  }
  return true;
};

/* Validate the star */
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
  location, inputType,
  date, flag,
  star,
  locationDispatch,
  dateDispatch,
  setStarFieldError,
  setStarValid
) => {
  const isLocationValid = validateLocationInputSync(location, inputType, locationDispatch);
  const isDateValid = validateDateInputSync(date, flag, dateDispatch);
  const isStarValid = validateStarInputSync(star, setStarFieldError, setStarValid);
  return isLocationValid && isDateValid && isStarValid;
};

/* Clear any null errors */
const clearNullError = (locationDispatch, dateDispatch, setStarFieldError) => {
  locationDispatch({ type: locationActionTypes.CLEAR_LOCATION_NULL_ERROR });
  dateDispatch({ type: dateActionTypes.CLEAR_DATE_NULL_ERROR });
  setStarFieldError({ name: '', hip: '', ra: '', dec: '' });
};

export {
  validateLocationInputSync,
  validateDateInputSync,
  validateStarInputSync,
  validateInputSync,
  clearNullError,
};
