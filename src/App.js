// src/App.js
// import logo from './logo.svg';
import './App.css';
import React, { useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Box, Stack, Typography, Alert } from '@mui/material';
import DiagramFetcher from './components/DiagramFetcher';
import InfoDisplay from './components/InfoDisplay';
import ImageDisplay from './components/ImageDisplay';
import DownloadManager from './components/DownloadManager';
import AnnoDisplay from './components/AnnoDisplay';

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

          <Typography variant="h2" component="h1" sx={{ fontSize: '2.5rem', fontWeight: 200 }}>
            Trace This Star
          </Typography>

          <Typography
            variant="subtutle1"
            color="grey"
            sx={{ fontSize: '1.1rem', marginBottom: 1 }}
            gutterBottom
          >
            {`\u2014`} Draw&nbsp;the star&nbsp;trail of a celestial&nbsp;object in&nbsp;the ancient&nbsp;sky {`\u2014`}
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

                  <Stack id="download" direction="column" spacing={1}>
                    <DownloadManager
                      svgData={svgData}
                      filenameBase={`st_${diagramId}`}
                      dpi={300}
                      setErrorMessage={setErrorMessage}
                    />
                    {!!errorMessage.download && (
                      <Alert severity="error" sx={{ width: '100%', paddingTop: 1 }} onClose={() => setErrorMessage((prev) => ({ ...prev, download: '' }))}>
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
      </Container>
    </ThemeProvider>
  );
};

export default App;
