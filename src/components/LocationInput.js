// src/components/LocationInput.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Stack, Autocomplete, TextField, ToggleButton, ToggleButtonGroup, InputAdornment, CircularProgress, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
// import SearchIcon from '@mui/icons-material/Search';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Config from '../Config';
import debounce from 'lodash/debounce';
import fetchGeolocation from '../utils/fetchGeolocation'; // Import the geolocation fetching utility
import fetchSuggestions from '../utils/fetchSuggestions'; // Import the suggestions fetching utility

const fetchLocation = async (setSearchTerm, setLocation, setLoadingLocation, setErrorMessage) => {
  try {
    setLoadingLocation(true);
    const locationData = await fetchGeolocation();
    setSearchTerm(locationData.display_name);
    setLocation({
      lat: locationData.lat,
      lng: locationData.lng,
      place_id: locationData.place_id,
    });
  } catch (error) {
    setErrorMessage({ location: error.message });
  } finally {
    setLoadingLocation(false);
  }
};

/* Validate the location */
const validateLocationSync = (inputType, location) => {
  let newLocationError = { address: '', lat: '', lng: '' };

  if (inputType === 'coordinates') {
    if (!/^-?\d*(\.\d+)?$/.test(location.lat)) {
      return { ...newLocationError, lat: 'The latitude must be a decimal.' };
    }
    if (!/^-?\d*(\.\d+)?$/.test(location.lng)) {
      return { ...newLocationError, lng: 'The longitude must be a decimal.' };
    }

    if (location.lat) {
      const lat = parseFloat(location.lat);
      if (lat < -90 || lat > 90) {
        return { ...newLocationError, lat: 'The latitude must be between -90° and 90°.' };
      }
    }
    if (location.lng) {
      const lng = parseFloat(location.lng);
      if (lng < -180 || lng > 180) {
        return { ...newLocationError, lng: 'The longitude must be between -180° and 180°.' };
      }
    }
  }

  return newLocationError;
};

