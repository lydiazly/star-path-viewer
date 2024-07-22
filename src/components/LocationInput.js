// src/components/LocationInput.js
import React, { useState, useEffect } from 'react';
import { TextField, Stack, Autocomplete, Button } from '@mui/material';
import axios from 'axios';

const LocationInput = ({ onLocationChange }) => {
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [inputType, setInputType] = useState('city'); // 'city' or 'manual'
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    onLocationChange(location);
  }, [location, onLocationChange]);

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
        console.error('Error fetching location suggestions:', error);
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
        <Button 
          onClick={() => setInputType('city')} 
          variant={inputType === 'city' ? 'contained' : 'outlined'}
          fullWidth
          >
          Search by City
        </Button>
        <Button 
          onClick={() => setInputType('manual')} 
          variant={inputType === 'manual' ? 'contained' : 'outlined'}
          fullWidth
          >
          Enter Coordinates
        </Button>
      </Stack>

      {inputType === 'city' ? (
        <Autocomplete
          freeSolo
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
