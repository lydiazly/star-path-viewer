// src/utils/reverseGeocode.js
import axios from 'axios';

const reverseGeocode = async (lat, lng) => {
  const nominatimReverseUrl = 'https://nominatim.openstreetmap.org/reverse';
  const timeout = 5000;
  try {
    const response = await axios.get(nominatimReverseUrl, {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1,
        zoom: 10, // zoom level around 10 is typically for city level
      },
      timeout,
    });
    return {
      display_name: response.data?.display_name || 'unknown',
      osm_id: response.data?.osm_id || -1,
    };
    // if (response.data && response.data.display_name) {
    //   return {
    //     display_name: response.data.display_name,
    //     osm_id: response.data.osm_id,
    //   };
    // } else {
    //   throw new Error('Unable to fetch the address for this location.');
    // }
  } catch (error) {
    // if (error.response) {
    //   throw new Error(`Error ${error.response.status}: ${error.response.data?.error || error.message || 'unknown error'}`);
    // } else {
    //   throw new Error(`Unable to connect to ${nominatimReverseUrl}.`);
    // }
    return {
      display_name: 'unknown',
      osm_id: -1,
    };
  }
};

export default reverseGeocode;