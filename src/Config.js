// src/Config.js
const Config = {
  serverUrl: process.env.REACT_APP_SERVER_URL || 'https://localhost:5001',
  serverGetTimeout: 6000,
  serverGetDiagramTimeout: 20000,
  typingTimeout: 450,
};

export default Config;
