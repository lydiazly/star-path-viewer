// LocationInput.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

const LocationInput = ({ onSearch }) => {
  const [location, setLocation] = useState({ lat: '', lng: '' });

  const handleInputChange = (event, value, field) => {
    setLocation({ ...location, [field]: value });
  };

  const handleSearch = () => {
    onSearch(location.lat, location.lng);
  };

  return (
    <div>
      <Autocomplete
        freeSolo
        id="lat-autocomplete"
        options={[]}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Latitude"
            variant="outlined"
            value={location.lat}
            onChange={(e) => handleInputChange(e, e.target.value, 'lat')}
          />
        )}
      />
      <Autocomplete
        freeSolo
        id="lng-autocomplete"
        options={[]}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Longitude"
            variant="outlined"
            value={location.lng}
            onChange={(e) => handleInputChange(e, e.target.value, 'lng')}
          />
        )}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

export default LocationInput;
