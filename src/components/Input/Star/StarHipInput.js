// src/components/Input/Star/StarHipInput.js
import React, { useEffect, useCallback } from 'react';
import { Box, Autocomplete, TextField, Typography } from '@mui/material';
import Config from '../../../Config';
import { useStarInput } from '../../../context/StarInputContext';
import * as actionTypes from '../../../context/starInputActionTypes';
import useDebouncedFetchNameSuggestions from '../../../hooks/useDebouncedFetchNameSuggestions';
import { HIP_MIN, HIP_MAX, HIP_OUT_OF_RANGE, HIP_NOT_FOUND } from '../../../utils/constants';

const hipStyle = { textAlign: 'left', mr: 1 };
const nameStyle = { textAlign: 'left', color: 'primary.main' };

const StarHipInput = ({ setErrorMessage }) => {
  const {
    searchTerm,
    suggestions,
    highlightedIndex,
    cachedNames,
    latestSuggestionRequest,
    isSelecting,
    starError, starNullError,
    starDispatch,
  } = useStarInput();

  /* Clear suggestions and reset highlightedIndex */
  useEffect(() => {
    if (!searchTerm) {
      starDispatch({ type: actionTypes.SET_STAR_HIP, payload: '' });
      starDispatch({ type: actionTypes.CLEAR_SUGGESTIONS });
      starDispatch({ type: actionTypes.CLEAR_HIGHLIGHTED_INDEX });
    }
  }, [searchTerm, starDispatch]);

  useEffect(() => {
    if (suggestions.length > 0) {
      if (suggestions[0].display_name === HIP_OUT_OF_RANGE) {
        starDispatch({ type: actionTypes.SET_STAR_HIP_ERROR, payload: `The Hipparchus Catalogue Number must be in the range [${HIP_MIN}, ${HIP_MAX}].` });
        starDispatch({ type: actionTypes.CLEAR_SUGGESTIONS });
        starDispatch({ type: actionTypes.SET_STAR_VALID, payload: false });
        return;
      }
      if (suggestions[0].display_name === HIP_NOT_FOUND) {
        starDispatch({ type: actionTypes.SET_STAR_HIP_ERROR, payload: 'No match found.' });
        starDispatch({ type: actionTypes.CLEAR_SUGGESTIONS });
        starDispatch({ type: actionTypes.SET_STAR_VALID, payload: false });
        return;
      }
      /* Set highlightedIndex to 0 after fetching suggestions */
      if (highlightedIndex < 0) {
        starDispatch({ type: actionTypes.SET_HIGHLIGHTED_INDEX, payload: 0 });
      }
    }
  }, [suggestions, highlightedIndex, starDispatch]);

  const debouncedFetchNameSuggestions = useDebouncedFetchNameSuggestions(
    isSelecting,
    latestSuggestionRequest,
    actionTypes,
    cachedNames,
    starDispatch,
    setErrorMessage,
    cachedNames? Config.TypingDelay : Config.TypingDelay + 300
  );

  /* Cleanup the debounced function on unmount */
  useEffect(() => {
    return () => {
      debouncedFetchNameSuggestions.cancel();
    };
  }, [debouncedFetchNameSuggestions]);

  const handleSearchChange = useCallback(
    (event, newSearchTerm) => {
      starDispatch({ type: actionTypes.SET_SEARCH_TERM, payload: newSearchTerm });
      const trimmedNewSearchTerm = newSearchTerm.trim();
      debouncedFetchNameSuggestions(trimmedNewSearchTerm);
      if (!trimmedNewSearchTerm) {
        starDispatch({ type: actionTypes.SET_STAR_HIP, payload: '' });
        starDispatch({ type: actionTypes.CLEAR_SUGGESTIONS });
      }
    },
    [starDispatch, debouncedFetchNameSuggestions]
  );

  const handleSelect = useCallback((event, value) => {
    if (!value || !value.hip || value.display_name === HIP_OUT_OF_RANGE || value.display_name === HIP_NOT_FOUND) {
      starDispatch({ type: actionTypes.SET_STAR_HIP, payload: '' });
      starDispatch({ type: actionTypes.SET_STAR_VALID, payload: false });
      starDispatch({ type: actionTypes.CLEAR_SEARCH_TERM });
      return;
    }

    const selectedSuggestion = suggestions.find(
      (suggestion) => suggestion.hip === value.hip
    );
    if (selectedSuggestion) {
      isSelecting.current = true;
      starDispatch({ type: actionTypes.SET_STAR_HIP, payload: selectedSuggestion.hip });
      starDispatch({ type: actionTypes.SET_SEARCH_TERM, payload: selectedSuggestion.display_name });
      starDispatch({ type: actionTypes.CLEAR_SUGGESTIONS });
    }
  }, [isSelecting, suggestions, starDispatch]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      /* Prevent default 'Enter' behavior */
      event.defaultMuiPrevented = true;
      /* Select the highlighted suggestion */
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        const highlightedSuggestion = suggestions[highlightedIndex];
        if (highlightedSuggestion.hip && highlightedSuggestion.display_name !== HIP_OUT_OF_RANGE) {
          isSelecting.current = true;
          starDispatch({ type: actionTypes.SET_STAR_HIP, payload: highlightedSuggestion.hip });
          starDispatch({ type: actionTypes.SET_SEARCH_TERM, payload: highlightedSuggestion.hip });
          starDispatch({ type: actionTypes.CLEAR_SUGGESTIONS });
        }
      }
    }
  }, [highlightedIndex, isSelecting, suggestions, starDispatch]);

  const handleHighlightChange = useCallback((event, option, reason) => {
    if (reason === 'keyboard' || reason === 'mouse') {
      const index = suggestions.findIndex((suggestion) => suggestion.hip === option.hip);
      starDispatch({ type: actionTypes.SET_HIGHLIGHTED_INDEX, payload: index });
    }
  }, [suggestions, starDispatch]);

  return (
    <Autocomplete
      freeSolo
      clearOnEscape
      autoHighlight
      options={searchTerm.trim() ? suggestions : []}
      getOptionLabel={(option) => option.hip}
      inputValue={searchTerm}
      onInputChange={handleSearchChange}
      onChange={handleSelect}
      onKeyDown={handleKeyDown}
      onHighlightChange={handleHighlightChange}
      filterOptions={(x) => x}
      renderOption={(props, option) => (
        <li
          {...props}
          key={option.hip}
          style={!option.hip || option.hip === HIP_NOT_FOUND ? { pointerEvents: 'none', color: 'InactiveCaptionText', fontStyle: 'italic' } : {}}
        >
          <Box display="flex" alignItems="start" flexWrap="wrap">
            <Typography sx={hipStyle}>
              {option.hip}
            </Typography>
            {option.name && (
              <Typography sx={nameStyle}>
                {option.name_zh ? `(${option.name}/${option.name_zh})` : `(${option.name})`}
              </Typography>
            )}
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          label="Search Hipparchus Catalogue Number"
          placeholder="Enter a number or a name"
          size="small"
          variant="outlined"
          fullWidth
          error={!!starError.hip || !!starNullError.hip}
          helperText={starError.hip || starNullError.hip}
          InputProps={{
            ...params.InputProps,
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ marginTop: 2 }}
        />
      )}
    />
  );
};

export default React.memo(StarHipInput);
