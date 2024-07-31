// src/components/DiagramFetcher.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Box, Stack, Button, Divider, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PropTypes from 'prop-types';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import DateLocationDisplay from './DateLocationDisplay';
import StarInput from './StarInput';
import { STARS } from '../utils/constants';
import Config from '../Config';
import useStyles from '../styles/styles';

const DiagramFetcher = ({ setDiagramId, setSvgData, setAnno, errorMessage, setErrorMessage, clearImage }) => {
  const [date, setDate] = useState({ year: '', month: '', day: '', flag: '' }); // flag: ve, ss, ae, ws
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [star, setStar] = useState({ name: '', hip: '', ra: '', dec: '' });
  const [info, setInfo] = useState({
    year: '', month: '', day: '', flag: '',
    lat: '', lng: '',
    name: '', hip: '', ra: '', dec: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dateValid, setDateValid] = useState(false);
  const [locationValid, setLocationValid] = useState(false);
  const [starValid, setStarValid] = useState(false);
  const classes = useStyles();

  /* Initiate with the current date */
  useEffect(() => {
    const now = new Date();
    setDate({
      year: now.getFullYear().toString(),
      month: (now.getMonth() + 1).toString(),
      day: now.getDate().toString(),
    });
  }, []);

  const handleDraw = useCallback(async () => {
    if (loading) {
      return;
    }

    clearImage();  // Clear the SVG data before making the API call
    setErrorMessage('');  // Clear any previous error message before making the API call
    setSuccess(false);
    setLoading(true);

    const params = { ...date, ...location, ...star, name: STARS[star.name] || '' };

    try {
      const response = await axios.get(`${Config.serverUrl}/diagram`, {
        params,
        timeout: Config.serverTimeout
      });

      const newInfo = Object.keys(params).reduce((info, key) => {
        if (response.data.hasOwnProperty(key)) info[key] = response.data[key];
        return info;
      }, {});
      setInfo(newInfo);

      const svgBase64 = response.data.svgData;
      /* Decode base64 to binary string */
      const svgBinaryString = atob(svgBase64);
      /* Convert binary string to an array of char codes */
      const charCodes = new Uint8Array(svgBinaryString.length);
      for (let i = 0; i < svgBinaryString.length; i++) {
        charCodes[i] = svgBinaryString.charCodeAt(i);
      }
      /* Decode UTF-8 from char codes */
      const decoder = new TextDecoder('utf-8');
      const svgDecoded = decoder.decode(charCodes);
      /* Sanitize the SVG content using DOMPurify */
      const sanitizedSvg = DOMPurify.sanitize(svgDecoded, {
        ADD_TAGS: ['use', 'clipPath'],
        ADD_ATTR: ['id', 'xlink:href', 'clip-path']
      });

      setDiagramId(response.data.diagramId);
      setSvgData(sanitizedSvg);
      setAnno(response.data.annotations);
      setErrorMessage('');  // Clear any previous error message
      setSuccess(true);

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'An error occurred';
      setErrorMessage(errorMsg);
      clearImage();  // Clear SVG on error
      setSuccess(false);

    } finally {
      setLoading(false);
    }
  }, [date, location, star, loading, clearImage, setDiagramId, setSvgData, setAnno, setErrorMessage]);

  return (
    <Box sx={{ justifyContent: 'center' }}>
      <Stack direction="column" spacing={2}>
        <Divider className={classes.dividerText}>LOCATION</Divider>

        <LocationInput onLocationChange={setLocation} setErrorMessage={setErrorMessage} setLocationValid={setLocationValid} />

        <Divider className={classes.dividerText}>DATE</Divider>

        <DateInput onDateChange={setDate} setErrorMessage={setErrorMessage} setDateValid={setDateValid} />

        <Divider className={classes.dividerText}>CELESTIAL OBJECT</Divider>

        <StarInput onStarChange={setStar} setErrorMessage={setErrorMessage} setStarValid={setStarValid} />
      </Stack>

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={loading
          ? <CircularProgress color="inherit" size="1rem" sx={{ mr: 1 }} />
          : <ArrowForwardIcon />}
        sx={{ marginTop: 2 }}
        disabled={!!errorMessage || loading || !dateValid || !locationValid || !starValid}
        onClick={handleDraw}
        fullWidth
      >
        Draw Star Trail
      </Button>

      {success && (
        <DateLocationDisplay
          date={{ year: info.year, month: info.month, day: info.day, flag: info.flag }}
          location={{ lat: info.lat, lng: info.lng }}
          star={{ name: info.name, hip: info.hip, ra: info.ra, dec: info.dec }}
        />
      )}
    </Box>
  );
};

DiagramFetcher.propTypes = {
  setDiagramId: PropTypes.func.isRequired,
  setSvgData: PropTypes.func.isRequired,
  setAnno: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func.isRequired,
  clearImage: PropTypes.func.isRequired,
};

export default DiagramFetcher;
