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
  const [anno, setAnno] = useState([]);
  const [info, setInfo] = useState({
    year: '', month: '', day: '',
    lat: '', lng: '',
    name: '', hip: '', ra: '', dec: '',
    flag: '',
    eqxSolTime: null,
  });

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
            Star Trail in Ancient Sky
          </Typography>

          <Typography
            variant="body1"
            color={theme.palette.grey[600]}
            sx={{ fontSize: '1.2rem', marginBottom: 0 }}
            gutterBottom
          >
            ... hero text ...
          </Typography>

          <Box sx={{ minHeight: '1rem' }}>
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

          {success && svgData && (
            <Box sx={{ width: '100%', justifyContent: 'center' }}>
              <Box id="information" mt={1}>
                <InfoDisplay
                  date={{ year: info.year, month: info.month, day: info.day }}
                  location={{ lat: info.lat, lng: info.lng }}
                  star={{ name: info.name, hip: info.hip, ra: info.ra, dec: info.dec }}
                  flag={info.flag}
                  eqxSolTime={info.eqxSolTime}
                />
              </Box>
              
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
              
              <Box id="annotations" mt={2}>
                <AnnoDisplay anno={anno} />
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
