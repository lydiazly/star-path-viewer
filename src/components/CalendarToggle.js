// src/components/CalendarToggle.js
import React, { useCallback } from 'react';
import { FormControl, RadioGroup, Radio } from '@mui/material';
import { useDateInput } from '../context/DateInputContext';
import CustomFormControlLabel from './ui/CustomFormControlLabel';

const CalendarToggle = () => {
  const {
    flag,
    cal, setCal,
    setAdjusting,
  } = useDateInput();

  const handleCalChange = useCallback((event) => {
    /* Keep the date values */
    setCal(event.target.value);
    setAdjusting(true);
  }, [setCal, setAdjusting]);

  return (
    <FormControl>
      <RadioGroup
        row
        sx={{ marginTop: -1, marginBottom: 1, justifyContent: 'space-around' }}
        value={cal}
        onChange={handleCalChange}
      >
        <CustomFormControlLabel
          size="small"
          value=""
          control={<Radio />}
          label="Gregorian Calendar"
          checked={cal === ''}
        />
        <CustomFormControlLabel
          size="small"
          value="j"
          control={<Radio disabled={!!flag} />}
          label="Julian Calendar"
          checked={cal === 'j'}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default React.memo(CalendarToggle);
