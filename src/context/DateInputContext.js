// src/context/DateInputContext.js
import React, { createContext, useContext, useState, useRef } from 'react';

const DateInputContext = createContext();

export const DateInputProvider = ({ children, location }) => {
  const [date, setDate] = useState({ year: '', month: '', day: '' });
  const [flag, setFlag] = useState('');
  const [cal, setCal] = useState('');  // '': Gregorian, 'j': Julian
  const [disabledMonths, setDisabledMonths] = useState({});
  const [lastDay, setLastDay] = useState(31);
  const [adjusting, setAdjusting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [dateError, setDateError] = useState({ general: '', year: '', month: '', day: '' });
  const abortControllerRef = useRef(null);
  const fetchingFromRef = useRef('');  // 'click', 'change'
  const latestRequest = useRef(0);

  return (
    <DateInputContext.Provider value={{
      date, setDate,
      flag, setFlag,
      cal, setCal,
      disabledMonths, setDisabledMonths,
      lastDay, setLastDay,
      adjusting, setAdjusting,
      fetching, setFetching,
      dateError, setDateError,
      abortControllerRef,
      fetchingFromRef,
      latestRequest,
    }}>
      {children}
    </DateInputContext.Provider>
  );
};

export const useDateInput = () => useContext(DateInputContext);
