// src/utils/fetchGeolocation.js
import reverseGeocode from './reverseGeocode';

const fetchGeolocation = async (service) => {
  if ("geolocation" in navigator) {
    try {
      /* Get the latitude and longitude */
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(new Error('Unable to fetch current location. Please enter the coordinates manually ⤴')),
          {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 60000,
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
    throw new Error('Geolocation is not supported by this browser.');
  }
};

export default fetchGeolocation;
