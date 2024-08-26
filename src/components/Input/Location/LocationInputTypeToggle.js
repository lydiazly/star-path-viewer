// src/components/Input/Location/LocationInputTypeToggle.js
import React, { useCallback } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useLocationInput } from '../../../context/LocationInputContext';
import * as actionTypes from '../../../context/locationInputActionTypes';
import { TYPE_ADD, TYPE_COORD } from '../../../utils/constants';

const InputTypeToggle = () => {
  const { inputType, locationDispatch } = useLocationInput();

  const handleInputTypeChange = useCallback((event, newInputType) => {
    if (newInputType !== null) {
      locationDispatch({ type: actionTypes.SET_INPUT_TYPE, payload: newInputType });
    }
  }, [locationDispatch]);

  return (
    <ToggleButtonGroup
      color="primary"
      size="small"
      value={inputType}
      exclusive
      onChange={handleInputTypeChange}
      aria-label="Input type"
      fullWidth
    >
      <ToggleButton value={TYPE_ADD} aria-label="Search Address">
        Search Address
      </ToggleButton>
      <ToggleButton value={TYPE_COORD} aria-label="Enter Coordinates">
        Enter Coordinates
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default React.memo(InputTypeToggle);
