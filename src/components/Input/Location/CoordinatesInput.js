// src/components/Input/Location/CoordinatesInput.js
import React, { useCallback } from 'react';
import { Grid, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { useLocationInput } from '../../../context/LocationInputContext';
import * as actionTypes from '../../../context/locationInputActionTypes';

const CoordinatesInput = () => {
  const {
    location,
    locationLoading,
    locationError, locationNullError,
    locationDispatch,
  } = useLocationInput();

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    if (name === 'lat') {
      locationDispatch({ type: actionTypes.SET_LAT, payload: value });
    } else {
      locationDispatch({ type: actionTypes.SET_LNG, payload: value });
    }
  }, [locationDispatch]);

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
            error={!!locationError.lat || !!locationNullError.lat}
            helperText={locationError.lat || locationNullError.lat}
            InputProps={{
              endAdornment: locationLoading ? (
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
            error={!!locationError.lng || !!locationNullError.lng}
            helperText={locationError.lng || locationNullError.lng}
            InputProps={{
              endAdornment: locationLoading ? (
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
