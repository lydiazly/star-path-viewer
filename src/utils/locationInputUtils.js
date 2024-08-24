// src/utils/locationInputUtils.js
import fetchGeolocation from './fetchGeolocation';

const fetchCurrentLocation = async (service, setSearchTerm, setLocation, setInputType, setLoadingLocation, setErrorMessage) => {
  try {
    setLoadingLocation(true);
    const locationData = await fetchGeolocation(service);
    if (locationData.display_name !== 'unknown') {
      setSearchTerm(locationData.display_name);
    }
    setLocation({
      lat: locationData.lat,
      lng: locationData.lng,
      id: locationData.id,
    });
    if (locationData.id === 'unknown') {
      setInputType('coordinates');
    }
  } catch (error) {
    setErrorMessage((prev) => ({ ...prev, location: error.message }));
  } finally {
    setLoadingLocation(false);
  }
};

/* Validate the location */
const validateLocationSync = (inputType, location) => {
  // console.log(location);
  let newLocationError = { address: '', lat: '', lng: '' };

  if (inputType === 'coordinates') {
    if (!/^-?\d*(\.\d+)?$/.test(location.lat)) {
      return { ...newLocationError, lat: 'The latitude must be a decimal.' };
    }
    if (!/^-?\d*(\.\d+)?$/.test(location.lng)) {
      return { ...newLocationError, lng: 'The longitude must be a decimal.' };
    }

    if (location.lat) {
      const lat = parseFloat(location.lat);
      if (lat < -90 || lat > 90) {
        return { ...newLocationError, lat: 'The latitude must be in the range [-90°, 90°].' };
      }
    }
    if (location.lng) {
      const lng = parseFloat(location.lng);
      if (lng < -180 || lng > 180) {
        return { ...newLocationError, lng: 'The longitude must be in the range [-180°, 180°].' };
      }
    }
  }

  return newLocationError;
};

const clearError = (setErrorMessage, setLocationError) => {
  setErrorMessage((prev) => ({ ...prev, location: '' }));
  setLocationError({ address: '', lat: '', lng: '' });
};

export {
  fetchCurrentLocation,
  validateLocationSync,
  clearError,
};
