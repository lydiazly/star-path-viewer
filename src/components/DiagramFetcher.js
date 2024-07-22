// src/components/DiagramFetcher.js
import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import Button from '@mui/material/Button';
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

      const _diagramId = response.data.diagramId;
      const _anno = response.data.annotations;
      const _svgBase64 = response.data.svgData;
      // Decode base64 to binary string
      const _svgBinaryString = atob(_svgBase64);
      // Convert binary string to an array of char codes
      const _charCodes = new Uint8Array(_svgBinaryString.length);
      for (let i = 0; i < _svgBinaryString.length; i++) {
        _charCodes[i] = _svgBinaryString.charCodeAt(i);
      }
      // Decode UTF-8 from char codes
      const _decoder = new TextDecoder('utf-8');
      const _svgDecoded = _decoder.decode(_charCodes);
      // Sanitize the SVG content using DOMPurify
      const _sanitizedSvg = DOMPurify.sanitize(_svgDecoded, {
        ADD_TAGS: ['use', 'clipPath'],
        ADD_ATTR: ['id', 'xlink:href', 'clip-path']
      });

      setDiagramId(_diagramId);
      setSvgData(_sanitizedSvg);
      setAnno(_anno);
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
    <div>
      <LocationInput onLocationChange={setLocation} />
      <DateInput onDateChange={setDate} />
      <br />
      <Button variant="contained" color="primary" onClick={handleDraw}>
        Draw
      </Button>
      {showDateLocation && (
        <>
          <br />
          <DateLocationDisplay date={[date.year, date.month, date.day]} location={location} />
        </>
      )}
    </div>
  );
};

export default DiagramFetcher;
