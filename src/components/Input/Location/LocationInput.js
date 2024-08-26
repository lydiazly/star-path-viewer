// src/components/Input/Location/LocationInput.js
import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Stack, Snackbar, Alert } from '@mui/material';
import Config from '../../../Config';
import { useLocationInput } from '../../../context/LocationInputContext';
import { validateLocationSync, clearError } from '../../../utils/locationInputUtils';
import determineService from '../../../utils/determineService';
import LocationInputTypeToggle from './LocationInputTypeToggle';
import AddressInput from './AddressInput';
import CoordinatesInput from './CoordinatesInput';
import TimezoneFetcher from './TimezoneFetcher';
import debounce from 'lodash/debounce';

const LocationInput = ({ onLocationChange, setErrorMessage, setLocationValid, fieldError, setFieldError }) => {
  // console.log('Rendering LocationInput');
  const {
    inputType,  // 'address' or 'coordinates'
    location, setLocation,  // 0: not-found, -1: unknown
    searchTerm, setSearchTerm,
    setSuggestions,
    setLocationError,
    serviceChosen, setServiceChosen,
    latestTzRequest,
  } = useLocationInput();

  /* Initialize */
  useEffect(() => {
    clearError(setErrorMessage, setLocationError);
    // setLoadingLocation(true);
    // fetchCurrentLocation(serviceChosen, setSearchTerm, setInputType, setLocation, setErrorMessage);
    // setLoadingLocation(false);
  }, [setErrorMessage, setLocationError]);

  useEffect(() => {
    onLocationChange({ ...location, type: inputType });
  }, [location, inputType, onLocationChange]);

  /* Reset error when user starts typing */
  useEffect(() => {
    clearError(setErrorMessage, setLocationError);
    /* Clear address and tz if lat or lng is empty */
    if (searchTerm.trim() && inputType === 'coordinates' && (!location.lat || !location.lng)) {
      setSearchTerm('');
      setSuggestions([]);
      setLocation((prev) => ({ ...prev, id: '', tz: '' }));
    }
  }, [searchTerm, location, inputType, setLocation, setSearchTerm, setSuggestions, setErrorMessage, setLocationError]);

  /* Clear tz if lat or lng is empty */
  useEffect(() => {
    if (location.tz && (!location.lat || !location.lng)) {
      setLocation((prev) => ({ ...prev, tz: '' }));
    }
  }, [location, setLocation]);

  useEffect(() => {
    setFieldError((prev) => ({ ...prev, address: '' }));
  }, [searchTerm, inputType, setFieldError]);

  useEffect(() => {
    setFieldError((prev) => ({ ...prev, lat: '' }));
  }, [location.lat, inputType, setFieldError]);

  useEffect(() => {
    setFieldError((prev) => ({ ...prev, lng: '' }));
  }, [location.lng, inputType, setFieldError]);

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
      const isValid = !Object.values(validationResult).some(item => !!item);
      setLocationError(validationResult);
      setLocationValid(isValid);
    }, Config.TypingDelay / 2),
    [setLocationValid, setLocationError]
  );

  useEffect(() => {
    debouncedValidateLocation(inputType, location);
    /* Cleanup function */
    return () => {
      debouncedValidateLocation.cancel();
    };
  }, [location, inputType, debouncedValidateLocation]);

  const handleSnackbarClose = useCallback((event, reason) => {
    setLocation((prev) => ({ ...prev, id: '' }));
  }, [setLocation]);

  return (
    <Stack direction="column" spacing={2}>
      <LocationInputTypeToggle />
      {inputType === 'address' ? (
        <AddressInput
          setErrorMessage={setErrorMessage}
          fieldError={fieldError}
          setFieldError={setFieldError}
        />
      ) : (
        <CoordinatesInput
          fieldError={fieldError}
          setFieldError={setFieldError}
        />
      )}
      <TimezoneFetcher
        lat={location.lat}
        lng={location.lng}
        latestTzRequest={latestTzRequest}
        setLocation={setLocation}
        setErrorMessage={setErrorMessage}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={location.id === 'unknown'}
        autoHideDuration={12000}
        onClose={handleSnackbarClose}
        sx={(theme) => ({
          boxShadow: theme.shadows[2],
        })}
      >
        <Alert severity="warning" sx={{ width: '100%', textAlign: 'left' }} onClose={handleSnackbarClose}>
          Sorry, we couldn't fetch the address, but you can use these coordinates for this location.
        </Alert>
      </Snackbar>
    </Stack>
  );
};

LocationInput.propTypes = {
  onLocationChange: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setLocationValid: PropTypes.func.isRequired,
  fieldError: PropTypes.shape({
    address: PropTypes.string.isRequired,
    lat: PropTypes.string.isRequired,
    lng: PropTypes.string.isRequired,
  }).isRequired,
  setFieldError: PropTypes.func.isRequired,
};

export default React.memo(LocationInput);
