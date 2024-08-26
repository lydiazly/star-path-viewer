// src/utils/reverseGeocode.js
import axios from 'axios';
import fetchJsonp from 'fetch-jsonp';
import { ADD_UNKNOWN } from './constants';

const nominatimReverseUrl = 'https://nominatim.openstreetmap.org/reverse';
const baiduReverseUrl = 'https://api.map.baidu.com/reverse_geocoding/v3/';

const reverseGeocodeWithNominatim = async (lat, lng) => {
  const timeout = 5000;
  const response = await axios.get(nominatimReverseUrl, {
    params: {
      lat,
      lon: lng,
      format: 'json',
      addressdetails: 1,
      zoom: 10,  // city level
    },
    timeout,
  });
  return {
    display_name: response.data?.display_name || ADD_UNKNOWN,
    id: response.data?.osm_id || ADD_UNKNOWN,
  };
};

const reverseGeocodeWithBaidu = async (lat, lng) => {
  const timeout = 5000;
  const url = `${baiduReverseUrl}?ak=${process.env.REACT_APP_BAIDU_API_KEY}&location=${lat},${lng}&output=json&coordtype=wgs84ll`;
  const response = await fetchJsonp(url, {
    jsonpCallback: 'callback',
    timeout: timeout,
  });
  const data = await response.json();
  const result = data.result || {};
  return {
    display_name: result.formatted_address || ADD_UNKNOWN,
    id: result.addressComponent?.adcode || `${lat},${lng}` || ADD_UNKNOWN,
  };
};

const reverseGeocode = async (lat, lng, service) => {
  try {
    if (service === 'nominatim') {
      return await reverseGeocodeWithNominatim(lat, lng);
    } else {
      return await reverseGeocodeWithBaidu(lat, lng);
    }
  } catch (error) {
    return { display_name: ADD_UNKNOWN, id: ADD_UNKNOWN };
  }
};

export default reverseGeocode;
