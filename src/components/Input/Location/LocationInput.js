// src/components/Input/Location/LocationInput.js
import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Stack, Snackbar, Alert } from '@mui/material';
import Config from '../../../Config';
import { useLocationInput } from '../../../context/LocationInputContext';
import * as actionTypes from '../../../context/locationInputActionTypes';
import { TYPE_ADD, TYPE_COORD, ADD_UNKNOWN } from '../../../utils/constants';
import { validateLocationSync, clearLocationError } from '../../../utils/locationInputUtils';
import determineService from '../../../utils/determineService';
import LocationInputTypeToggle from './LocationInputTypeToggle';
import AddressInput from './AddressInput';
import CoordinatesInput from './CoordinatesInput';
import TimezoneFetcher from './TimezoneFetcher';
import debounce from 'lodash/debounce';

const alertStyle = { width: '100%', textAlign: 'left' };

const LocationInput = ({ setErrorMessage }) => {
  // console.log('Rendering LocationInput');
  const {
    location,  // id: ''(not-found), 'unknown'
    inputType,  // 'address' or 'coordinates'
    searchTerm,
    serviceChosen, setServiceChosen,
    latestTzRequest,
    locationDispatch,
  } = useLocationInput();

  /* Initialize */
  useEffect(() => {
    clearLocationError(locationDispatch, setErrorMessage);
    // fetchCurrentLocation(serviceChosen, locationDispatch, setErrorMessage);
  }, [locationDispatch, setErrorMessage]);

  // useEffect(() => {
  //   onLocationChange({ ...location, type: inputType });
  // }, [location, inputType, onLocationChange]);  // DEPRECATED

  /* Reset error when user starts typing */
  useEffect(() => {
    clearLocationError(locationDispatch, setErrorMessage);
    /* Clear address and tz if lat or lng is empty */
    if (searchTerm.trim() && inputType === TYPE_COORD && (!location.lat || !location.lng)) {
      locationDispatch({ type: actionTypes.CLEAR_SEARCH_TERM });
      locationDispatch({ type: actionTypes.CLEAR_SUGGESTIONS });
      locationDispatch({ type: actionTypes.SET_ID, payload: '' });
      locationDispatch({ type: actionTypes.SET_TZ, payload: '' });
    }
  }, [searchTerm, location, inputType, locationDispatch, setErrorMessage]);

  /* Clear tz if lat or lng is empty */
  useEffect(() => {
    if (location.tz && (!location.lat || !location.lng)) {
      locationDispatch({ type: actionTypes.SET_TZ, payload: '' });
    }
  }, [location, locationDispatch]);

  useEffect(() => {
    locationDispatch({ type: actionTypes.CLEAR_ADDRESS_NULL_ERROR });
  }, [searchTerm, inputType, locationDispatch]);

  useEffect(() => {
    locationDispatch({ type: actionTypes.CLEAR_LAT_NULL_ERROR });
  }, [location.lat, inputType, locationDispatch]);

  useEffect(() => {
    locationDispatch({ type: actionTypes.CLEAR_LNG_NULL_ERROR });
  }, [location.lng, inputType, locationDispatch]);

  /* Choose geocoding service */
  useEffect(() => {
    const setService = async () => {
      if (serviceChosen === null) {
          const service = await determineService();
          setServiceChosen(service);
      }
    };
    setService();
  }, [serviceChosen, setServiceChosen]);

  const debouncedValidateLocation = useMemo(
    () => debounce((inputType, location) => {
      const validationResult = validateLocationSync(inputType, location);
      const isValid = !Object.values(validationResult).some((item) => !!item);
      locationDispatch({ type: actionTypes.SET_LOCATION_ERROR, payload: validationResult });
      locationDispatch({ type: actionTypes.SET_LOCATION_VALID, payload: isValid });
    }, Config.TypingDelay / 2),
    [locationDispatch]
  );

  useEffect(() => {
    debouncedValidateLocation(inputType, location);
    /* Cleanup function */
    return () => {
      debouncedValidateLocation.cancel();
    };
  }, [location, inputType, debouncedValidateLocation]);

  const handleSnackbarClose = useCallback((event, reason) => {
    locationDispatch({ type: actionTypes.SET_ID, payload: '' });
  }, [locationDispatch]);

  return (
    <Stack direction="column" spacing={2}>
      <LocationInputTypeToggle />
      {inputType === TYPE_ADD ? (
        <AddressInput setErrorMessage={setErrorMessage} />
      ) : (
        <CoordinatesInput />
      )}
      <TimezoneFetcher
        lat={location.lat}
        lng={location.lng}
        latestTzRequest={latestTzRequest}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={location.id === ADD_UNKNOWN}
        autoHideDuration={12000}
        onClose={handleSnackbarClose}
        sx={(theme) => ({
          boxShadow: theme.shadows[2],
        })}
      >
        <Alert severity="warning" sx={alertStyle} onClose={handleSnackbarClose}>
          Sorry, we couldn't fetch the address, but you can use these coordinates for this location.
        </Alert>
      </Snackbar>
    </Stack>
  );
};

LocationInput.propTypes = {
  setErrorMessage: PropTypes.func.isRequired,
};

export default React.memo(LocationInput);
