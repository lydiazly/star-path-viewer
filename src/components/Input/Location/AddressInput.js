// src/components/Input/Location/AddressInput.js
import React, { useEffect, useCallback } from 'react';
import { Autocomplete, TextField, IconButton, Tooltip, CircularProgress, InputAdornment, Typography, Stack, Box, Chip } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Config from '../../../Config';
import { useLocationInput } from '../../../context/LocationInputContext';
import * as actionTypes from '../../../context/locationInputActionTypes';
import useDebouncedFetchSuggestions from '../../../hooks/useDebouncedFetchSuggestions';
import { ADD_UNKNOWN } from '../../../utils/constants';
import { fetchCurrentLocation } from '../../../utils/locationInputUtils';
import { clearLocationError } from '../../../utils/locationInputUtils';

const gpsBtnStyle = {
  color: "action.active",
  p: '2px',
  '&:hover': {
    color: 'primary.main',
  },
  cursor: 'pointer',
};

const AddressInput = ({ setErrorMessage }) => {
  const {
    searchTerm,
    suggestions,
    highlightedIndex,
    locationLoading,
    suggestionsLoading,
    locationError, locationNullError,
    serviceChosen,
    latestSuggestionRequest,
    isSelecting,
    locationDispatch,
  } = useLocationInput();

  const handleGpsClick = useCallback(
    () => {
      clearLocationError(locationDispatch, setErrorMessage);
      locationDispatch({ type: actionTypes.CLEAR_SUGGESTIONS });
      fetchCurrentLocation(serviceChosen, locationDispatch, setErrorMessage);
    },
    [serviceChosen, locationDispatch, setErrorMessage]
  );

  const debouncedFetchSuggestions = useDebouncedFetchSuggestions(
    isSelecting,
    latestSuggestionRequest,
    actionTypes,
    locationDispatch,
    setErrorMessage,
    Config.TypingDelay + 300
  );

  /* Cleanup the debounced function on unmount */
  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [debouncedFetchSuggestions]);

  const handleSearchChange = useCallback(
    (event, newSearchTerm) => {
      const trimmedNewSearchTerm = newSearchTerm.trim() ? newSearchTerm : '';
      locationDispatch({ type: actionTypes.SET_SEARCH_TERM, payload: trimmedNewSearchTerm });
      if (trimmedNewSearchTerm) {
        debouncedFetchSuggestions(trimmedNewSearchTerm, serviceChosen);
      } else {
        locationDispatch({ type: actionTypes.CLEAR_LOCATION });
        locationDispatch({ type: actionTypes.CLEAR_SUGGESTIONS });
      }
    },
    [serviceChosen, locationDispatch, debouncedFetchSuggestions]
  );

  const handleSelect = useCallback((event, value) => {
    if (!value || !value.id || value.id === ADD_UNKNOWN) {
      locationDispatch({ type: actionTypes.CLEAR_LOCATION });
      locationDispatch({ type: actionTypes.SET_LOCATION_VALID, payload: false });
      locationDispatch({ type: actionTypes.CLEAR_SEARCH_TERM });
      locationDispatch({ type: actionTypes.CLEAR_SUGGESTIONS });
      return;
    }

    const selectedSuggestion = suggestions.find(
      (suggestion) => suggestion.id === value.id
    );
    if (selectedSuggestion) {
      isSelecting.current = true;
      locationDispatch({ type: actionTypes.SET_LOCATION, payload: {
        lat: selectedSuggestion.lat,
        lng: selectedSuggestion.lng,
        id: selectedSuggestion.id,
      } });
      locationDispatch({ type: actionTypes.SET_SEARCH_TERM, payload: selectedSuggestion.display_name });
      locationDispatch({ type: actionTypes.CLEAR_SUGGESTIONS });
    }
  }, [isSelecting, suggestions, locationDispatch]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      /* Prevent default 'Enter' behavior */
      event.defaultMuiPrevented = true;
      /* Select the highlighted suggestion */
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        const highlightedSuggestion = suggestions[highlightedIndex];
        if (highlightedSuggestion.id && highlightedSuggestion.id !== ADD_UNKNOWN) {
          isSelecting.current = true;
          locationDispatch({ type: actionTypes.SET_LOCATION, payload: {
            lat: highlightedSuggestion.lat,
            lng: highlightedSuggestion.lng,
            id: highlightedSuggestion.id,
          } });
          locationDispatch({ type: actionTypes.SET_SEARCH_TERM, payload: highlightedSuggestion.display_name });
          locationDispatch({ type: actionTypes.CLEAR_SUGGESTIONS });
        }
      }
    }
  }, [highlightedIndex, isSelecting, suggestions, locationDispatch]);

  const handleHighlightChange = useCallback((event, option, reason) => {
    if (reason === 'keyboard' || reason === 'mouse') {
      const index = suggestions.findIndex((suggestion) => suggestion.id === option.id);
      locationDispatch({ type: actionTypes.SET_HIGHLIGHTED_INDEX, payload: index });
    }
  }, [suggestions, locationDispatch]);

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
      loading={suggestionsLoading}
      renderOption={(props, option) => (
        <li
          {...props}
          key={option.id}
          style={!option.id || option.id === ADD_UNKNOWN ? { pointerEvents: 'none', color: 'InactiveCaptionText', fontStyle: 'italic' } : {}}
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
          error={!!locationError.address || !!locationNullError.address}
          helperText={locationError.address || locationNullError.address}
          label="Search address"
          placeholder="Enter a place, city, county, state, or country"
          size="small"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 1, mr: -1 }}>
                {!suggestionsLoading && !locationLoading ? (
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
