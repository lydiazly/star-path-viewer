// src/utils/fetchSuggestions.js
import axios from 'axios';

const fetchSuggestions = async (query) => {
  const nominatimSearchUrl = 'https://nominatim.openstreetmap.org/searchX';
  const timeout = 5000;
  try {
    const response = await axios.get(nominatimSearchUrl, {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
      },
      timeout,
    });
    if (response.data.length > 0) {
      return response.data;
    } else {
      return [{ display_name: 'Location not found', osm_id: 0, addresstype: '' }];
    }
  } catch (error) {
    // if (error.response) {
    //   throw new Error(`Error ${error.response.status}: ${error.response.data?.error || error.message || 'unknown error'}`);
    // } else {
    //   throw new Error(`Unable to connect to ${nominatimSearchUrl}.`);
    // }
    return [{ display_name: 'Service not available. Please enter the coordinates manually ⤴', osm_id: 0, addresstype: '' }];
  }
};

export default fetchSuggestions;
