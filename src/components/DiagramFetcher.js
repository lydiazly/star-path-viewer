// src/components/DiagramFetcher.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Box, Stack, Alert, Button, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PropTypes from 'prop-types';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import StarInput from './StarInput';
import { STARS } from '../utils/constants';
import Config from '../Config';
import CustomDivider from './ui/CustomDivider';

/* Validate the input */
const validateInputSync = (
  location, date, star,
  setLocationFieldError, setDateFieldError, setStarFieldError,
  setLocationValid, setDateValid, setStarValid,
) => {
  if (location.type === 'address' && !location.place_id) {
    setLocationFieldError((prev) => ({ ...prev, address: 'Please search and select a location.' }));
    setLocationValid(false);
    return false;
  } else if (!location.lat || !location.lng) {
    if (!location.lat) {
      setLocationFieldError((prev) => ({ ...prev, lat: 'Please enter a latitude.' }));
    }
    if (!location.lng) {
      setLocationFieldError((prev) => ({ ...prev, lng: 'Please enter a longitude.' }));
    }
    setLocationValid(false);
    return false;
  }

  if (date.flag && !date.year) {
    setDateFieldError((prev) => ({ ...prev, year: 'Please enter a year.' }));
    setDateValid(false);
    return false;
  } else if (!date.year || !date.month || !date.day) {
    for (let key of ['year', 'month', 'day']) {
      if (!date[key]) {
        setDateFieldError((prev) => ({ ...prev, [key]: `Please enter a ${key}.` }));
      }
    }
    setDateValid(false);
    return false;
  }

  if (star.type === 'name' && !star.name) {
    setStarFieldError((prev) => ({ ...prev, name: 'Please select a planet.' }));
    setStarValid(false);
    return false;
  } else if (star.type === 'hip' && !star.hip) {
    setStarFieldError((prev) => ({ ...prev, hip: 'Please enter a Hipparchus catalogue number.' }));
    setStarValid(false);
    return false;
  } else if (star.type === 'radec' && (!star.ra || !star.dec)) {
    if (!star.ra) {
      setStarFieldError((prev) => ({ ...prev, ra: 'Please enter a right ascension.' }));
    }
    if (!star.dec) {
      setStarFieldError((prev) => ({ ...prev, dec: 'Please enter a declination.' }));
    }
    setStarValid(false);
    return false;
  }

  return true;
};

