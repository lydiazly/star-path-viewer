// src/components/Navigation/Notice.js
import React from 'react';
import { Alert } from '@mui/material';
import Config from '../../Config';

const Notice = (notice) => {
  return (
    <Alert
      severity="warning"
      sx={{ width: '100%', mt: 1, mb: 1, textAlign: 'left' }}
    >
      {Config.notice}
    </Alert>
  );
};

export default Notice;
