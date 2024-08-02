// src/utils/reverseGeocode.js
import axios from 'axios';
import Config from '../Config';

const reverseGeocode = async (lat, lng, setSearchTerm, setLocation, setErrorMessage) => {
  try {
    const response = await axios.get(Config.nominatimReverseUrl, {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1,
      },
      timeout: Config.nominatimTimeout,
    });
    if (response.data && response.data.display_name) {
      setSearchTerm(response.data.display_name);
      setLocation({
        lat: lat.toString(),
        lng: lng.toString(),
        place_id: response.data.place_id,
      });
    } else {
      setErrorMessage('Unable to fetch the address for the current location.');
    }
  } catch (error) {
    setErrorMessage(`Error fetching address: ${error}`);
  }
};

export default reverseGeocode;
