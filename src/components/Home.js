// src/components/Home.js
import React, { useState, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import DiagramFetcher from './DiagramFetcher';
import InfoDisplay from './InfoDisplay';
import ImageDisplay from './ImageDisplay';
import DownloadManager from './DownloadManager';
import AnnoDisplay from './AnnoDisplay';
import TitleImage from '../assets/title-image.png';

const Home = () => {
  const theme = useTheme();
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
      <>
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
          <Link to="/" style={{ width: '100%' }}>
            <img
              src={TitleImage}
              alt="Star Path Viewer Title"
              style={{
                width: '100%',
                height: 'auto',
                cursor: 'pointer',
              }}
            />
          </Link>
        </Box>

        <Typography
          variant="subtitle1"
          color="rgba(0, 0, 0, 0.55)"
          fontWeight={400}
          sx={{
            mt: 0,
            mb: 1,
            fontSize: '0.7rem',
            [theme.breakpoints.up('sm')]: {
              fontSize: '0.85rem',
            },
            [theme.breakpoints.up('md')]: {
              fontSize: '1rem',
            },
          }}
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
                  {errorMessage.download && (
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
      </>
  );
};

export default React.memo(Home);
