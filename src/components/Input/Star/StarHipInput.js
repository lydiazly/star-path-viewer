// src/components/Input/Star/StarHipInput.js
import React, { useCallback } from 'react';
import { TextField } from '@mui/material';
import { useStarInput } from '../../../context/StarInputContext';
import * as actionTypes from '../../../context/starInputActionTypes';
import { TYPE_HIP } from '../../../utils/constants';

const StarHipInput = () => {
  const {
    starHip,
    starError, starNullError,
    starDispatch,
  } = useStarInput();

  const handleInputChange = useCallback((event) => {
    starDispatch({ type: actionTypes.SET_STAR_HIP, payload: event.target.value });
  }, [starDispatch]);

  return (
    <TextField
      required
      label="Hipparchus Catalogue Number"
      size="small"
      variant="outlined"
      name={TYPE_HIP}
      type="number"
      value={starHip}
      onChange={handleInputChange}
      onWheel={(event) => event.target.blur()}
      fullWidth
      error={!!starError.hip || !!starNullError.hip}
      helperText={starError.hip || starNullError.hip}
      sx={{ marginTop: 2 }}
    />
  );
};

export default React.memo(StarHipInput);
