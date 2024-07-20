// src/components/LocationInput.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

const LocationInput = ({ onDraw }) => {
  const [location, setLocation] = useState({ lat: '', lng: '' });

  const handleInputChange = (event, value, field) => {
    setLocation({ ...location, [field]: value });
  };

  const handleDraw = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    onDraw({year, month, day, lat: location.lat, lng: location.lng, planet: 'mars'});
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
      <br></br>
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
      <br></br>
      <Button variant="contained" color="primary" onClick={handleDraw}>
        Draw
      </Button>
    </div>
  );
};

export default LocationInput;
