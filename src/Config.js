// src/Config.js
const Config = {
  serverUrl: process.env.REACT_APP_SERVER_URL || 'http://localhost:5001',
  nominatimSearchUrl: 'https://nominatim.openstreetmap.org/search',
  nominatimTimeout: 6000,
  serverGetTimeout: 6000,
  serverGetDiagramTimeout: 20000,
  typingTimeout: 350,
};

export default Config;
