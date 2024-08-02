// src/Config.js
const Config = {
  serverUrl: process.env.REACT_APP_SERVER_URL || 'http://localhost:5001',
  nominatimSearchUrl: 'https://nominatim.openstreetmap.org/search',
  nominatimTimeout: 5000,
  serverGetTimeout: 5000,
  serverGetDiagramTimeout: 20000,
  typingTimeout: 300,
};

export default Config;
