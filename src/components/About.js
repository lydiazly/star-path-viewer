// src/components/About.js
import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import AboutImage from '../assets/about-image.svg';
import Logo from '../assets/logo.svg';
import Config from '../Config';

const linkStyle = {
  color: 'primary.main',
  fontWeight: 'bold',
};

const About = () => {
  return (
    <>
      <Box sx={{ marginTop: 6 }}>
        <img
          src={Logo}
          alt="Logo"
          style={{
            maxWidth: '8rem',
            objectFit: 'contain',  // Maintain aspect ratio and contain the image within the Box
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingX: 1,
          marginX: 'auto',
          marginTop: 2,
          marginBottom: 4,
          width: '100%',
        }}
      >
        <img
          src={AboutImage}
          alt="About Title"
          style={{
            maxHeight: '2.1rem',
            objectFit: 'contain',  // Maintain aspect ratio and contain the image within the Box
            cursor: 'pointer',
          }}
        />
      </Box>

      <Box display="flex" flexWrap="wrap" gap="1rem" marginX={{ xs: 1.5, sm: 4, md: 6 }}>
        <Typography variant="body1" textAlign="left">
          The team{' '}
          <Link href="https://github.com/stardial-astro" sx={linkStyle}>
            Stardial
          </Link>
          {' '}is trying to develop some useful tools in the interdisciplinary field of history and astronomy. Directness, accuracy, and easy-to-use what we pursue.
        </Typography>
        <Typography variant="body1" textAlign="left">
          <Link href={Config.basename} sx={linkStyle}>
            Star Path Viewer
          </Link>
          {' '}is our first web application designed to help historians intuitively understand the motion of a celestial object on any given date in ancient times. Utilizing the Skyfield Python package and JPL ephemeris data, the application accurately calculates the path and illustrates it in the local horizontal coordinate system. This simulation replicates the view ancient observers would have had of celestial objects crossing the sky.
        </Typography>
        <Typography variant="body1" textAlign="left">
          To provide a comprehensive visual experience, distinct line styles differentiate the path during the day, night, and various twilight stages. Significant moments in the celestial object's trajectory, including its rising, meridian transit, and setting times, are also marked. In particular, Star Path Viewer highlights the transition times between different twilight stages, as well as the celestial object's corresponding positional information.
        </Typography>
      </Box>
    </>
  );
};

export default React.memo(About);
