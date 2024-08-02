// src/components/StarInput.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TextField, Stack, ToggleButton, ToggleButtonGroup, MenuItem, RadioGroup, Radio, FormControlLabel, FormControl, Typography } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { STARS } from '../utils/constants';
import { dmsToDecimal, decimalToDMS } from '../utils/coordUtils';
import { hmsToDecimal, decimalToHMS } from '../utils/dateUtils';
import Config from '../Config';
import debounce from 'lodash/debounce';

/* Validate the star params */
const validateStarSync = (inputType, radecFormat, star) => {
  let newStarError = {
    name: { valid: true, error: '' },
    hip: { valid: true, error: '' },
    ra: { valid: true, error: '' },
    dec: { valid: true, error: '' }
  };

  if (inputType === 'hip') {
    if (!star.hip) {
      return { ...newStarError, hip: { valid: false, error: 'Please enter a Hipparchus catalogue number.' } };
    }
    if (!/^\d*$/.test(star.hip)) {
      return { ...newStarError, hip: { valid: false, error: 'Invalid Hipparchus catalogue number.' } };
    }
  } else if (inputType === 'radec') {
    if (radecFormat === 'decimal') {
      if (!star.ra) {
        return { ...newStarError, ra: { valid: false, error: 'Please enter a right ascension.' } };
      }
      if (!star.dec) {
        return { ...newStarError, dec: { valid: false, error: 'Please enter a declination.' } };
      }
      if (!/^\d*(\.\d+)?$/.test(star.ra)) {
        return { ...newStarError, ra: { valid: false, error: 'The right ascension must be a positive decimal.' } };
      }
      if (!/^-?\d*(\.\d+)?$/.test(star.dec)) {
        return { ...newStarError, dec: { valid: false, error: 'The declination must be a decimal.' } };
      }

      const ra = parseFloat(star.ra);
      if (ra < 0 || ra >= 360) {
        return { ...newStarError, ra: { valid: false, error: 'The right ascension must be between 0° and 360°.' } };
      }
    } else {
      if (!star.ra) {
        return { ...newStarError, ra: { valid: false, error: 'Enter at least one of the following: hours, minutes, or seconds.' } };
      }
      if (!star.dec) {
        return { ...newStarError, dec: { valid: false, error: 'Enter at least one of the following: degrees, minutes, or seconds.' } };
      }
      if (!/^\d*$/.test(star.raHMS.hours)) {
        return { ...newStarError, ra: { valid: false, error: 'The hours must be a positive integer.' } };
      }
      if (!/^-?\d*$/.test(star.decDMS.degrees)) {
        return { ...newStarError, dec: { valid: false, error: 'The degrees must be an integer.' } };
      }
      if (!/^\d*$/.test(star.raHMS.minutes)) {
        return { ...newStarError, ra: { valid: false, error: 'The minutes must be a positive integer.' } };
      }
      if (!/^\d*$/.test(star.decDMS.minutes)) {
        return { ...newStarError, dec: { valid: false, error: 'The minutes must be a positive integer.' } };
      }
      if (!/^\d*(\.\d+)?$/.test(star.raHMS.seconds)) {
        return { ...newStarError, ra: { valid: false, error: 'The seconds must be a positive decimal.' } };
      }
      if (!/^\d*(\.\d+)?$/.test(star.decDMS.seconds)) {
        return { ...newStarError, dec: { valid: false, error: 'The seconds must be a positive decimal.' } };
      }

      const ra = parseFloat(star.ra);
      const raHours = parseInt(star.raHMS.hours);
      if ((raHours < 0 || raHours >= 24) || (ra < 0 || ra >= 360)) {
        return { ...newStarError, ra: { valid: false, error: 'The right ascension must be between 0h and 24h.' } };
      }
    }

    const dec = parseFloat(star.dec);
    if (dec < -90 || dec > 90) {
      return { ...newStarError, dec: { valid: false, error: 'The declination must be between -90° and 90°.' } };
    }
  }

  return newStarError;
};

