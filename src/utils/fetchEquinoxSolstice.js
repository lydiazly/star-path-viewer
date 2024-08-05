// utils/fetchEquinoxSolstice.js
import axios from 'axios';
import Config from '../Config';
import { EQX_SOL_KEYS } from './constants';

export const fetchEquinoxSolstice = async (lat, lng, year, flag, signal) => {
  try {
    const response = await axios.get(`${Config.serverUrl}/equinox`, {
      params: { lat, lng, year },
      timeout: Config.serverGetTimeout,
      signal,
    });

    const month = response.data.results[EQX_SOL_KEYS[flag]][1];
    const day = response.data.results[EQX_SOL_KEYS[flag]][2];
    const hours = response.data.results[EQX_SOL_KEYS[flag]][3];
    const minutes = response.data.results[EQX_SOL_KEYS[flag]][4];
    const seconds = response.data.results[EQX_SOL_KEYS[flag]][5];

    return { year, month, day, hours, minutes, seconds };  // numbers
  } catch (error) {
    if (error.name === 'CanceledError') {
      throw error; // Let the caller handle the cancel error
    } else if (error.response) {
      throw new Error(`Error ${error.response.status}: ${error.response.data?.error || error.message || 'unknown error'}`);
    } else {
      throw new Error('Unable to connect to the server.');
    }
  }
};
