// src/components/StarInput.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TextField, Stack, ToggleButton, ToggleButtonGroup, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { STARS } from '../utils/constants';
import Config from '../Config';
import debounce from 'lodash/debounce';

/* Validate the star params */
const validateStarSync = (inputType, star) => {
  let newStarError = {
    name: { valid: true, error: '' },
    hip: { valid: true, error: '' },
    ra: { valid: true, error: '' },
    dec: { valid: true, error: '' }
  };

  if (inputType === 'hip') {
    if (!star.hip) {
      return { ...newStarError, hip: { valid: false, error: `Please enter a Hipparchus catalogue number.` } };
    }
    if (!/^\d*$/.test(star.hip)) {
      return { ...newStarError, hip: { valid: false, error: `Invalid Hipparchus catalogue number.` } };
    }
  } else if (inputType === 'radec') {
    if (!star.ra) {
      return { ...newStarError, ra: { valid: false, error: `Please enter a right ascension.` } };
    }
    if (!star.dec) {
      return { ...newStarError, dec: { valid: false, error: `Please enter a declination.` } };
    }
    if (!/^-?\d*(\.\d+)?$/.test(star.ra)) {
      return { ...newStarError, ra: { valid: false, error: `The right ascension must be a decimal.` } };
    }
    if (!/^-?\d*(\.\d+)?$/.test(star.dec)) {
      return { ...newStarError, dec: { valid: false, error: `The declination must be a decimal.` } };
    }

    const ra = parseFloat(star.ra);
    const dec = parseFloat(star.dec);
    if (ra < 0 || ra > 24) {
      return { ...newStarError, ra: { valid: false, error: `The right ascension must be between 0h and 24h.` } };
    }
    if (dec < -90 || dec > 90) {
      return { ...newStarError, dec: { valid: false, error: `The declination must be between -90° and 90°.` } };
    }
  }

  return newStarError;
};

const StarInput = ({ onStarChange, setErrorMessage, setStarValid }) => {
  const [inputType, setInputType] = useState('name');  // 'name', 'hip', 'radec'
  const [star, setStar] = useState({ name: 'Mars', hip: '87937', ra: '', dec: '' });
  const [starError, setStarError] = useState({
    name: { valid: true, error: '' },
    hip: { valid: true, error: '' },
    ra: { valid: true, error: '' },
    dec: { valid: true, error: '' }
  });

  useEffect(() => {
    onStarChange(star);
  }, [star, onStarChange]);

  useEffect(() => {
    setErrorMessage('');
  }, [inputType, star, setErrorMessage]);

  const handleInputTypeChange = useCallback((event, newInputType) => {
    if (newInputType !== null) {
      setInputType(newInputType);
    }
  }, []);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setStar((prevStar) => ({ ...prevStar, [name]: value }));
    setStarValid(true);
    setStarError({
      name: { valid: true, error: '' },
      hip: { valid: true, error: '' },
      ra: { valid: true, error: '' },
      dec: { valid: true, error: '' }
    });  // Reset error when user starts typing
  }, [setStarValid]);

  const debouncedValidateStar = useMemo(
    () => debounce((inputType, star) => {
      const validationResult = validateStarSync(inputType, star);
      const isValid = !Object.values(validationResult).some(item => !item.valid);
      setStarError(validationResult);
      setStarValid(isValid);
    }, Config.typingTimeout),
    [setStarValid]
  );

  useEffect(() => {
    debouncedValidateStar(inputType, star);

    /* Cleanup function */
    return () => {
      debouncedValidateStar.cancel();
    };
  }, [inputType, star, debouncedValidateStar]);

  return (
    <Stack direction="column" spacing={2}>
      <ToggleButtonGroup
        color="primary"
        size="small"
        value={inputType}
        exclusive
        onChange={handleInputTypeChange}
        aria-label="Input type"
        fullWidth
      >
        <ToggleButton value="name" aria-label="Input Name">
          Planet Name
        </ToggleButton>
        <ToggleButton value="hip" aria-label="Input Hipparchus">
          Hipparchus
        </ToggleButton>
        <ToggleButton value="radec" aria-label="Input RA/Dec">
          RA/Dec (J2000)
        </ToggleButton>
      </ToggleButtonGroup>

      {inputType === 'name' && (
        <TextField
          required
          select
          label="Celestial Object Name"
          size="small"
          variant="outlined"
          name="name"
          value={star.name}
          onChange={handleInputChange}
          fullWidth
          error={!starError.name.valid}
          helperText={!starError.name.valid && starError.name.error}
        >
          {Object.keys(STARS).map((key) => (
            <MenuItem key={key} value={key}> {key} </MenuItem>
          ))}
        </TextField>
      )}
      {inputType === 'hip' && (
        <TextField
          required
          label="Hipparchus Catalogue Number"
          size="small"
          variant="outlined"
          name="hip"
          type="number"
          value={star.hip}
          onChange={handleInputChange}
          fullWidth
          error={!starError.hip.valid}
          helperText={!starError.hip.valid && starError.hip.error}
        />
      )}
      {inputType === 'radec' && (
        <div>
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                required
                label="RA"
                placeholder="Enter the right ascension in decimal hours"
                size="small"
                variant="outlined"
                name="ra"
                type="number"
                value={star.ra}
                onChange={handleInputChange}
                fullWidth
                error={!starError.ra.valid}
                helperText={!starError.ra.valid && starError.ra.error}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                required
                label="Dec"
                placeholder="Enter the declination in decimal degrees"
                size="small"
                variant="outlined"
                name="dec"
                type="number"
                value={star.dec}
                onChange={handleInputChange}
                fullWidth
                error={!starError.dec.valid}
                helperText={!starError.dec.valid && starError.dec.error}
              />
            </Grid>
          </Grid>
        </div>
      )}
    </Stack>
  );
};

StarInput.propTypes = {
  onStarChange: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setStarValid: PropTypes.func.isRequired,
};

export default StarInput;
