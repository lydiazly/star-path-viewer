// src/App.js
// import logo from './logo.svg';
import './App.css';
import React, { useState, useCallback } from 'react';
import { Container, CssBaseline, Typography, Box } from '@mui/material';
import DiagramFetcher from './components/DiagramFetcher';
import ImageDisplay from './components/ImageDisplay';
import DownloadManager from './components/DownloadManager';
import AnnoDisplay from './components/AnnoDisplay';

const App = () => {
  const [diagramId, setDiagramId] = useState(null);
  const [svgData, setSvgData] = useState(null);
  const [anno, setAnno] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const clearImage = () => {
    setDiagramId(null);
    setSvgData(null);
    setAnno(null);
  };

  const handleSetErrorMessage = useCallback((message) => {
    setErrorMessage(message);
  }, []);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{ paddingY: 6 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            minHeight: '100vh',
            textAlign: 'center',
            gap: 2, // Default MUI spacing: 2=8px
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Star Trail in Ancient Sky
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
    </>
  );
};

export default App;
