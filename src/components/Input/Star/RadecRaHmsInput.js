// src/components/Input/Star/RadecRaHmsInput.js
import React, { useCallback } from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { useStarInput } from '../../../context/StarInputContext';
import * as actionTypes from '../../../context/starInputActionTypes';
import { hmsToDecimal } from '../../../utils/dateUtils';

const RadecRaHmsInput = () => {
  const {
    starRaHMS,
    starError, starNullError,
    starDispatch,
  } = useStarInput();

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    const newRaHMS = { ...starRaHMS };
    newRaHMS[name] = value;
    /* If at least one of the fields is provided, convert HMS to decimal degrees */
    const newRa = newRaHMS.hours || newRaHMS.minutes || newRaHMS.seconds
      ? (hmsToDecimal({
          sign: newRaHMS.hours[0] === '-' ? -1 : 1,
          hours: Math.abs(parseInt(newRaHMS.hours)) || 0,
          minutes: parseInt(newRaHMS.minutes) || 0,
          seconds: parseInt(newRaHMS.seconds) || 0,
        }) * 15).toString()
      : '';
    switch (name) {
      case 'hours':
        starDispatch({ type: actionTypes.SET_STAR_RA_HOURS, payload: value });
        break;
      case 'minutes':
        starDispatch({ type: actionTypes.SET_STAR_RA_MINUTES, payload: value });
        break;
      case 'seconds':
        starDispatch({ type: actionTypes.SET_STAR_RA_SECONDS, payload: value });
        break;
      default:
        return;
    }
    starDispatch({ type: actionTypes.SET_STAR_RA, payload: newRa });
  }, [starRaHMS, starDispatch]);

  return (
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
          name="hours"
          type="number"
          value={starRaHMS.hours}
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
          name="minutes"
          type="number"
          value={starRaHMS.minutes}
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
          name="seconds"
          type="number"
          value={starRaHMS.seconds}
          onChange={handleInputChange}
          inputProps={{ min: 0, max: 59 }}
          fullWidth
        />
      </Grid>
      {(starError.ra || starNullError.ra) && (
        <Grid item xs={12} sm={12} md={12} style={{ paddingTop: 0 }}>
          <Typography color="error" variant="body2" sx={{ marginTop: '4px', marginX: '14px', fontSize: '0.85rem', textAlign: 'left' }}>
            {starError.ra || starNullError.ra}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default React.memo(RadecRaHmsInput);
