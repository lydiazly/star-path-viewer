// src/components/StarInput.js
import React, { useState, useEffect } from 'react';
import { TextField, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';

/* TODO: validateStar() */

const StarInput = ({ onStarChange, setErrorMessage }) => {
  const [inputType, setInputType] = useState('name');  // 'name', 'hip', 'radec'
  const [star, setStar] = useState({ name: 'Mars', hip: '', ra: '', dec: '' });

  useEffect(() => {
    onStarChange(star);
  }, [star, onStarChange]);

  useEffect(() => {
    setErrorMessage('');
  }, [inputType, star, setErrorMessage]);

  const handleInputTypeChange = (event, newInputType) => {
    if (newInputType !== null) {
      setInputType(newInputType);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStar((prevStar) => ({ ...prevStar, [name]: value }));
  };

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" spacing={2}>
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
      </Stack>

      {inputType === 'name' && (
        <TextField
          label="Planet Name"
          size="small"
          variant="outlined"
          name="name"
          value={star.name}
          onChange={handleInputChange}
          fullWidth
        />
      )}
      {inputType === 'hip' && (
        <TextField
          label="Hipparchus Catalogue Number"
          size="small"
          variant="outlined"
          name="hip"
          type="number"
          value={star.hip}
          onChange={handleInputChange}
          fullWidth
        />
      )}
      {inputType === 'radec' && (
        <Stack direction="row" spacing={2}>
          <TextField
            label="RA"
            size="small"
            variant="outlined"
            name="ra"
            type="number"
            value={star.ra}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Dec"
            size="small"
            variant="outlined"
            name="dec"
            type="number"
            value={star.dec}
            onChange={handleInputChange}
            fullWidth
          />
        </Stack>
      )}
    </Stack>
  );
};

export default StarInput;
