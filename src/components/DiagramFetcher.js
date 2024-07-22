// src/components/DiagramFetcher.js
import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Button, Stack } from '@mui/material';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import DateLocationDisplay from './DateLocationDisplay';
import Config from '../Config';

const DiagramFetcher = ({ setDiagramId, setSvgData, setAnno, setErrorMessage, clearImage }) => {
  const [date, setDate] = useState({ year: '', month: '', day: '' });
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [showDateLocation, setShowDateLocation] = useState(false);

  const handleDraw = async () => {
    clearImage();  // Clear the SVG data before making the API call
    setErrorMessage('');  // Clear any previous error message before making the API call
    setShowDateLocation(false);  // Hide the date and location display initially

    const { year, month, day } = date;
    const { lat, lng } = location;

    if (!year || !month || !day || !lat || !lng) {
      setErrorMessage('Please provide all date and location inputs.');
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
    <Stack direction='column' spacing={2}>
      <LocationInput onLocationChange={setLocation} />
      <DateInput onDateChange={setDate} />
      <Button variant="contained" color="primary" onClick={handleDraw}>
        Draw Star Trail
      </Button>
      {showDateLocation && (
        <DateLocationDisplay date={[date.year, date.month, date.day]} location={location} />
      )}
    </Stack>
  );
};

export default DiagramFetcher;
