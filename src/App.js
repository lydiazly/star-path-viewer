// src/App.js
// import logo from './logo.svg';
import './App.css';
import React, { useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Typography, Box } from '@mui/material';
import DiagramFetcher from './components/DiagramFetcher';
import ImageDisplay from './components/ImageDisplay';
import DownloadManager from './components/DownloadManager';
import AnnoDisplay from './components/AnnoDisplay';

const theme = createTheme();  // Create the default theme

const App = () => {
  const [diagramId, setDiagramId] = useState('');
  const [svgData, setSvgData] = useState('');
  const [anno, setAnno] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const clearImage = useCallback(() => {
    setDiagramId('');
    setSvgData('');
    setAnno('');
  }, []);

  const handleSetErrorMessage = useCallback((message) => {
    setErrorMessage(message);
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ paddingY: 6 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              minHeight: '80vh',
              textAlign: 'center',
              gap: 1, // Default MUI spacing: 8px
            }}
          >
            <Typography variant="h2" component="h1" sx={{ fontSize: "3rem" }}>
              Star Trail in Ancient Sky
            </Typography>

            <Typography
              variant="body1"
              color={
              theme.palette.grey[600]}
              sx={{ fontSize: "1.2rem" }}
            >
              ... hero text ...
            </Typography>

            <Typography
              variant="body1"
              color="error"
              sx={{ minHeight: '1rem' }}
            >
              {errorMessage}
            </Typography>

            <Box sx={{ width: '100%', justifyContent: 'center' }}>
              <DiagramFetcher
                setDiagramId={setDiagramId}
                setSvgData={setSvgData}
                setAnno={setAnno}
                errorMessage={errorMessage}
                setErrorMessage={handleSetErrorMessage}
                clearImage={clearImage}
              />
            </Box>
            
            {svgData && (
              <Box sx={{ width: '100%', justifyContent: 'center' }}>
                <Box id="svg-container">
                  <ImageDisplay svgData={svgData} />
                </Box>
                <DownloadManager svgData={svgData} filenameBase={`st_${diagramId}`} dpi="300" />
                <Box id="annotations" mt={2}>
                  <AnnoDisplay anno={anno} />
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default App;
