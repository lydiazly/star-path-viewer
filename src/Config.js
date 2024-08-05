// src/Config.js
const Config = {
  serverUrl: process.env.REACT_APP_SERVER_URL || 'https://localhost:5001',
  serverGetTimeout: 10000,
  serverGetDiagramTimeout: 50000,
  TypingDebouncePeriod: 400,
};

export default Config;
