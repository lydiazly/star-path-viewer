// src/utils/inputUtils.js
/* Validate the input */
const validateInputSync = (
  location, date, star,
  setLocationFieldError, setDateFieldError, setStarFieldError,
  setLocationValid, setDateValid, setStarValid
) => {
  /* Validate Location */
  if (location.type === 'address' && !location.id) {
    setLocationFieldError((prev) => ({ ...prev, address: 'Please search and select a location.' }));
    setLocationValid(false);
    return false;
  } else if (!location.lat || !location.lng) {
    if (!location.lat) {
      setLocationFieldError((prev) => ({ ...prev, lat: 'Please enter a latitude.' }));
    }
    if (!location.lng) {
      setLocationFieldError((prev) => ({ ...prev, lng: 'Please enter a longitude.' }));
    }
    setLocationValid(false);
    return false;
  }

  /* Validate Date */
  if (date.flag && !date.year) {
    setDateFieldError((prev) => ({ ...prev, year: 'Please enter a year.' }));
    setDateValid(false);
    return false;
  } else if (!date.year || !date.month || !date.day) {
    for (let key of ['year', 'month', 'day']) {
      if (!date[key]) {
        setDateFieldError((prev) => ({ ...prev, [key]: `Please enter a ${key}.` }));
      }
    }
    setDateValid(false);
    return false;
  }

  /* Validate Star */
  if (star.type === 'name' && !star.name) {
    setStarFieldError((prev) => ({ ...prev, name: 'Please select a planet.' }));
    setStarValid(false);
    return false;
  } else if (star.type === 'hip' && !star.hip) {
    setStarFieldError((prev) => ({ ...prev, hip: 'Please enter a Hipparchus catalogue number.' }));
    setStarValid(false);
    return false;
  } else if (star.type === 'radec' && (!star.ra || !star.dec)) {
    if (!star.ra) {
      setStarFieldError((prev) => ({ ...prev, ra: 'Please enter a right ascension.' }));
    }
    if (!star.dec) {
      setStarFieldError((prev) => ({ ...prev, dec: 'Please enter a declination.' }));
    }
    setStarValid(false);
    return false;
  }

  return true;
};

export {
  validateInputSync,
};
