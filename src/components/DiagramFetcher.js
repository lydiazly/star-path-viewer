// src/components/DiagramFetcher.js
import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Box, Stack, Button, Divider } from '@mui/material';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import DateLocationDisplay from './DateLocationDisplay';
import Config from '../Config';
import useStyles from '../styles/styles';


const DiagramFetcher = ({ setDiagramId, setSvgData, setAnno, errorMessage, setErrorMessage, clearImage }) => {
  const [date, setDate] = useState({ year: '', month: '', day: '' });
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [showDateLocation, setShowDateLocation] = useState(false);
  const classes = useStyles();

  const handleDraw = async () => {
    clearImage();  // Clear the SVG data before making the API call
    setErrorMessage('');  // Clear any previous error message before making the API call
    setShowDateLocation(false);  // Hide the date and location display initially

    const { year, month, day } = date;
    const { lat, lng } = location;

    if (!year || !month || !day) {
      setErrorMessage('Please provide all date inputs.');
      return;
    }

    if (!lat || !lng) {
      setErrorMessage('Please provide all location inputs.');
      return;
    }

    const params = { year, month, day, lat, lng, hip: '17702' };  // TODO

    try {
      const response = await axios.get(`${Config.serverUrl}/diagram`, { params });

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
      setShowDateLocation(true);  // Show the date and location display

    } catch (error) {
      if (error.response && error.response.data.error) {
        setErrorMessage(error.response.data.error);  // Print the error message from the server
      } else if (error.request) {
        setErrorMessage('No response received from the server.');
      } else {
        setErrorMessage('Error: ' + error.message);
      }
      clearImage();  // Clear SVG on error
    }
  };

  return (
    <Box>
      <Stack direction='column' spacing={2}>
        <Divider className={classes.dividerText}>LOCATION</Divider>

        <LocationInput onLocationChange={setLocation} setErrorMessage={setErrorMessage} />

        <Divider className={classes.dividerText}>DATE</Divider>

        <DateInput onDateChange={setDate} setErrorMessage={setErrorMessage} />

        <Divider className={classes.dividerText}>CELESTIAL OBJECT</Divider>
      </Stack>
      
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ marginTop: 3 }}
        disabled={!!errorMessage}
        onClick={handleDraw}
        fullWidth
      >
        Draw Star Trail
      </Button>

      {showDateLocation && (
        <DateLocationDisplay date={[date.year, date.month, date.day]} location={location} />
      )}
    </Box>
  );
};

export default DiagramFetcher;
