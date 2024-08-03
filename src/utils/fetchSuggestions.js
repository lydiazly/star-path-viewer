// src/utils/fetchSuggestions.js
import axios from 'axios';

const fetchSuggestions = async (query) => {
  const nominatimSearchUrl = 'https://nominatim.openstreetmap.org/search';
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
      return [{ display_name: 'Location not found', place_id: 'not-found', address_type: '' }];
    }
  } catch (error) {
    throw new Error(`Error fetching location suggestions.`);
  }
};

export default fetchSuggestions;
