// src/components/Input/Star/RadecFormatToggle.js
import React, { useCallback } from 'react';
import { FormControl, RadioGroup, Radio } from '@mui/material';
import { useStarInput } from '../../../context/StarInputContext';
import * as actionTypes from '../../../context/starInputActionTypes';
import { FORMAT_DD, FORMAT_DMS } from '../../../utils/constants';
import CustomFormControlLabel from '../../UI/CustomFormControlLabel';

const RadecFormatToggle = () => {
  const {
    radecFormat,
    starDispatch,
  } = useStarInput();

  const handleRadecFormatChange = useCallback((event) => {
    /* Clear the fields */
    starDispatch({ type: actionTypes.SET_STAR_RADEC, payload: { ra: '', dec: '' } });
    starDispatch({ type: actionTypes.SET_STAR_RA_HMS, payload: { hours: '', minutes: '', seconds: '' } });
    starDispatch({ type: actionTypes.SET_STAR_DEC_DMS, payload: { degrees: '', minutes: '', seconds: '' } });

    starDispatch({ type: actionTypes.SET_RADEC_FORMAT, payload: event.target.value });
  }, [starDispatch]);

  return (
    <FormControl>
      <RadioGroup
        row
        sx={{ marginTop: 0.8, marginBottom: 1, justifyContent: 'space-around' }}
        value={radecFormat}
        onChange={handleRadecFormatChange}
      >
        <CustomFormControlLabel
          size="small"
          name={FORMAT_DMS}
          value={FORMAT_DMS}
          control={<Radio />}
          label="HMS and DMS"
          checked={radecFormat === FORMAT_DMS}
        />
        <CustomFormControlLabel
          size="small"
          name={FORMAT_DD}
          value={FORMAT_DD}
          control={<Radio />}
          label="Decimal Degrees"
          checked={radecFormat === FORMAT_DD}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default React.memo(RadecFormatToggle);
