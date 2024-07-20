// src/components/DiagramFetcher.js
import React from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import LocationInput from './LocationInput';
import Config from '../Config';

const DiagramFetcher = ({ setDiagramId, setSvgData, setAnno, setErrorMessage, clearImage }) => {
  const handleDraw = async (year, month, day, lat, lng) => {
    clearImage(); // Clear the SVG data before making the API call
    console.log(`year: ${year}`);
    
    try {
      const response = await axios.get(`${Config.serverUrl}/diagram`, {
        params: { year, month, day, lat, lng }
      });

      const id = response.data.diagramId;
      const annotations = response.data.annotations;
      console.log(`annotations: ${annotations}`);
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

      setDiagramId(id);
      setSvgData(sanitizedSvg);
      setAnno(annotations);
      setErrorMessage(''); // Clear any previous error message
    
    } catch (error) {
      if (error.response && error.response.data.error) {
        setErrorMessage(error.response.data.error);  // Print the error message from the server
      } else if (error.request) {
        setErrorMessage('No response received from the server.');
      } else {
        setErrorMessage('Error: ' + error.message);
      }
      clearImage(); // Clear SVG on error
    }
  };

  return (
    <div>
      <LocationInput onDraw={handleDraw} />
      {/* DateInput */}
    </div>
  );
};

export default DiagramFetcher;
