// src/components/DiagramFetcher.js
import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import LocationInput from './LocationInput';
import Config from '../Config';

const DiagramFetcher = ({ setSvgData, setErrorMessage, clearSvgData }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const handleDraw = async (lat, lng) => {
    clearSvgData(); // Clear the SVG data before making the API call
    try {
      const response = await axios.get(`${Config.serverUrl}/diagram`, {
        params: { year, month, day, lat, lng }
      });

      const svgBase64 = response.data.svgData;
      // Decode base64 to binary string
      const binaryString = atob(svgBase64);
      // Convert binary string to an array of char codes
      const charCodes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        charCodes[i] = binaryString.charCodeAt(i);
      }
      // Decode UTF-8 from char codes
      const decoder = new TextDecoder('utf-8');
      const svgDecoded = decoder.decode(charCodes);
      // Sanitize the SVG content using DOMPurify
      const sanitizedSvg = DOMPurify.sanitize(svgDecoded, {
        ADD_TAGS: ['use', 'clipPath'],
        ADD_ATTR: ['id', 'xlink:href', 'clip-path']
      });

      setSvgData(sanitizedSvg);
      setErrorMessage(''); // Clear any previous error message
    } catch (error) {
      if (error.response && error.response.data.error) {
        setErrorMessage(error.response.data.error);  // Print the error message from the server
      } else if (error.request) {
        setErrorMessage('No response received from the server.');
      } else {
        setErrorMessage('Error: ' + error.message);
      }
      clearSvgData(); // Clear SVG on error
    }
  };

  return (
    <div>
      <LocationInput onDraw={handleDraw} />
    </div>
  );
};

export default DiagramFetcher;