const LocationInput = ({ onLocationChange, setErrorMessage, setLocationValid, fieldError, setFieldError }) => {
  // console.log('Rendering LocationInput');
  const [inputType, setInputType] = useState('address');  // 'address' or 'coordinates'
  const [location, setLocation] = useState({ lat: '', lng: '', place_id: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [locationError, setLocationError] = useState({ address: '', lat: '', lng: '' });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const clearError = useCallback(() => {
    setErrorMessage((prev) => ({ ...prev, location: '' }));
    setLocationError({ address: '', lat: '', lng: '' });
  }, [setErrorMessage]);

  /* Initialize */
  useEffect(() => {
    clearError();
    // setLoadingLocation(true);
    // fetchLocation(setSearchTerm, setLocation, setErrorMessage);
    // setLoadingLocation(false);
  }, [clearError]);

  useEffect(() => {
    onLocationChange({ ...location, type: inputType });
  }, [location, inputType, onLocationChange]);

  /* Reset error when user starts typing */
  useEffect(() => {
    clearError();
    setLocationValid(true);
    /* Clear address if lat or lng is empty */
    if (searchTerm && inputType === 'coordinates' && (!location.lat || !location.lng)) {
      setSearchTerm('');
      setSuggestions([]);
      setLocation((prev) => ({ ...prev, place_id: '' }));
    }
  }, [searchTerm, location, inputType, clearError, setLocationValid]);

  useEffect(() => {
    setFieldError((prev) => ({ ...prev, address: '' }));
  }, [searchTerm, inputType, setFieldError]);

  useEffect(() => {
    setFieldError((prev) => ({ ...prev, lat: '' }));
  }, [location.lat, inputType, setFieldError]);

  useEffect(() => {
    setFieldError((prev) => ({ ...prev, lng: '' }));
  }, [location.lng, inputType, setFieldError]);

  const handleGpsClick = useCallback(
    () => {
      clearError();
      setSuggestions([]);
      fetchLocation(setSearchTerm, setLocation, setLoadingLocation, setErrorMessage);
    },
    [clearError, setErrorMessage]
  );

  const handleInputTypeChange = useCallback((event, newInputType) => {
    if (newInputType !== null) {
      setInputType(newInputType);
    }
  }, []);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setLocation((prev) => ({ ...prev, [name]: value }));
  }, []);

  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce(async (query) => {
        try {
          setLoadingSuggestions(true);
          const suggestions = await fetchSuggestions(query);
          setSuggestions(suggestions);
        } catch (error) {
          setErrorMessage({ location: error.message });
        } finally {
          setLoadingSuggestions(false);
        }
      }, Config.TypingDebouncePeriod),
    [setErrorMessage]
  );

  /* Cancel the debounce function when the component unmounts */
  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [debouncedFetchSuggestions]);

  const debouncedValidateLocation = useMemo(
    () => debounce((inputType, location) => {
      const validationResult = validateLocationSync(inputType, location);
      const isValid = !Object.values(validationResult).some(item => !!item);
      setLocationError(validationResult);
      setLocationValid(isValid);
    }, Config.TypingDebouncePeriod),
    [setLocationValid]
  );

  useEffect(() => {
    debouncedValidateLocation(inputType, location);
    /* Cleanup function */
    return () => {
      debouncedValidateLocation.cancel();
    };
  }, [location, inputType, debouncedValidateLocation]);

  const handleSearchChange = useCallback(
    (event, newSearchTerm) => {
      const trimmedNewSearchTerm = newSearchTerm.trim();
      setSearchTerm(trimmedNewSearchTerm);
      if (trimmedNewSearchTerm) {
        debouncedFetchSuggestions(trimmedNewSearchTerm);
      } else {
        setLocation({ lat: '', lng: '', place_id: '' });
        setSuggestions([]);
      }
    },
    [debouncedFetchSuggestions]
  );

  const handleSelect = useCallback((event, value) => {
    if (!value || value.place_id === 'not-found') {
      setLocation({ lat: '', lng: '', place_id: '' });
      setLocationValid(false);
      setSearchTerm('');
      setSuggestions([]);
      return;
    }

    const selectedSuggestion = suggestions.find(
      (suggestion) => suggestion.place_id === value.place_id
    );
    if (selectedSuggestion) {
      setLocation({
        lat: selectedSuggestion.lat,
        lng: selectedSuggestion.lon,
        place_id: selectedSuggestion.place_id,
      });
      setSearchTerm(selectedSuggestion.display_name);
      setSuggestions([]);
    }
  }, [suggestions, setLocationValid]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      /* Prevent's default 'Enter' behavior */
      event.defaultMuiPrevented = true;
      /* Select the highlighted suggestion */
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        const highlightedSuggestion = suggestions[highlightedIndex];
        if (highlightedSuggestion.place_id !== 'not-found') {
          setLocation({
            lat: highlightedSuggestion.lat,
            lng: highlightedSuggestion.lon,
            place_id: highlightedSuggestion.place_id,
          });
          setSearchTerm(highlightedSuggestion.display_name);
          setSuggestions([]);
        }
      }
    }
  }, [highlightedIndex, suggestions]);

  const handleHighlightChange = useCallback((event, option, reason) => {
    if (reason === 'keyboard' || reason === 'mouse') {
      const index = suggestions.findIndex((suggestion) => suggestion.place_id === option.place_id);
      setHighlightedIndex(index);
    }
  }, [suggestions]);

  return (
    <Stack direction="column" spacing={2}>
      <ToggleButtonGroup
        color="primary"
        size="small"
        value={inputType}
        exclusive
        onChange={handleInputTypeChange}
        aria-label="Input type"
        fullWidth
      >
        <ToggleButton value="address" aria-label="Search Address">
          Search Address
        </ToggleButton>
        <ToggleButton value="coordinates" aria-label="Enter Coordinates">
          Enter Coordinates
        </ToggleButton>
      </ToggleButtonGroup>

      {inputType === 'address' ? (
        <Autocomplete
          freeSolo
          clearOnEscape
          options={suggestions}
          getOptionLabel={(option) => option.display_name}
          inputValue={searchTerm}
          onInputChange={handleSearchChange}
          onChange={handleSelect}
          onKeyDown={handleKeyDown}
          onHighlightChange={handleHighlightChange}
          filterOptions={(x) => x}
          autoHighlight
          loading={loadingSuggestions}
          renderOption={(props, option) => (
            <li
              {...props}
              key={option.place_id}
              style={option.place_id === 'not-found' ? { pointerEvents: 'none', color: 'gray' } : {}}
            >
              {`${option.display_name} ${option.address_type ? `(${option.address_type})` : ''}`}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              error={!!locationError.address || !!fieldError.address}
              helperText={locationError.address || fieldError.address}
              label="Search address"
              placeholder="Enter a place, city, county, state, or country"
              size="small"
              variant="outlined"
              fullWidth
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 0.2, mr: 0 }}>
                    {!loadingSuggestions && !loadingLocation ? (
                      <IconButton onClick={handleGpsClick}>
                        <GpsFixedIcon size={20} sx={{ color: "grey", p: '2px', mx: -1, cursor: 'pointer' }} />
                      </IconButton>
                    ) : (
                      <CircularProgress size={20} sx={{ color: "grey", mr: 0.5 }} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      ) : (
        <div>
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                required
                label="Latitude"
                placeholder="Enter the latitude in decimal degrees"
                size="small"
                variant="outlined"
                name="lat"
                value={location.lat}
                onChange={handleInputChange}
                type="number"
                inputProps={{ min: -90, max: 90 }}
                fullWidth
                error={!!locationError.lat || !!fieldError.lat}
                helperText={locationError.lat || fieldError.lat}
                InputProps={{
                  endAdornment: loadingLocation ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} sx={{ color: "lightgrey" }} />
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                required
                label="Longitude"
                placeholder="Enter the longitude in decimal degrees"
                size="small"
                variant="outlined"
                name="lng"
                value={location.lng}
                onChange={handleInputChange}
                type="number"
                inputProps={{ min: -180, max: 180 }}
                fullWidth
                error={!!locationError.lng || !!fieldError.lng}
                helperText={locationError.lng || fieldError.lng}
                InputProps={{
                  endAdornment: loadingLocation ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} sx={{ color: "lightgrey" }} />
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Grid>
          </Grid>
        </div>
      )}
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
