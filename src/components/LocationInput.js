// src/components/LocationInput.js
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from 'react-autocomplete';
// import Autocomplete from '@mui/material/Autocomplete';
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

  const handleSearchChange = async (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value.length > 2) {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: event.target.value,
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

  const handleSelect = (val) => {
    const selectedSuggestion = suggestions.find(
      (suggestion) => `${suggestion.display_name}` === val
    );
    if (selectedSuggestion) {
      setLocation({
        lat: selectedSuggestion.lat,
        lng: selectedSuggestion.lon,
      });
      setSearchTerm(val);
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

      {inputType === 'city' ? (
        <Autocomplete
          getItemValue={(item) => item.display_name}
          items={suggestions}
          renderItem={(item, isHighlighted) =>
            <div key={item.place_id} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
              {item.display_name}
            </div>
          }
          value={searchTerm}
          onChange={handleSearchChange}
          onSelect={handleSelect}
          inputProps={{
            label: 'Search City',
            variant: 'outlined',
            fullWidth: true,
          }}
          wrapperStyle={{ position: 'relative', zIndex: 1 }}
          menuStyle={{
            border: 'solid 1px #ccc',
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: 'white',
          }}
        />
      ) : (
        <>
          <TextField
            label="Latitude"
            variant="outlined"
            value={location.lat}
            onChange={(e) => handleInputChange(e, 'lat')}
            type="number"
          />
          <br />
          <TextField
            label="Longitude"
            variant="outlined"
            value={location.lng}
            onChange={(e) => handleInputChange(e, 'lng')}
            type="number"
          />
        </>
      )}
    </div>
  );
};

export default LocationInput;
