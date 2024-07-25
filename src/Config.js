// src/Config.js
const Config = {
  serverUrl: process.env.REACT_APP_SERVER_URL || 'http://192.168.0.11:5001',
  nominatimSearchUrl: 'https://nominatim.openstreetmap.org/search',
  typingTimeout: 500,
};

export default Config;
