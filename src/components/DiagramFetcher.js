// src/components/DiagramFetcher.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import { Box, Stack, Alert, Button, Typography, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Config from '../Config';
import { useDateInput } from '../context/DateInputContext';
import { SET_DATE_ERROR, SET_DATE_VALID } from '../context/dateInputActionTypes';
import { STARS } from '../utils/constants';
import { validateInputSync, clearFieldError } from '../utils/inputUtils';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import StarInput from './StarInput';
import CustomDivider from './ui/CustomDivider';

const DiagramFetcher = ({ setDiagramId, setInfo, setSvgData, setAnno, setSuccess, clearImage }) => {
  // console.log('Rendering DiagramFetcher');
  const {
    date,
    flag,  // 've', 'ss', 'ae', 'ws'
    cal,  // '', 'j'
    dateError,
    dateValid,
    dateDispatch,
  } = useDateInput();
  const [location, setLocation] = useState({ lat: '', lng: '', id: '', tz: '', type: '' });  // 0: not-found, -1: unknown
  const [star, setStar] = useState({ name: '', hip: '', ra: '', dec: '', type: '' });  // type: 'name', 'hip', 'radec'
  const [errorMessage, setErrorMessage] = useState({});
  const [locationFieldError, setLocationFieldError] = useState({ address: '', lat: '', lng: '' });
  const [starFieldError, setStarFieldError] = useState({ name: '', hip: '', ra: '', dec: '' });
  const [loading, setLoading] = useState(false);
  const [locationValid, setLocationValid] = useState(true);
  const [starValid, setStarValid] = useState(true);

  /* Reset error when user starts typing */
  useEffect(() => {
    clearFieldError(
      dateDispatch,
      setLocationFieldError,
      setStarFieldError
    );
    setErrorMessage((prev) => ({ ...prev, draw: '', download: '' }));
  }, [location, date, flag, cal, star, dateDispatch]);

  useEffect(() => {
    if (flag) {
      if (!location.lat || !location.lng) {
        if (location.type === 'address') {
          setLocationFieldError((prev) => ({ ...prev, address: 'Please search and select a location.' }));
        } else {
          if (!location.lat) {
            setLocationFieldError((prev) => ({ ...prev, lat: 'Please enter a latitude.' }));
          }
          if (!location.lng) {
            setLocationFieldError((prev) => ({ ...prev, lng: 'Please enter a longitude.' }));
          }
        }
      }
      if (!date.year) {
        // setDateFieldError((prev) => ({ ...prev, year: 'Please enter a year.' }));  // DEPRECATED
        dateDispatch({ type: SET_DATE_ERROR, payload: { ...dateError, year: 'Please enter a year.' } });
      }
    }
  }, [date, flag, location, dateError, dateDispatch]);

  const handleDraw = useCallback(async () => {
    if (loading) return;

    clearImage();  // Clear the SVG data before making the API call
    /* Clear any previous error message before making the API call */
    clearFieldError(
      dateDispatch,
      setLocationFieldError,
      setStarFieldError
    );
    setSuccess(false);

    /* Check input values ----------------------------------------------------*/
    // console.log("Set: ", location, date, star);
    const isValid = validateInputSync(
      location,
      date, flag, cal,
      star,
      setLocationFieldError,
      dateError,
      (dateError) => dateDispatch({ type: SET_DATE_ERROR, payload: dateError }),
      setStarFieldError,
      setLocationValid,
      (dateValid) => dateDispatch({ type: SET_DATE_VALID, payload: dateValid }),
      setStarValid
    );
    if (!isValid) return;

    /* Assign parameters -----------------------------------------------------*/
    const params = {
      lat: parseFloat(location.lat).toString(),
      lng: parseFloat(location.lng).toString(),
      year: parseInt(date.year).toString(),
      month: parseInt(date.month).toString(),
      day: parseInt(date.day).toString(),
      cal: cal,
    };

    if (location.tz) {
      params.tz = location.tz;
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
        timeout: Config.serverGetDiagramTimeout,
      });

      const newInfo = ['lat', 'lng', 'tz', 'offset', 'flag', 'cal', 'name', 'hip', 'ra', 'dec'].reduce((info, key) => {
        if (response.data && response.data.hasOwnProperty(key)) info[key] = response.data[key];
        return info;
      }, {});

      if (cal === 'j') {
        newInfo.dateG = { year: response.data.year, month: response.data.month, day: response.data.day };
        newInfo.dateJ = { year: parseInt(date.year), month: parseInt(date.month), day: parseInt(date.day) };
      } else {
        newInfo.dateG = { year: parseInt(date.year), month: parseInt(date.month), day: parseInt(date.day) };
        newInfo.dateJ = { year: response.data.year, month: response.data.month, day: response.data.day };
      }

      newInfo.eqxSolTime = [];
      // if (response.data.flag && response.data.eqxSolTime.length > 0) {
      //   const res_month = response.data.eqxSolTime[1].toString();
      //   const res_day = response.data.eqxSolTime[2].toString();
      //   newInfo.eqxSolTime = response.data.eqxSolTime;
      //   newInfo.dateG.month = res_month;
      //   newInfo.dateG.day = res_day;
      //   setDate({ ...date, month: res_month, day: res_day });
      // }
      setInfo(newInfo);
      // console.log("info: ", newInfo);
      // console.log(response.data.annotations);

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
        ADD_ATTR: ['id', 'xlink:href', 'clip-path'],
      });

      setDiagramId(response.data.diagramId);
      setSvgData(sanitizedSvg);
      setAnno(response.data.annotations);
      /* Clear any previous error message */
      clearFieldError(
        dateDispatch,
        setLocationFieldError,
        setStarFieldError
      );
      setSuccess(true);

    } catch (error) {
      if (error.response) {
        // setErrorMessage((prev) => ({ ...prev, draw: `Error ${error.response.status}: ${error.response.data?.error || error.message || 'unknown error'}` }));
        setErrorMessage((prev) => ({ ...prev, draw: `${error.response.data?.error || error.message || 'unknown error'}` }));
      } else {
        setErrorMessage((prev) => ({ ...prev, draw: 'Unable to connect to the server.' }));
      }
      clearImage();  // Clear SVG on error
      setSuccess(false);

    } finally {
      setLoading(false);
    }
  }, [location, date, flag, cal, star, loading, dateError, clearImage, setDiagramId, setInfo, setSvgData, setAnno, setSuccess, setErrorMessage, dateDispatch]);

  return (
    <Stack direction="column" spacing={3}>
      <Stack id="input-fields" direction="column" spacing={1.5}>
        <Stack id="location" direction="column" spacing={1}>
          <CustomDivider>LOCATION</CustomDivider>
          <LocationInput
            onLocationChange={setLocation}
            setErrorMessage={setErrorMessage}
            setLocationValid={setLocationValid}
            fieldError={locationFieldError}
            setFieldError={setLocationFieldError}
          />
          {errorMessage.location && (
            <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }} onClose={() => setErrorMessage((prev) => ({ ...prev, location: '' }))}>
              {errorMessage.location}
            </Alert>
          )}
        </Stack>

        <Stack id="date" direction="column" spacing={1}>
          <CustomDivider>LOCAL DATE</CustomDivider>
          <DateInput
            setErrorMessage={setErrorMessage}
            location={{ lat: location.lat, lng: location.lng, tz: location.tz }}
          />
          {errorMessage.date && (
            <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }} onClose={() => setErrorMessage((prev) => ({ ...prev, date: '' }))}>
              {errorMessage.date}
            </Alert>
          )}
        </Stack>

        <Stack id="star" direction="column" spacing={1}>
          <CustomDivider>CELESTIAL OBJECT</CustomDivider>
          <StarInput
            onStarChange={setStar}
            setErrorMessage={setErrorMessage}
            setStarValid={setStarValid}
            fieldError={starFieldError}
            setFieldError={setStarFieldError}
          />
          {errorMessage.star && (
            <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }} onClose={() => setErrorMessage((prev) => ({ ...prev, star: '' }))}>
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
          aria-label="draw"
          startIcon={
            <Box display="flex" alignItems="center" sx={{ pb: '1.5px', ml: -2.5 }}>
              {loading
              ? <CircularProgress color="inherit" size="1rem" sx={{ mr: 1 }} />
              : <ArrowForwardIcon />
              }
            </Box>
          }
          sx={{ marginTop: 3 }}
          disabled={!!errorMessage.location || !!errorMessage.date || !!errorMessage.star || !!errorMessage.draw ||
            loading || !dateValid || !locationValid || !starValid}
          onClick={handleDraw}
          fullWidth
        >
          Draw Star Path
        </Button>
        {errorMessage.draw && (
          <Alert
            severity={errorMessage.draw.includes('never rises') ? "warning" : "error"}
            sx={{ width: '100%', textAlign: 'left' }}
            onClose={() => setErrorMessage((prev) => ({ ...prev, draw: '' }))}
          >
            {errorMessage.draw}
          </Alert>
        )}
        {loading && (
          <Typography color="action.active" variant="body1" sx={{ pt: 1, textAlign: 'center' }}>
            <em>Please wait. This may take a few seconds.</em>
          </Typography>
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

export default React.memo(DiagramFetcher);
