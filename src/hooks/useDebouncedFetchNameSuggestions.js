// src/hooks/useDebouncedFetchSuggestions.js
import { useMemo } from 'react';
import fetchNameSuggestions from '../utils/fetchNameSuggestions';
import debounce from 'lodash/debounce';

const useDebouncedFetchSuggestions = (
  isSelecting,
  latestSuggestionRequest,
  actionTypes,
  dispatch,
  setErrorMessage,
  typingDelay
) => {
  return useMemo(
    () =>
      debounce(
        async (query, serviceChosen) => {
          if (query && !isSelecting.current) {
            try {
              const requestId = ++latestSuggestionRequest.current;  // Increment and capture the current request ID

              const suggestions = await fetchNameSuggestions(query);

              /* Only update if this request is the latest one */
              if (requestId === latestSuggestionRequest.current) {
                dispatch({ type: actionTypes.SET_SUGGESTIONS, payload: suggestions });
              }
            } catch (error) {
              setErrorMessage((prev) => ({ ...prev, star: error.message }));
            }
          }
          isSelecting.current = false;
        },
        typingDelay
      ),
    [isSelecting, latestSuggestionRequest, actionTypes, dispatch, setErrorMessage, typingDelay]
  );
};

export default useDebouncedFetchSuggestions;
