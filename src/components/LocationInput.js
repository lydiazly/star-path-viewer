// src/components/LocationInput.js
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
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
            addressdetails: 1,
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
    <div>
      <Button onClick={() => setInputType('city')} variant={inputType === 'city' ? 'contained' : 'outlined'}>
        Search by City
      </Button>
      <Button onClick={() => setInputType('manual')} variant={inputType === 'manual' ? 'contained' : 'outlined'}>
        Enter Coordinates
      </Button>
      <br />

      {inputType === 'city' ? (
        <>
          <br />
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
          <br />
        </>
      ) : (
        <Stack spacing={2} direction="row">
          <TextField
            label="Latitude"
            variant="outlined"
            value={location.lat}
            onChange={(e) => handleInputChange(e, 'lat')}
            type="number"
          />
          &nbsp;
          <TextField
            label="Longitude"
            variant="outlined"
            value={location.lng}
            onChange={(e) => handleInputChange(e, 'lng')}
            type="number"
          />
          <br />
        </Stack>
      )}
    </div>
  );
};

export default LocationInput;
