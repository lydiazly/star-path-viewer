// src/utils/fetchGeolocation.js
import reverseGeocode from './reverseGeocode';

const fetchGeolocation = (setLoadingLocation, setSearchTerm, setLocation, setErrorMessage) => {
  if ("geolocation" in navigator) {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude, setSearchTerm, setLocation, setErrorMessage);
      },
      (error) => {
        setErrorMessage('Error fetching current location.');
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    );
    setLoadingLocation(false);
  } else {
    setErrorMessage('Geolocation is not supported by this browser.');
  }
};

export default fetchGeolocation;
