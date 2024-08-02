// src/App.js
// import logo from './logo.svg';
import './App.css';
import React, { useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Typography, Box, Alert } from '@mui/material';
import DiagramFetcher from './components/DiagramFetcher';
import InfoDisplay from './components/InfoDisplay';
import ImageDisplay from './components/ImageDisplay';
import DownloadManager from './components/DownloadManager';
import AnnoDisplay from './components/AnnoDisplay';

const theme = createTheme();  // Create the default theme

const App = () => {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [diagramId, setDiagramId] = useState('');
  const [svgData, setSvgData] = useState('');
  const [anno, setAnno] = useState(null);
  const [info, setInfo] = useState(null);

  const clearImage = useCallback(() => {
    setDiagramId('');
    setSvgData('');
    setAnno([]);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ paddingY: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            minHeight: '90vh',
            textAlign: 'center',
            gap: 1,  // Default MUI spacing: 8px
          }}
        >
          
          <Typography variant="h2" component="h1" sx={{ fontSize: '2.5rem' }}>
            Star Trail
          </Typography>

          <Typography
            variant="subtutle1"
            color="grey"
            sx={{ fontSize: '1.1rem', marginBottom: 0 }}
            gutterBottom
          >
            {`\u2014 Star trail of a given star in ancient sky \u2014`}
          </Typography>

          <Box sx={{ width: '100%', justifyContent: 'center', minHeight: '1rem' }}>
            {errorMessage && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {errorMessage}
              </Alert>
            )}
          </Box>

          <Box sx={{ width: '100%', justifyContent: 'center' }}>
            <DiagramFetcher
              setDiagramId={setDiagramId}
              setInfo={setInfo}
              setSvgData={setSvgData}
              setAnno={setAnno}
              setSuccess={setSuccess}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              clearImage={clearImage}
            />
          </Box>

          {success && (
            <Box sx={{ width: '100%', justifyContent: 'center' }}>
              {info && (
                <Box id="information" mt={1}>
                  <InfoDisplay
                    date={{ year: info.year, month: info.month, day: info.day }}
                    location={{ lat: info.lat, lng: info.lng }}
                    star={{ name: info.name, hip: info.hip, ra: info.ra, dec: info.dec }}
                    flag={info.flag}
                    eqxSolTime={info.eqxSolTime}
                  />
                </Box>
              )}
              
              {svgData && (
                <Box id="diagram">
                  <Box id="svg-container">
                    <ImageDisplay svgData={svgData} />
                  </Box>
                  
                  <Box id="download-diagram">
                    <DownloadManager
                      svgData={svgData}
                      filenameBase={`st_${diagramId}`}
                      dpi={300}
                      setErrorMessage={setErrorMessage}
                    />
                  </Box>
                </Box>
              )}
              
              {anno && (
                <Box id="annotations" mt={2}>
                  <AnnoDisplay anno={anno} />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
