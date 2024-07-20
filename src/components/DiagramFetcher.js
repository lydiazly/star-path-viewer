// src/components/DiagramFetcher.js
import React from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import LocationInput from './LocationInput';
import Config from '../Config';

const DiagramFetcher = ({ setDiagramId, setSvgData, setAnno, setErrorMessage, clearImage }) => {
  const handleDraw = async ({year, month = 1, day = 1, lat, lng, planet = null, hip = -1, ra = null, dec = null}) => {
    clearImage(); // Clear the SVG data before making the API call
    
    const params = { year, month, day, lat, lng };

    if (planet) {
      params.planet = planet;
    } else if (parseInt(hip) > 0) {
      params.hip = parseInt(hip);
    } else if (ra && dec) {
      params.ra = parseFloat(ra);
      params.dec = parseFloat(dec);
    } else {
      setErrorMessage('Either planet name, Hipparchus catalogue number, or (ra, dec) is invalid.');
      return;
    }
    
    try {
      const response = await axios.get(`${Config.serverUrl}/diagram`, {
        params: params
      });

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
