// src/utils/fetchGeolocation.js
import axios from 'axios';
import reverseGeocode from './reverseGeocode';

const fetchIpLocation = async () => {
  try {
    const response = await axios.get('https://ipapi.co/json/',
      {
        timeout: 10000,
      });
    const data = response.data;
    return {
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again or enter the coordinates manually. ⤴');
    }
    throw new Error('Unable to determine the current location. Please enter the coordinates manually. ⤴');
  }
};

const fetchGeolocation = async (service) => {
  if ("geolocation" in navigator) {
    try {
      /* Attempt to get the latitude and longitude using navigator.geolocation */
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          async (error) => {
            console.error(error.message);
            /* If geolocation fails, fallback to IP-based geolocation */
            try {
              const ipLocation = await fetchIpLocation();
              resolve({
                coords: {
                  latitude: ipLocation.latitude,
                  longitude: ipLocation.longitude,
                },
              });
            } catch (ipError) {
              reject(ipError);
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 300000,  // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position.coords;

      /* Get the address from the latitude and longitude */
      const locationData = await reverseGeocode(latitude, longitude, service);
      return {
        lat: latitude.toString(),
        lng: longitude.toString(),
        display_name: locationData.display_name,
        id: locationData.id,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  } else {
    throw new Error('Geolocation is not supported by this browser. Please enter the coordinates manually. ⤴');
  }
};

export default fetchGeolocation;
