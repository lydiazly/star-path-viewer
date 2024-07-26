// src/components/LocationInput.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Stack, Autocomplete, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import axios from 'axios';
import Config from '../Config';
import debounce from 'lodash/debounce';

/* TODO: validateLocation() */

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
      // setSuggestions([{ display_name: 'Error fetching location suggestions', place_id: 'error', address_type: '' }]);
    }
  } else {
    setSuggestions([]);
  }
};

const LocationInput = ({ onLocationChange, setErrorMessage }) => {
  const [inputType, setInputType] = useState('address');  // 'address' or 'coordinates'
  const [location, setLocation] = useState({ lat: '0', lng: '0', place_id: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

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
      }, Config.typingTimeout),
    [setErrorMessage]
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
    if (!value || value.place_id === 'not-found') {
      setLocation({ lat: '', lng: '', place_id: '' });
      setSearchTerm('');
      setSuggestions([]);
      return;
    }

    const selectedSuggestion = suggestions.find(
      // (suggestion) => `${suggestion.display_name}` === value
      (suggestion) => suggestion.place_id === value.place_id
    );
    if (selectedSuggestion) {
      setLocation({
        lat: selectedSuggestion.lat,
        lng: selectedSuggestion.lon,
        place_id: selectedSuggestion.place_id,
      });
      // setSearchTerm(value);
      setSearchTerm(selectedSuggestion.display_name);
      setSuggestions([]);
    }
  }, [suggestions]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      /* Prevent's default 'Enter' behavior */
      event.defaultMuiPrevented = true;
      /* Select the highlighted suggestion */
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        const highlightedSuggestion = suggestions[highlightedIndex];
        if (highlightedSuggestion.place_id !== 'not-found' && highlightedSuggestion.place_id !== 'error') {
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
            // options={suggestions.map((suggestion) => suggestion.display_name)}
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
                label="Search address"
                placeholder="Enter a place, city, county, state, or country"
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
