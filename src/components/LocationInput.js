// src/components/LocationInput.js
import React, { useState, useEffect } from 'react';
import { TextField, Stack, Autocomplete, ToggleButton, ToggleButtonGroup } from '@mui/material';
import axios from 'axios';

const LocationInput = ({ onLocationChange, setErrorMessage }) => {
  const [inputType, setInputType] = useState('city'); // 'city' or 'manual'
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    onLocationChange(location);
  }, [location, onLocationChange]);

  useEffect(() => {
    setErrorMessage(null);
  }, [inputType, searchTerm, location, setErrorMessage]);

  const handleInputTypeChange = (event, newInputType) => {
    if (newInputType !== null) {
      setInputType(newInputType);
    }
  };

  const handleInputChange = (event, field) => {
    setLocation({ ...location, [field]: event.target.value });
  };

  const handleSearchChange = async (event, newInputValue) => {
    setSearchTerm(newInputValue);
    if (newInputValue.length > 2) {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: newInputValue,
            format: 'json',
            // addressdetails: 1,
          },
        });
        setSuggestions(response.data);
      } catch (error) {
        setErrorMessage('Error fetching location suggestions.');
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (event, value) => {
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
  };

  return (
    <Stack direction='column' spacing={2}>
      <Stack direction="row" spacing={2}>
        <ToggleButtonGroup
          color="primary"
          value={inputType}
          exclusive
          onChange={handleInputTypeChange}
          aria-label="Input type"
          fullWidth
        >
          <ToggleButton value="city" aria-label="Search by City">
            Search by City
          </ToggleButton>
          <ToggleButton value="manual" aria-label="Enter Coordinates">
            Enter Coordinates
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {inputType === 'city' ? (
        <Autocomplete
          freeSolo
          clearOnEscape
          options={suggestions.map((suggestion) => suggestion.display_name)}
          inputValue={searchTerm}
          onInputChange={handleSearchChange}
          onChange={handleSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search City"
              variant="outlined"
              fullWidth
            />
          )}
        />
      ) : (
        <Stack direction="row" spacing={2}>
          <TextField
            label="Latitude"
            variant="outlined"
            value={location.lat}
            onChange={(e) => handleInputChange(e, 'lat')}
            type="number"
            fullWidth
          />
          <TextField
            label="Longitude"
            variant="outlined"
            value={location.lng}
            onChange={(e) => handleInputChange(e, 'lng')}
            type="number"
            fullWidth
          />
        </Stack>
      )}
    </Stack>
  );
};

export default LocationInput;
