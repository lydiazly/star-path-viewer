// src/components/Input/Location/LocationInputTypeToggle.js
import React, { useCallback } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useLocationInput } from '../../../context/LocationInputContext';
import * as actionTypes from '../../../context/locationInputActionTypes';
import { TYPE_ADDR, TYPE_COORD } from '../../../utils/constants';

const LocationInputTypeToggle = () => {
  const { locationInputType, locationDispatch } = useLocationInput();

  const handleInputTypeChange = useCallback((event, newInputType) => {
    if (newInputType !== null) {
      /* Clear the fields */
      if (newInputType === TYPE_ADDR) {
        locationDispatch({ type: actionTypes.CLEAR_SEARCH_TERM });  // This clears the location obj as well
      }

      locationDispatch({ type: actionTypes.SET_INPUT_TYPE, payload: newInputType });
    }
  }, [locationDispatch]);

  return (
    <ToggleButtonGroup
      color="primary"
      size="small"
      value={locationInputType}
      exclusive
      onChange={handleInputTypeChange}
      aria-label="Input type"
      fullWidth
    >
      <ToggleButton value={TYPE_ADDR} aria-label="Search Address">
        Search Address
      </ToggleButton>
      <ToggleButton value={TYPE_COORD} aria-label="Enter Coordinates">
        Enter Coordinates
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default React.memo(LocationInputTypeToggle);
