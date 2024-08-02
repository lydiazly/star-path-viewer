// src/utils/fetchGeolocation.js
import reverseGeocode from './reverseGeocode';

const fetchGeolocation = async (setLoadingLocation, setSearchTerm, setLocation, setErrorMessage) => {
  if ("geolocation" in navigator) {
    setLoadingLocation(true);
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject('Error fetching current location.');
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      }).then(async (coords) => {
        const { latitude, longitude } = coords;
        await reverseGeocode(latitude, longitude, setSearchTerm, setLocation, setErrorMessage);
      });
    } catch (error) {
      setErrorMessage(error);
    } finally {
      setLoadingLocation(false);
    }
  } else {
    setErrorMessage('Geolocation is not supported by this browser.');
  }
};

export default fetchGeolocation;