const DiagramFetcher = ({ setDiagramId, setInfo, setSvgData, setAnno, setSuccess, clearImage }) => {
  const [location, setLocation] = useState({ lat: '', lng: '', place_id: '', type: '' });
  const [date, setDate] = useState({ year: '', month: '', day: '', flag: '', cal: '' });  // flag: 've', 'ss', 'ae', 'ws', cal: '', 'j'
  const [star, setStar] = useState({ name: '', hip: '', ra: '', dec: '', type: '' });  // type: 'name', 'hip', 'radec'
  const [errorMessage, setErrorMessage] = useState({});
  const [locationFieldError, setLocationFieldError] = useState({ address: '', lat: '', lng: '' });
  const [dateFieldError, setDateFieldError] = useState({ year: '', month: '', day: '' });
  const [starFieldError, setStarFieldError] = useState({ name: '', hip: '', ra: '', dec: '' });
  const [loading, setLoading] = useState(false);
  const [locationValid, setLocationValid] = useState(true);
  const [dateValid, setDateValid] = useState(true);
  const [starValid, setStarValid] = useState(true);

  const clearError = useCallback(() => {
    setLocationFieldError({ address: '', lat: '', lng: '' });
    setDateFieldError({ year: '', month: '', day: '' });
    setStarFieldError({ name: '', hip: '', ra: '', dec: '' });
    setErrorMessage({});
  }, []);

  /* Initialize */
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleDraw = useCallback(async () => {
    if (loading) {
      return;
    }

    clearImage();  // Clear the SVG data before making the API call
    clearError();  // Clear any previous error message before making the API call
    setSuccess(false);

    const params = {};

    /* Check input values ----------------------------------------------------*/
    // console.log("Set location", location);
    // console.log("Set date", date);
    // console.log("Set star", star);
    const isValid = validateInputSync(
      location, date, star,
      setLocationFieldError, setDateFieldError, setStarFieldError,
      setLocationValid, setDateValid, setStarValid,
    );
    if (!isValid) {
      return;
    }

    /* Assign parameters -----------------------------------------------------*/
    params.lat = parseFloat(location.lat).toString();
    params.lng = parseFloat(location.lng).toString();

    if (date.flag && date.year) {
      params.year = parseInt(date.year).toString();
      params.flag = date.flag;
    } else {
      params.year = parseInt(date.year).toString();
      params.month = parseInt(date.month).toString();
      params.day = parseInt(date.day).toString();
      params.cal = date.cal;
    }

    if (star.type === 'name') {
      params.name = STARS[star.name];
    } else if (star.type === 'hip') {
      params.hip = parseInt(star.hip).toString();
    } else if (star.type === 'radec') {
      params.ra = parseFloat(star.ra).toString();
      params.dec = parseFloat(star.dec).toString();
    }
    // console.log("params", params);

    /* Plot ------------------------------------------------------------------*/
    try {
      setLoading(true);
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
      clearError();  // Clear any previous error message
      setSuccess(true);

    } catch (error) {
      if (error.response) {
        setErrorMessage({ draw: `Error ${error.response.status}: ${error.response.data?.error || error.message || 'unknown error'}` });
      } else {
        setErrorMessage({ draw: 'Unable to connect to the server.' });
      }
      clearImage();  // Clear SVG on error
      setSuccess(false);

    } finally {
      setLoading(false);
    }
  }, [location, date, star, loading, clearImage, setDiagramId, setInfo, setSvgData, setAnno, setSuccess, setErrorMessage, clearError]);

  return (
    <Stack direction="column" spacing={2}>
      <Stack id="input-fields" direction="column" spacing={2}>
        <Stack id="location" direction="column" spacing={1}>
          <CustomDivider>LOCATION</CustomDivider>
          <LocationInput onLocationChange={setLocation} setErrorMessage={setErrorMessage} setLocationValid={setLocationValid} fieldError={locationFieldError} setFieldError={setLocationFieldError} />
          {!!errorMessage.location && (
            <Alert severity="error" onClose={() => setErrorMessage((prev) => ({ ...prev, location: '' }))}>
              {errorMessage.location}
            </Alert>
          )}
        </Stack>

        <Stack id="date" direction="column" spacing={1}>
          <CustomDivider>DATE</CustomDivider>
          <DateInput onDateChange={setDate} setErrorMessage={setErrorMessage} setDateValid={setDateValid} fieldError={dateFieldError} setFieldError={setDateFieldError} />
          {!!errorMessage.date && (
            <Alert severity="error" onClose={() => setErrorMessage((prev) => ({ ...prev, date: '' }))}>
              {errorMessage.date}
            </Alert>
          )}
        </Stack>

        <Stack id="star" direction="column" spacing={1}>
          <CustomDivider>CELESTIAL OBJECT</CustomDivider>
          <StarInput onStarChange={setStar} setErrorMessage={setErrorMessage} setStarValid={setStarValid} fieldError={starFieldError} setFieldError={setStarFieldError} />
          {!!errorMessage.star && (
            <Alert severity="error" onClose={() => setErrorMessage((prev) => ({ ...prev, star: '' }))}>
              {errorMessage.star}
            </Alert>
          )}
        </Stack>
      </Stack>

      <Stack id="draw" direction="column" spacing={1}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={loading
            ? <CircularProgress color="inherit" size="1rem" sx={{ mr: 1 }} />
            : <ArrowForwardIcon />}
          sx={{ marginTop: 3 }}
          disabled={!!errorMessage.location || !!errorMessage.date || !!errorMessage.star || !!errorMessage.draw ||
            loading || !dateValid || !locationValid || !starValid}
          onClick={handleDraw}
          fullWidth
        >
          Draw Star Trail
        </Button>
        {!!errorMessage.draw && (
          <Alert severity="error" onClose={() => setErrorMessage((prev) => ({ ...prev, draw: '' }))}>
            {errorMessage.draw}
          </Alert>
        )}
      </Stack>
    </Stack>
  );
};

DiagramFetcher.propTypes = {
  setDiagramId: PropTypes.func.isRequired,
  setInfo: PropTypes.func.isRequired,
  setSvgData: PropTypes.func.isRequired,
  setAnno: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired,
  clearImage: PropTypes.func.isRequired,
};

export default DiagramFetcher;