const StarInput = ({ onStarChange, setErrorMessage, setStarValid }) => {
  const [inputType, setInputType] = useState('name');  // 'name', 'hip', 'radec'
  const [radecFormat, setRadecFormat] = useState('decimal');  // 'decimal', 'dms'
  const [star, setStar] = useState({
    name: 'Mars',
    hip: '87937',
    ra: '0',
    dec: '0',
    raHMS: { hours: '0', minutes: '0', seconds: '0' },
    decDMS: { degrees: '0', minutes: '0', seconds: '0' },
    type: 'name'
  });
  const [starError, setStarError] = useState({
    name: { valid: true, error: '' },
    hip: { valid: true, error: '' },
    ra: { valid: true, error: '' },
    dec: { valid: true, error: '' }
  });

  useEffect(() => {
    onStarChange({
      name: star.name,
      hip: parseInt(star.hip).toString(),
      ra: parseFloat(star.ra).toString(),
      dec: parseFloat(star.dec).toString(),
      type: star.type
    });
  }, [star, onStarChange]);

  useEffect(() => {
    setErrorMessage('');
  }, [inputType, star, setErrorMessage]);

  const handleInputTypeChange = useCallback((event, newInputType) => {
    if (newInputType !== null) {
      setInputType(newInputType);
      setStar((prev) => ({ ...prev, type: newInputType }));
    }
  }, []);

  const handleRadecFormatChange = useCallback((event) => {
    setRadecFormat(event.target.value);
    // setStar((prev) => ({ ...prev,
    //   ra: '0',
    //   dec: '0',
    //   raHMS: { hours: '0', minutes: '0', seconds: '0' },
    //   decDMS: { degrees: '0', minutes: '0', seconds: '0' },
    // }));
  }, []);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setStar((prevStar) => {
      const newStar = { ...prevStar };
      const [field, subfield] = name.split('.');

      if (subfield && radecFormat === 'dms') {
        newStar[field][subfield] = value;
        /* If at least one of the subfields is provided, convert HMS/DMS to decimal degrees */
        if (field === 'raHMS') {
          newStar.ra = newStar.raHMS.hours || newStar.raHMS.minutes || newStar.raHMS.seconds
            ? (hmsToDecimal({
                hours: newStar.raHMS.hours || 0,
                minutes: newStar.raHMS.minutes || 0,
                seconds: newStar.raHMS.seconds || 0
              }) * 15).toString()
            : '';
        } else if (field === 'decDMS') {
          newStar.dec = newStar.decDMS.degrees || newStar.decDMS.minutes || newStar.decDMS.seconds
            ? dmsToDecimal({
                degrees: newStar.decDMS.degrees || 0,
                minutes: newStar.decDMS.minutes || 0,
                seconds: newStar.decDMS.seconds || 0
              }).toString()
            : '';
        }
      } else {
        newStar[name] = value;
        /* Convert decimal degrees to HMS/DMS */
        if (field === 'ra') {
          const hms = decimalToHMS(parseFloat(value) / 15);
          newStar.raHMS.hours = hms.hours.toString();
          newStar.raHMS.minutes = hms.minutes.toString();
          newStar.raHMS.seconds = hms.seconds.toString();
        } else if (field === 'dec') {
          const dms = decimalToDMS(parseFloat(value));
          newStar.decDMS.degrees = dms.degrees.toString();
          newStar.decDMS.minutes = dms.minutes.toString();
          newStar.decDMS.seconds = dms.seconds.toString();
        }
      }

      return newStar;
    });
    setStarValid(true);
    setStarError({
      name: { valid: true, error: '' },
      hip: { valid: true, error: '' },
      ra: { valid: true, error: '' },
      dec: { valid: true, error: '' }
    });  // Reset error when user starts typing
  }, [radecFormat, setStarValid]);

  const debouncedValidateStar = useMemo(
    () => debounce((inputType, radecFormat, star) => {
      const validationResult = validateStarSync(inputType, radecFormat, star);
      const isValid = !Object.values(validationResult).some(item => !item.valid);
      setStarError(validationResult);
      setStarValid(isValid);
    }, Config.typingTimeout),
    [setStarValid]
  );

  useEffect(() => {
    debouncedValidateStar(inputType, radecFormat, star);
    /* Cleanup function */
    return () => {
      debouncedValidateStar.cancel();
    };
  }, [inputType, radecFormat, star, debouncedValidateStar]);

  return (
    <Stack direction="column">
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
          Planet
        </ToggleButton>
        <ToggleButton value="hip" aria-label="Input Hipparchus">
          Star
        </ToggleButton>
        <ToggleButton value="radec" aria-label="Input RA/Dec">
          RA/Dec (J2000)
        </ToggleButton>
      </ToggleButtonGroup>

      {inputType === 'name' && (
        <TextField
          required
          select
          autoComplete="off"
          label="Planet Name"
          InputLabelProps={{ htmlFor: 'star-select' }}
          inputProps={{ id: 'star-select' }}
          size="small"
          variant="outlined"
          name="name"
          value={star.name}
          onChange={handleInputChange}
          fullWidth
          error={!starError.name.valid}
          helperText={!starError.name.valid && starError.name.error}
          sx={{ marginTop: 2 }}
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
          sx={{ marginTop: 2 }}
        />
      )}
      {inputType === 'radec' && (
        <div>
          <FormControl>
            <RadioGroup
              row
              sx={{ marginTop: 0.8, marginBottom: 1, justifyContent: 'center' }}
              value={radecFormat}
              onChange={handleRadecFormatChange}
            >
              <FormControlLabel
                size="small"
                value="decimal"
                control={<Radio />}
                label="Decimal Degrees"
                sx={{
                  paddingX: 2,
                  marginRight: 0,
                  '& .MuiSvgIcon-root': {
                    fontSize: '1rem',
                  },
                }}
              />
              <FormControlLabel
                size="small"
                value="dms"
                control={<Radio />}
                label="HMS and DMS"
                sx={{
                  paddingX: 2,
                  marginRight: 0,
                  '& .MuiSvgIcon-root': {
                    fontSize: '1rem',
                  },
                }}
              />
            </RadioGroup>
          </FormControl>

          {radecFormat === 'decimal' ? (
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  required
                  label="Right Ascension (RA)"
                  placeholder="Enter in decimal degrees"
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
                  label="Declination (Dec)"
                  placeholder="Enter in decimal degrees"
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
          ) : (
            <Grid container spacing={{ xs: 3, sm: 2, md: 3 }} alignItems="flex-start">
              <Grid container item xs={12} sm={12} md={6} rowSpacing={2} columnSpacing={1} alignItems="center" justifyContent="space-between">
                <Grid item xs={12} sm="auto" md="auto">
                  <Typography variant="body1">
                    RA
                </Typography>
                </Grid>
                <Grid item xs={12} sm={3.5} md={3.5}>
                  <TextField
                    required
                    label="Hours"
                    size="small"
                    variant="outlined"
                    name="raHMS.hours"
                    type="number"
                    value={star.raHMS.hours}
                    onChange={handleInputChange}
                    inputProps={{ min: 0, max: 23 }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3.5} md={3.5}>
                  <TextField
                    required
                    label="Minutes"
                    size="small"
                    variant="outlined"
                    name="raHMS.minutes"
                    type="number"
                    value={star.raHMS.minutes}
                    onChange={handleInputChange}
                    inputProps={{ min: 0, max: 59 }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3.5} md={3.5}>
                  <TextField
                    required
                    label="Seconds"
                    size="small"
                    variant="outlined"
                    name="raHMS.seconds"
                    type="number"
                    value={star.raHMS.seconds}
                    onChange={handleInputChange}
                    inputProps={{ min: 0, max: 59 }}
                    fullWidth
                  />
                </Grid>
                {!starError.ra.valid && (
                  <Grid item xs={12} sm={12} md={12} style={{ paddingTop: 0 }}>
                    <Typography color="error" variant="body2" sx={{ marginTop: '4px', marginX: '14px', fontSize: '0.85rem', textAlign: 'left' }}>
                      {starError.ra.error}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Grid container item xs={12} sm={12} md={6} rowSpacing={2} columnSpacing={1} alignItems="center" justifyContent="space-between">
                <Grid item xs={12} sm="auto" md="auto">
                  <Typography variant="body1">
                    Dec
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3.5} md={3.5}>
                  <TextField
                    required
                    label="Degrees"
                    size="small"
                    variant="outlined"
                    name="decDMS.degrees"
                    type="number"
                    value={star.decDMS.degrees}
                    onChange={handleInputChange}
                    inputProps={{ min: -90, max: 90 }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3.5} md={3.5}>
                  <TextField
                    required
                    label="Minutes"
                    size="small"
                    variant="outlined"
                    name="decDMS.minutes"
                    type="number"
                    value={star.decDMS.minutes}
                    onChange={handleInputChange}
                    inputProps={{ min: 0, max: 59 }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3.5} md={3.5}>
                  <TextField
                    required
                    label="Seconds"
                    size="small"
                    variant="outlined"
                    name="decDMS.seconds"
                    type="number"
                    value={star.decDMS.seconds}
                    onChange={handleInputChange}
                    inputProps={{ min: 0, max: 59 }}
                    fullWidth
                  />
                </Grid>
                {!starError.dec.valid && (
                  <Grid item xs={12} sm={12} md={12} style={{ paddingTop: 0 }}>
                    <Typography color="error" variant="body2" sx={{ marginTop: '4px', marginX: '14px', fontSize: '0.85rem', textAlign: 'left' }}>
                      {starError.dec.error}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
        </div>
      )}
    </Stack>
  );
};

StarInput.propTypes = {
  onStarChange: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setStarValid: PropTypes.func.isRequired
};

export default StarInput;
