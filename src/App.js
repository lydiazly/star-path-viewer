// src/App.js
// import logo from './logo.svg';
import './App.css';
import React, { useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Box, Stack, Typography, Alert } from '@mui/material';
import { ServiceProvider } from './context/ServiceContext';
import Footer from './components/Footer';
import DiagramFetcher from './components/DiagramFetcher';
import InfoDisplay from './components/InfoDisplay';
import ImageDisplay from './components/ImageDisplay';
import DownloadManager from './components/DownloadManager';
import AnnoDisplay from './components/AnnoDisplay';
import TitleImage from './assets/title-image.png';

const theme = createTheme();  // Create the default theme

const App = () => {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [diagramId, setDiagramId] = useState('');
  const [svgData, setSvgData] = useState('');
  const [anno, setAnno] = useState([]);
  const [info, setInfo] = useState({
    lat: '', lng: '',
    dateG: { year: '', month: '', day: '' },
    dateJ: { year: '', month: '', day: '' },
    flag: '', cal: '',
    name: '', hip: '', ra: '', dec: '',
    eqxSolTime: '',
  });

  const clearImage = useCallback(() => {
    setDiagramId('');
    setSvgData('');
    setAnno([]);
  }, []);

  return (
    <ServiceProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ pt: 3, pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              minHeight: '88vh',
              textAlign: 'center',
              gap: 1,  // Default MUI spacing: 8px
            }}
          >

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginX: 'auto',
                marginBottom: '0.6rem',
                maxWidth: '320px',
                width: {
                  xs: '100%',
                  sm: '100%',
                  md: '90%',
                },
                [theme.breakpoints.up('sm')]: {
                  marginBottom: '1rem',
                },
              }}
            >
              <img
                src={TitleImage}
                alt="Star Path Viewer Title"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </Box>

            <Typography
              variant="subtutle1"
              color="rgba(0, 0, 0, 0.55)"
              fontWeight={400}
              sx={{
                mt: 0.5,
                mb: 1,
                fontSize: '0.7rem',
                [theme.breakpoints.up('sm')]: {
                  fontSize: '0.85rem',
                },
                [theme.breakpoints.up('md')]: {
                  fontSize: '1rem',
                },
              }}
              gutterBottom
            >
              &mdash;&nbsp;Trace a&nbsp;star&nbsp;on any&nbsp;date from -3000-01-29 to 3000-05-06&nbsp;&mdash;
            </Typography>

            <Box id="draw" sx={{ width: '100%', justifyContent: 'center' }}>
              <DiagramFetcher
                setDiagramId={setDiagramId}
                setInfo={setInfo}
                setSvgData={setSvgData}
                setAnno={setAnno}
                setSuccess={setSuccess}
                clearImage={clearImage}
              />
            </Box>

            {success && (
              <Box sx={{ width: '100%', justifyContent: 'center' }}>
                <Box id="information" mt={1}>
                  <InfoDisplay info={info} />
                </Box>

                {svgData && (
                  <Box id="diagram">
                    <Box id="svg-container">
                      <ImageDisplay svgData={svgData} />
                    </Box>

                    <Stack id="download" direction="column" spacing={1} sx={{ mt: -1 }}>
                      <DownloadManager
                        svgData={svgData}
                        filenameBase={`sp_${diagramId}`}
                        dpi={300}
                        setErrorMessage={setErrorMessage}
                      />
                      {!!errorMessage.download && (
                        <Alert severity="error" sx={{ width: '100%', paddingTop: 1, textAlign: 'left' }} onClose={() => setErrorMessage((prev) => ({ ...prev, download: '' }))}>
                          {errorMessage.download}
                        </Alert>
                      )}
                    </Stack>
                  </Box>
                )}

                {anno.length > 0 && (
                  <Box id="annotations" mt={2}>
                    <AnnoDisplay anno={anno} />
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Footer />
        </Container>
      </ThemeProvider>
    </ServiceProvider>
  );
};

export default App;
