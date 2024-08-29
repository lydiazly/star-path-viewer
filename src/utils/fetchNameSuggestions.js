// src/utils/fetchNameSuggestions.js
import axios from 'axios';
import * as actionTypes from '../context/starInputActionTypes';
import { HIP_MIN, HIP_MAX, HIP_OUT_OF_RANGE, HIP_NOT_FOUND } from './constants';

const starNameUrl = 'https://stardial-astro.github.io/star-path-data/json/hip_ident.json';
const topN = 10;

const fetchAndCacheNames = async (dispatch) => {
  try {
    const timeout = 5000;
    const response = await axios.get(starNameUrl, { timeout });
    const data = response.data;
    dispatch({ type: actionTypes.SET_CACHED_NAMES, payload: data });  // Cache the data
    return data;
  } catch (error) {
    throw new Error('Failed to fetch data.');
  }
};

const fetchNameSuggestions = async (query, cachedNames, dispatch) => {
  try {
    let data = cachedNames;
    /* Fetch and set data if cache is empty */
    if (!data) {
      data = await fetchAndCacheNames(dispatch);
    }

    /* Case-insensitive */
    const normalizedQuery = query.toLowerCase();

    /* Filter suggestions */
    const filteredSuggestions = data
      .filter((item) =>
        item.hip.toString().includes(normalizedQuery) ||
        item.name?.toLowerCase().includes(normalizedQuery) ||
        item.name_zh?.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, topN);

    const hip = parseInt(query, 10);

    /* If the query is a number (no matter valid or not) without a name, prepare the entry */
    const selectedSuggestions = /^\d*$/.test(query) && !filteredSuggestions.find((item) => item.hip.toString() === normalizedQuery)
      ? [{
        hip: query,
        name: '',
        name_zh: '',
        display_name: hip >= HIP_MIN && hip <= HIP_MAX ? query : HIP_OUT_OF_RANGE,
      }]
      : [];
    if (filteredSuggestions.length > 0) {
      return selectedSuggestions.concat(filteredSuggestions.map((item) => ({
        hip: item.hip.toString(),
        name: item.name,
        name_zh: item.name_zh || '',
        display_name: item.hip.toString(),
      })));
    } else if (selectedSuggestions.length > 0) {
      return selectedSuggestions;
    } else {
      return [{ hip: '', name: '', name_zh: '', display_name: HIP_NOT_FOUND }];
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export {
  fetchAndCacheNames,
  fetchNameSuggestions,
};
