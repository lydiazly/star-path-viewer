// src/components/Input/Location/AddressInput.js
import React, { useEffect, useCallback, useMemo } from 'react';
import { Autocomplete, TextField, IconButton, Tooltip, CircularProgress, InputAdornment, Typography, Stack, Box, Chip } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Config from '../../../Config';
import { useLocationInput } from '../../../context/LocationInputContext';
import { fetchCurrentLocation } from '../../../utils/locationInputUtils';
import fetchSuggestions from '../../../utils/fetchSuggestions';
import { clearError } from '../../../utils/locationInputUtils';
import debounce from 'lodash/debounce';

const gpsBtnStyle = {
  color: "action.active",
  p: '2px',
  '&:hover': {
    color: 'primary.main',
  },
  cursor: 'pointer',
};

const AddressInput = ({ setErrorMessage, fieldError, setFieldError }) => {
  const {
    setInputType,
    setLocation,
    searchTerm, setSearchTerm,
    suggestions, setSuggestions,
    highlightedIndex, setHighlightedIndex,
    locationError, setLocationError,
    setLoadingLocation,
    loadingLocation,
    loadingSuggestions, setLoadingSuggestions,
    serviceChosen,
    latestSuggestionRequest,
    isSelecting,
  } = useLocationInput();

  const handleGpsClick = useCallback(
    () => {
      clearError(setErrorMessage, setLocationError);
      setSuggestions([]);
      fetchCurrentLocation(serviceChosen, setSearchTerm, setLocation, setInputType, setLoadingLocation, setErrorMessage);
    },
    [serviceChosen, setSearchTerm, setLocation, setInputType, setLoadingLocation, setSuggestions, setErrorMessage, setLocationError]
  );

  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce(async (query, serviceChosen) => {
        if (!isSelecting.current) {
          try {
            setLoadingSuggestions(true);
            const requestId = ++latestSuggestionRequest.current;  // Increment and capture the current request ID
            const suggestions = await fetchSuggestions(query, serviceChosen);
            /* Only update if this request is the latest one */
            if (requestId === latestSuggestionRequest.current) {
              setSuggestions(suggestions);
            }
          } catch (error) {
            setErrorMessage((prev) => ({ ...prev, location: error.message }));
          } finally {
            setLoadingSuggestions(false);
          }
        }
        isSelecting.current = false;
      }, Config.TypingDelay + 300),
    [isSelecting, latestSuggestionRequest, setSuggestions, setLoadingSuggestions, setErrorMessage]
  );

  /* Cancel the debounce function when the component unmounts */
  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [debouncedFetchSuggestions]);

  const handleSearchChange = useCallback(
    (event, newSearchTerm) => {
      const trimmedNewSearchTerm = newSearchTerm.trim() ? newSearchTerm : '';
      setSearchTerm(trimmedNewSearchTerm);
      if (trimmedNewSearchTerm) {
        debouncedFetchSuggestions(trimmedNewSearchTerm, serviceChosen);
      } else {
        setLocation({ lat: '', lng: '', id: '', tz: '' });
        setSuggestions([]);
      }
    },
    [serviceChosen, setSearchTerm, setLocation, setSuggestions, debouncedFetchSuggestions]
  );

  const handleSelect = useCallback((event, value) => {
    if (!value || !value.id || value.id === 'unknown') {
      setLocation({ lat: '', lng: '', id: '', tz: '' });
      // setLocationValid(false);
      setSearchTerm('');
      setSuggestions([]);
      return;
    }

    const selectedSuggestion = suggestions.find(
      (suggestion) => suggestion.id === value.id
    );
    if (selectedSuggestion) {
      isSelecting.current = true;
      setLocation({
        lat: selectedSuggestion.lat,
        lng: selectedSuggestion.lng,
        id: selectedSuggestion.id,
      });
      setSearchTerm(selectedSuggestion.display_name);
      setSuggestions([]);
    }
  }, [isSelecting, suggestions, setLocation, setSearchTerm, setSuggestions]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      /* Prevent default 'Enter' behavior */
      event.defaultMuiPrevented = true;
      /* Select the highlighted suggestion */
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        const highlightedSuggestion = suggestions[highlightedIndex];
        if (highlightedSuggestion.id && highlightedSuggestion.id !== 'unknown') {
          isSelecting.current = true;
          setLocation({
            lat: highlightedSuggestion.lat,
            lng: highlightedSuggestion.lng,
            id: highlightedSuggestion.id,
          });
          setSearchTerm(highlightedSuggestion.display_name);
          setSuggestions([]);
        }
      }
    }
  }, [highlightedIndex, isSelecting, suggestions, setLocation, setSearchTerm, setSuggestions]);

  const handleHighlightChange = useCallback((event, option, reason) => {
    if (reason === 'keyboard' || reason === 'mouse') {
      const index = suggestions.findIndex((suggestion) => suggestion.id === option.id);
      setHighlightedIndex(index);
    }
  }, [suggestions, setHighlightedIndex]);

  return (
    <Autocomplete
      freeSolo
      clearOnEscape
      disabled={!serviceChosen}
      options={searchTerm.trim() ? suggestions : []}
      getOptionLabel={(option) => option.display_name}
      inputValue={searchTerm}
      onInputChange={handleSearchChange}
      onChange={handleSelect}
      onKeyDown={handleKeyDown}
      onHighlightChange={handleHighlightChange}
      filterOptions={(x) => x}
      autoHighlight
      loading={loadingSuggestions}
      renderOption={(props, option) => (
        <li
          {...props}
          key={option.id}
          style={!option.id || option.id === 'unknown' ? { pointerEvents: 'none', color: 'InactiveCaptionText', fontStyle: 'italic' } : {}}
        >
          <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'space-between' }}>
            <Typography>
              {option.display_name}
            </Typography>
            <Box>
              {option.addresstype ? <Chip label={option.addresstype} size="small" color="primary" variant="outlined" /> : ''}
            </Box>
          </Stack>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          error={!!locationError.address || !!fieldError.address}
          helperText={locationError.address || fieldError.address}
          label="Search address"
          placeholder="Enter a place, city, county, state, or country"
          size="small"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 1, mr: -1 }}>
                {!loadingSuggestions && !loadingLocation ? (
                  <Tooltip title="Find My Location">
                    <IconButton aria-label="gps" edge="start" onClick={handleGpsClick}>
                      <GpsFixedIcon size={20} sx={gpsBtnStyle} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <CircularProgress size={20} sx={{ color: "action.disabled", mr: 1 }} />
                )}
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default React.memo(AddressInput);
