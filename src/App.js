// src/App.js
// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
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
    setErrorMessage(null);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            gap: 2, // Default MUI spacing (8px)
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Ancient Sky
          </Typography>
          <Box sx={{ width: '100%' }}>
            <DiagramFetcher 
              setDiagramId={setDiagramId} 
              setSvgData={setSvgData} 
              setAnno={setAnno} 
              setErrorMessage={setErrorMessage} 
              clearImage={clearImage} 
            />
          </Box>
          {errorMessage && (
            <Typography variant="body1" color="error">
              {errorMessage}
            </Typography>
          )}
          {svgData && (
            <Box sx={{ width: '100%' }}>
              <Box id="svg-container">
                <ImageDisplay svgData={svgData} />
              </Box>
              <DownloadManager svgData={svgData} filenameBase={`st_${diagramId}`} dpi="300" />
              <Box id="annotations">
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
