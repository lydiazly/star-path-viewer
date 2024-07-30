// src/components/LocationInput.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Stack, Autocomplete, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import axios from 'axios';
import Config from '../Config';
import debounce from 'lodash/debounce';

const fetchSuggestions = async (query, setSuggestions, setErrorMessage) => {
  if (query.length > 2) {
    try {
      const response = await axios.get(Config.nominatimSearchUrl, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
        },
        timeout: Config.nominatimTimeout,
      });
      // console.log(response.data);
      if (response.data.length > 0) {
        setSuggestions(response.data);
      } else {
        setSuggestions([{ display_name: 'Location not found', place_id: 'not-found', address_type: '' }]);
      }
    } catch (error) {
      setErrorMessage('Error fetching location suggestions.');
    }
  } else {
    setSuggestions([]);
  }
};

/* Validate the location */
const validateLocationSync = (inputType, location) => {
  let newLocationError = {
    address: { valid: true, error: '' },
    lat: { valid: true, error: '' },
    lng: { valid: true, error: '' }
  };

  if (inputType === 'address') {
    if (!location.place_id) {
      return { ...newLocationError, address: { valid: false, error: `Please enter and select a location.` } };
    }
  } else {
    if (!location.lat) {
      return { ...newLocationError, lat: { valid: false, error: `Please enter a latitude.` } };
    }
    if (!location.lng) {
      return { ...newLocationError, lng: { valid: false, error: `Please enter a longitude.` } };
    }
    if (!/^-?\d*(\.\d+)?$/.test(location.lat)) {
      return { ...newLocationError, lat: { valid: false, error: `The latitude must be a decimal.` } };
    }
    if (!/^-?\d*(\.\d+)?$/.test(location.lng)) {
      return { ...newLocationError, lng: { valid: false, error: `The longitude must be a decimal.` } };
    }

    const lat = parseFloat(location.lat);
    const lng = parseFloat(location.lng);
    if (lat < -90 || lat > 90) {
      return { ...newLocationError, lat: { valid: false, error: `The latitude must be between -90° and 90°.` } };
    }
    if (lng < -180 || lng > 180) {
      return { ...newLocationError, lng: { valid: false, error: `The longitude must be between -180° and 180°.` } };
    }
  }

  return newLocationError;
};

const LocationInput = ({ onLocationChange, setErrorMessage, setLocationValid }) => {
  const [inputType, setInputType] = useState('address');  // 'address' or 'coordinates'
  const [location, setLocation] = useState({ lat: '0', lng: '0', place_id: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [locationError, setLocationError] = useState({
    address: { valid: true, error: '' },
    lat: { valid: true, error: '' },
    lng: { valid: true, error: '' }
  });

  useEffect(() => {
    onLocationChange(location);
  }, [location, onLocationChange]);

  useEffect(() => {
    setErrorMessage('');
  }, [inputType, searchTerm, location, setErrorMessage]);

  const handleInputTypeChange = useCallback((event, newInputType) => {
    if (newInputType !== null) {
      setInputType(newInputType);
    }
  }, []);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setLocation(prevLocation => ({ ...prevLocation, [name]: value.toString() }));
    setLocationValid(true);
    setLocationError({
      address: { valid: true, error: '' },
      lat: { valid: true, error: '' },
      lng: { valid: true, error: '' }
    });  // Reset error when user starts typing
  }, [setLocationValid]);

  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce((query) => {
        fetchSuggestions(query, setSuggestions, setErrorMessage);
      }, Config.typingTimeout),
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
      const isValid = !Object.values(validationResult).some(item => !item.valid);
      setLocationError(validationResult);
      setLocationValid(isValid);
    }, Config.typingTimeout),
    [setLocationValid]
  );

  useEffect(() => {
    debouncedValidateLocation(inputType, location);

    /* Cleanup function */
    return () => {
      debouncedValidateLocation.cancel();
    };
  }, [inputType, location, debouncedValidateLocation]);

  const handleSearchChange = useCallback(
    (event, newInputValue) => {
      setSearchTerm(newInputValue);
      debouncedFetchSuggestions(newInputValue);
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
          setLocationValid(true);
          setSearchTerm(highlightedSuggestion.display_name);
          setSuggestions([]);
        }
      }
    }
  }, [highlightedIndex, suggestions, setLocationValid]);

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
          renderOption={(props, option) => (
            <li {...props} key={option.place_id} style={option.place_id === 'not-found' ? { pointerEvents: 'none', color: 'gray' } : {}}>
              {`${option.display_name} ${option.address_type ? `(${option.address_type})` : ''}`}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              error={!locationError.address.valid}
              helperText={!locationError.address.valid && locationError.address.error}
              label="Search address"
              placeholder="Enter a place, city, county, state, or country"
              size="small"
              variant="outlined"
              fullWidth
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
                error={!locationError.lat.valid}
                helperText={!locationError.lat.valid && locationError.lat.error}
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
                error={!locationError.lng.valid}
                helperText={!locationError.lng.valid && locationError.lng.error}
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
};

export default LocationInput;
