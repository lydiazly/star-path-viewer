// src/components/TimezoneFetcher.js
import React, { useEffect } from 'react';
import Config from '../Config';

const TimezoneFetcher = ({ lat, lng, latestTzRequest, setLocation, setErrorMessage }) => {
  useEffect(() => {
    const fetchTimeZone = async () => {
      const latFloat = parseFloat(lat);
      const lngFloat = parseFloat(lng);

      if (latFloat >= -90 && latFloat <= 90 && lngFloat >= -180 && lngFloat <= 180) {
        const requestId = ++latestTzRequest.current; // Increment and capture the current request ID
        try {
          const [tz] = await window.GeoTZ.find(latFloat, lngFloat);
          /* Only update if this request is the latest one */
          if (requestId === latestTzRequest.current) {
            setLocation((prev) => ({ ...prev, tz }));
            // console.log(tz);
          }
        } catch (error) {
          if (requestId === latestTzRequest.current) {
            setLocation((prev) => ({ ...prev, tz: '' }));
          }
        }
      }
    };

    const debounceTimeout = setTimeout(fetchTimeZone, Config.TypingDelay / 2);

    /* Cleanup timeout on unmount or dependency change */
    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [lat, lng, latestTzRequest, setLocation, setErrorMessage]);

  return null;
};

export default React.memo(TimezoneFetcher);
