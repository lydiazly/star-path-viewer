// utils/fetchEquinoxSolstice.js
import axios from 'axios';
import Config from '../Config';
import { EQX_SOL_KEYS } from './constants';

export const fetchEquinoxSolstice = async (lat, lng, year, flag) => {
  try {
    const response = await axios.get(`${Config.serverUrl}/equinox?lat=${lat}&lng=${lng}&year=${year}`, {
      timeout: Config.serverGetTimeout
    });

    const month = response.data.results[EQX_SOL_KEYS[flag]][1].toString();
    const day = response.data.results[EQX_SOL_KEYS[flag]][2].toString();
    const hours = response.data.results[EQX_SOL_KEYS[flag]][3].toString();
    const minutes = response.data.results[EQX_SOL_KEYS[flag]][4].toString();
    const seconds = response.data.results[EQX_SOL_KEYS[flag]][5].toString();

    return { year, month, day, hours, minutes, seconds };
  } catch (error) {
    if (error.response) {
      throw new Error(`Error ${error.response.status}: ${error.response.data?.error || error.message || 'unknown error'}`);
    } else {
      throw new Error('Unable to connect to the server.');
    }
  }
};
