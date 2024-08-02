// src/utils/fetchGeolocation.js
import reverseGeocode from './reverseGeocode';

const fetchGeolocation = async () => {
  if ("geolocation" in navigator) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(new Error('Error fetching current location.')),
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      });
      const { latitude, longitude } = position.coords;
      const locationData = await reverseGeocode(latitude, longitude);
      return {
        lat: latitude.toString(),
        lng: longitude.toString(),
        display_name: locationData.display_name,
        place_id: locationData.place_id,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  } else {
    throw new Error('Geolocation is not supported by this browser.');
  }
};

export default fetchGeolocation;
