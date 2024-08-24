// src/context/LocationInputContext.js
import React, { createContext, useContext, useState, useRef } from 'react';
import { useService } from './ServiceContext';

const LocationInputContext = createContext();

export const LocationInputProvider = ({ children }) => {
  const [inputType, setInputType] = useState('address');  // 'address' or 'coordinates'
  const [location, setLocation] = useState({ lat: '', lng: '', id: '', tz: '' });  // 0: not-found, -1: unknown
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [locationError, setLocationError] = useState({ address: '', lat: '', lng: '' });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const { serviceChosen, setServiceChosen } = useService();
  const latestTzRequest = useRef(0);
  const latestSuggestionRequest = useRef(0);
  const isSelecting = useRef(false);

  return (
    <LocationInputContext.Provider value={{
      inputType, setInputType,
      location, setLocation,
      searchTerm, setSearchTerm,
      suggestions, setSuggestions,
      highlightedIndex, setHighlightedIndex,
      locationError, setLocationError,
      loadingLocation, setLoadingLocation,
      loadingSuggestions, setLoadingSuggestions,
      serviceChosen, setServiceChosen,
      latestTzRequest, latestSuggestionRequest,
      isSelecting,
    }}>
      {children}
    </LocationInputContext.Provider>
  );
};

export const useLocationInput = () => useContext(LocationInputContext);
