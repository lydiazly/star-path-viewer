// src/context/DateInputContext.js
import React, { createContext, useContext, useReducer, useRef } from 'react';
import * as actionTypes from './dateInputActionTypes';

const DateInputContext = createContext();

/* Define initial state for the reducer */
const initialState = {
  date: { year: '', month: '', day: '' },
  flag: '',
  cal: '',  // '': Gregorian, 'j': Julian
  disabledMonths: {},
  lastDay: 31,
  dateAdjusting: false,
  dateFetching: false,
  dateError: { general: '', year: '', month: '', day: '' },
  dateValid: true,
};

/* Define the reducer function */
const dateInputReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_DATE:
      return { ...state, date: action.payload };
    case actionTypes.SET_FLAG:
      return { ...state, flag: action.payload };
    case actionTypes.SET_CAL:
      return { ...state, cal: action.payload };
    case actionTypes.SET_DISABLED_MONTHS:
      return { ...state, disabledMonths: action.payload };
    case actionTypes.SET_LAST_DAY:
      return { ...state, lastDay: action.payload };
    case actionTypes.SET_DATE_ADJUSTING:
      return { ...state, dateAdjusting: action.payload };
    case actionTypes.SET_DATE_FETCHING:
      return { ...state, dateFetching: action.payload };
    case actionTypes.SET_DATE_ERROR:
      return { ...state, dateError: action.payload };
    case actionTypes.SET_DATE_VALID:
      return { ...state, dateValid: action.payload };
    case actionTypes.CLEAR_DATE_ERROR:
      return {
        ...state,
        dateError: { general: '', year: '', month: '', day: '' },
      };
    default:
      return state;
  }
};

export const DateInputProvider = ({ children }) => {
  const [dateState, dateDispatch] = useReducer(dateInputReducer, initialState);
  const abortControllerRef = useRef(null);
  const queryDateFromRef = useRef('');  // 'click', 'change'
  const latestDateRequest = useRef(0);

  return (
    <DateInputContext.Provider
      value={{
        ...dateState,
        abortControllerRef,
        queryDateFromRef,
        latestDateRequest,
        dateDispatch,
      }}
    >
      {children}
    </DateInputContext.Provider>
  );
};

export const useDateInput = () => useContext(DateInputContext);
