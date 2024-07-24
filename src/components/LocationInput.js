// src/components/LocationInput.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Stack, Autocomplete, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import axios from 'axios';
import debounce from 'lodash/debounce';

/* TODO: validateLocation() */

const fetchSuggestions = async (query, setSuggestions, setErrorMessage) => {
  if (query.length > 2) {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: 'json',
          // addressdetails: 1,
        },
        timeout: 3000,
      });
      console.log(response.data);
      if (response.data.length > 0) {
        setSuggestions(response.data);
      } else {
        setErrorMessage('Location not found. Please try another address.');
      }
    } catch (error) {
      setErrorMessage('Error fetching location suggestions.');
    }
  } else {
    setSuggestions([]);
  }
};

const LocationInput = ({ onLocationChange, setErrorMessage }) => {
  const [inputType, setInputType] = useState('address'); // 'address' or 'coordinates'
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

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

  const handleInputChange = useCallback((event, field) => {
    setLocation(prevLocation => ({ ...prevLocation, [field]: event.target.value }));
  }, []);

  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce((query) => {
        fetchSuggestions(query, setSuggestions, setErrorMessage);
      }, 750),  // ms
    [setSuggestions, setErrorMessage]
  );

  /* Cancel the debounce function when the component unmounts */
  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [debouncedFetchSuggestions]);

  const handleSearchChange = useCallback(
    (event, newInputValue) => {
      setSearchTerm(newInputValue);
      debouncedFetchSuggestions(newInputValue);
    },
    [debouncedFetchSuggestions]
  );

  const handleSelect = useCallback((event, value) => {
    const selectedSuggestion = suggestions.find(
      (suggestion) => `${suggestion.display_name}` === value
    );
    if (selectedSuggestion) {
      setLocation({
        lat: selectedSuggestion.lat,
        lng: selectedSuggestion.lon,
      });
      setSearchTerm(value);
      setSuggestions([]);
    }
  }, [suggestions]);

  return (
    <Box>
      <Stack direction='column' spacing={2}>
        <Stack direction="row" spacing={2}>
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
        </Stack>

        {inputType === 'address' ? (
          <Autocomplete
            freeSolo
            clearOnEscape
            options={suggestions.map((suggestion) => suggestion.display_name)}
            inputValue={searchTerm}
            onInputChange={handleSearchChange}
            onChange={handleSelect}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search address"
                placeholder="Enter a place, city, province/state, or country"
                size="small"
                variant="outlined"
                fullWidth
              />
            )}
          />
        ) : (
          <Stack direction="row" spacing={2}>
            <TextField
              label="Latitude"
              placeholder="Enter a decimal latitude"
              size="small"
              variant="outlined"
              value={location.lat}
              onChange={(e) => handleInputChange(e, 'lat')}
              type="number"
              fullWidth
            />
            <TextField
              label="Longitude"
              placeholder="Enter a decimal longitude"
              size="small"
              variant="outlined"
              value={location.lng}
              onChange={(e) => handleInputChange(e, 'lng')}
              type="number"
              fullWidth
            />
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default LocationInput;
