// src/utils/fetchGeolocation.js
import reverseGeocode from './reverseGeocode';

const fetchGeolocation = async () => {
  if ("geolocation" in navigator) {
    try {
      /* Get the latitude and longitude */
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(new Error(`Error fetching current location: ${error}`)),
          {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 60000,
          }
        );
      });
      const { latitude, longitude } = position.coords;
      /* Get the address from the latitude and longitude */
      const locationData = await reverseGeocode(latitude, longitude);
      return {
        lat: latitude.toString(),
        lng: longitude.toString(),
        display_name: locationData.display_name,
        osm_id: locationData.osm_id,  // number (> 0)
      };
    } catch (error) {
      throw new Error(error.message);
    }
  } else {
    throw new Error('Geolocation is not supported by this browser.');
  }
};

export default fetchGeolocation;
