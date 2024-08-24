// src/components/QuickEntryAccordion.js
import React, { useCallback } from 'react';
import { Box, Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDateInput } from '../context/DateInputContext';
import CustomToggleButton from './ui/CustomToggleButton';
import { EQX_SOL_NAMES } from '../utils/constants';

const QuickEntryAccordion = ({ setDateValid }) => {
  const { flag, setFlag, setCal, setFetching, fetchingFromRef } = useDateInput();

  const handleFlagChange = useCallback((event, newFlag) => {
    if (flag === newFlag) {
      setFlag('');  // deselect
      // onDateChange({ ...date, flag: '' });
    } else {
      setFlag(newFlag);  // select another
      if (newFlag) {
        fetchingFromRef.current = 'click';
        setFetching(true);
        setDateValid(false);
        setCal('');  // Force to use Gregorian
        // onDateChange({ ...date, flag: newFlag, cal: '' });
      }
      // else {
      //   onDateChange({ ...date, flag: newFlag });
      // }
    }
  }, [flag, fetchingFromRef, setFlag, setCal, setFetching, setDateValid]);

  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
        sx={{
          minHeight: 0,
          '& .MuiAccordionSummary-content': {
            marginY: 1,
          }
        }}
      >
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="flex-start" pr={1} flexWrap="wrap">
          <Box flex="1 0 auto" textAlign="left" mr={1}>
            <Typography color="primary" variant="body1">
              Quick Entry
            </Typography>
          </Box>
          {/* {date.year && fetching && (
            <Box display="flex" alignItems="center" textAlign="left" flexWrap="wrap">
              <Typography color="action.active" variant="body1">
                &gt; Quering the {EQX_SOL_NAMES[flag]} of this year at this location ...
              </Typography>
            </Box>
          )} */}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingX: 1.5, paddingTop: 0, paddingBottom: 1.5 }}>
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
          {Object.entries(EQX_SOL_NAMES).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <CustomToggleButton
                color="primary"
                size="small"
                aria-label={value}
                value={key}
                selected={flag === key}
                onChange={handleFlagChange}
                fullWidth
              >
                {value}
              </CustomToggleButton>
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(QuickEntryAccordion);
