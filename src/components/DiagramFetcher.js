// src/components/DiagramFetcher.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Box, Stack, Button, Divider } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CircularProgress from '@mui/material/CircularProgress';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import DateLocationDisplay from './DateLocationDisplay';
import StarInput from './StarInput';
import Config from '../Config';
import useStyles from '../styles/styles';

const DiagramFetcher = ({ setDiagramId, setSvgData, setAnno, errorMessage, setErrorMessage, clearImage }) => {
  const [date, setDate] = useState({ year: '', month: '', day: '' });
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [star, setStar] = useState({ name: '', hip: '', ra: '', dec: '' });
  const [info, setInfo] = useState({ year: '', month: '', day: '', lat: '', lng: '', name: '', hip: '', ra: '', dec: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

    const { year, month, day } = date;
    const { lat, lng } = location;
    const { name, hip, ra, dec } = star;

    if (!year || !month || !day) {
      setErrorMessage('Please provide a date.');
      return false;
    }

    if (!lat || !lng) {
      setErrorMessage('Please provide a location.');
      return false;
    }

    if (!name && !hip && (!ra || !dec)) {
      setErrorMessage('Please provide a name, Hipparchus catalogue number, or RA/Dec.');
      return false;
    }

    setLoading(true);

    const params = { year, month, day, lat, lng };
    ['name', 'hip', 'ra', 'dec'].forEach(key => {
      if (star[key]) {
        params[key] = key === 'name' ? star[key].toLowerCase() : star[key];
      }
    });

    try {
      const response = await axios.get(`${Config.serverUrl}/diagram`, {
        params,
        timeout: Config.serverTimeout
      });

      const newInfo = {};
      ['year', 'month', 'day', 'lat', 'lng', 'name', 'hip', 'ra', 'dec'].forEach(key => {
        if (response.data.hasOwnProperty(key)) {
          newInfo[key] = response.data[key];
        }
      });
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
      setLoading(false);

    } catch (error) {
      if (error.response && error.response.data.error) {
        setErrorMessage(error.response.data.error);  // Print the error message from the server
      } else if (error.request) {
        setErrorMessage('No response received from the server: ' + error.message);
      } else {
        setErrorMessage('Error: ' + error.message);
      }
      clearImage();  // Clear SVG on error
    }
  }, [date, location, star, loading, clearImage, setDiagramId, setSvgData, setAnno, setErrorMessage]);

  return (
    <Box sx={{ justifyContent: 'center' }}>
      <Stack direction="column" spacing={2}>
        <Divider className={classes.dividerText}>LOCATION</Divider>

        <LocationInput onLocationChange={setLocation} setErrorMessage={setErrorMessage} />

        <Divider className={classes.dividerText}>DATE</Divider>

        <DateInput onDateChange={setDate} setErrorMessage={setErrorMessage} />

        <Divider className={classes.dividerText}>CELESTIAL OBJECT</Divider>

        <StarInput onStarChange={setStar} setErrorMessage={setErrorMessage} /> {/* Add the StarInput component */}
      </Stack>

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={loading ? <CircularProgress color="inherit" size="1rem" /> : <ArrowForwardIcon />}
        sx={{ marginTop: 2 }}
        disabled={!!errorMessage || loading}
        onClick={handleDraw}
        fullWidth
      >
        Draw Star Trail
      </Button>

      {success && (
        <DateLocationDisplay
          date={{ year: info.year, month: info.month, day: info.day }}
          location={{ lat: info.lat, lng: info.lng }}
          star={{ name: info.name, hip: info.hip, ra: info.ra, dec: info.dec }}
        />
      )}
    </Box>
  );
};

export default DiagramFetcher;
