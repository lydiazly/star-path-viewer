// src/Config.js
const Config = {
  serverUrl: process.env.REACT_APP_SERVER_URL || 'http://192.168.0.11:5001',
  nominatimSearchUrl: 'https://nominatim.openstreetmap.org/search',
  nominatimTimeout: 5000,
  serverTimeout: 3000,
  typingTimeout: 400,
};

export default Config;
