// src/components/DiagramFetcher.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Box, Stack, Button, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PropTypes from 'prop-types';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import StarInput from './StarInput';
import { STARS } from '../utils/constants';
import Config from '../Config';
import CustomDivider from './ui/CustomDivider';

const DiagramFetcher = ({ setDiagramId, setInfo, setSvgData, setAnno, setSuccess, errorMessage, setErrorMessage, clearImage }) => {
  const [date, setDate] = useState({ year: '', month: '', day: '', flag: '' });  // flag: 've', 'ss', 'ae', 'ws'
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [star, setStar] = useState({ name: '', hip: '', ra: '', dec: '', type: 'name' });  // type: 'name', 'hip', 'radec'
  const [loading, setLoading] = useState(false);
  const [dateValid, setDateValid] = useState(false);
  const [locationValid, setLocationValid] = useState(false);
  const [starValid, setStarValid] = useState(false);

  /* Initiate with the current date */
  useEffect(() => {
    const now = new Date();
    setDate({
      year: now.getFullYear().toString(),
      month: (now.getMonth() + 1).toString(),
      day: now.getDate().toString(),
      flag: '',
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

    const params = {};
    
    if (date.flag && date.year) {
      params.year = parseInt(date.year).toString();
      params.flag = date.flag;
    } else if (date.year && date.month && date.day) {
      params.year = parseInt(date.year).toString();
      params.month = parseInt(date.month).toString();
      params.day = parseInt(date.day).toString();
    } else {
      setErrorMessage('Either year, month, or day is invalid.');
      setSuccess(false);
      setLoading(false);
      return;
    }

    if (location.lat && location.lng) {
      params.lat = parseFloat(location.lat).toString();
      params.lng = parseFloat(location.lng).toString();
    } else {
      setErrorMessage('Either latitude or longitude is invalid.');
      setSuccess(false);
      setLoading(false);
      return;
    }
    
    if (star.type === 'name' && STARS[star.name]) {
      params.name = STARS[star.name];
    } else if (star.type === 'hip' && star.hip) {
      params.hip = parseInt(star.hip).toString();
    } else if (star.type === 'radec' && star.ra && star.dec) {
      params.ra = parseFloat(star.ra).toString();
      params.dec = parseFloat(star.dec).toString();
    } else {
      setErrorMessage('Either planet name, Hipparchus catalogue number, or (ra, dec) is invalid.');
      setSuccess(false);
      setLoading(false);
      return;
    }
    // console.log("params", params);

    try {
      /* Plot */
      const response = await axios.get(`${Config.serverUrl}/diagram`, {
        params,
        timeout: Config.serverGetDiagramTimeout
      });

      const newInfo = Object.keys(params).reduce((info, key) => {
        if (response.data.hasOwnProperty(key)) info[key] = response.data[key].toString();
        return info;
      }, {});
      
      if (response.data.hasOwnProperty('name')) {
        newInfo.name = response.data.name;
      }
      
      newInfo.eqxSolTime = [];
      if (response.data.flag && response.data.eqxSolTime.length > 0) {
        const res_month = response.data.eqxSolTime[1].toString();
        const res_day = response.data.eqxSolTime[2].toString();
        newInfo.eqxSolTime = response.data.eqxSolTime;
        newInfo.month = res_month;
        newInfo.day = res_day;
        setDate({ ...date, month: res_month, day: res_day });
      }
      setInfo(newInfo);
      // console.log("info: ", newInfo);

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
      setErrorMessage(error.response?.data?.error || error.message || 'An error occurred');
      clearImage();  // Clear SVG on error
      setSuccess(false);

    } finally {
      setLoading(false);
    }
  }, [date, location, star, loading, clearImage, setDiagramId, setInfo, setSvgData, setAnno, setSuccess, setErrorMessage]);

  return (
    <Box>
      <Stack direction="column" spacing={2} id="input-fields">
        <Stack direction="column" spacing={1} id="location-input">
          <CustomDivider>LOCATION</CustomDivider>
          <LocationInput onLocationChange={setLocation} setErrorMessage={setErrorMessage} setLocationValid={setLocationValid} />
        </Stack>

        <Stack direction="column" spacing={1} id="date-input">
          <CustomDivider>DATE</CustomDivider>
          <DateInput onDateChange={setDate} setErrorMessage={setErrorMessage} setDateValid={setDateValid} />
        </Stack>

        <Stack direction="column" spacing={1} id="star-input">
          <CustomDivider>CELESTIAL OBJECT</CustomDivider>
          <StarInput onStarChange={setStar} setErrorMessage={setErrorMessage} setStarValid={setStarValid} />
        </Stack>
      </Stack>

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={loading
          ? <CircularProgress color="inherit" size="1rem" sx={{ mr: 1 }} />
          : <ArrowForwardIcon />}
        sx={{ marginTop: 3 }}
        disabled={!!errorMessage || loading || !dateValid || !locationValid || !starValid}
        onClick={handleDraw}
        fullWidth
      >
        Draw Star Trail
      </Button>
    </Box>
  );
};

DiagramFetcher.propTypes = {
  setDiagramId: PropTypes.func.isRequired,
  setInfo: PropTypes.func.isRequired,
  setSvgData: PropTypes.func.isRequired,
  setAnno: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func.isRequired,
  clearImage: PropTypes.func.isRequired,
};

export default DiagramFetcher;
