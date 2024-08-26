// src/components/Input/Location/CoordinatesInput.js
import React, { useCallback } from 'react';
import { Grid, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { useLocationInput } from '../../../context/LocationInputContext';

const CoordinatesInput = ({ fieldError, setFieldError }) => {
  const { location, setLocation, locationError, loadingLocation } = useLocationInput();

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setLocation((prev) => ({ ...prev, [name]: value }));
  }, [setLocation]);

  return (
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
                  <CircularProgress size={20} sx={{ color: "action.disabled" }} />
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
                  <CircularProgress size={20} sx={{ color: "action.disabled" }} />
                </InputAdornment>
              ) : null,
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(CoordinatesInput);
