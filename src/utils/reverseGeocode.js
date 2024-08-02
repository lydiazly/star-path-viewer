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
      },
      timeout,
    });
    if (response.data && response.data.display_name) {
      return {
        display_name: response.data.display_name,
        place_id: response.data.place_id,
      };
    } else {
      throw new Error('Unable to fetch the address for the current location.');
    }
  } catch (error) {
    throw new Error(`Error fetching address: ${error.message}`);
  }
};

export default reverseGeocode;
