// src/components/LocationInputTypeToggle.js
import React, { useCallback } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useLocationInput } from '../context/LocationInputContext';

const InputTypeToggle = () => {
  const { inputType, setInputType } = useLocationInput();

  const handleInputTypeChange = useCallback((event, newInputType) => {
    if (newInputType !== null) {
      setInputType(newInputType);
    }
  }, [setInputType]);

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
      <ToggleButton value="address" aria-label="Search Address">
        Search Address
      </ToggleButton>
      <ToggleButton value="coordinates" aria-label="Enter Coordinates">
        Enter Coordinates
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default React.memo(InputTypeToggle);
