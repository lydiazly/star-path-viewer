// src/App.js
import './App.css';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ServiceProvider } from './context/ServiceContext';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

const theme = createTheme();  // Create the default theme

const App = () => {
  return (
    <ServiceProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router basename="/star-path-viewer">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              minHeight: '100vh',
              textAlign: 'center',
              gap: 1,  // Default MUI spacing: 8px
            }}
          >
            <Container maxWidth="md" sx={{ flex: '1 0 auto', pt: 3, pb: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Container>

            <Box sx={{ flexShrink: 0 }}>
              <Footer />
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </ServiceProvider>
  );
};

export default App;
