// src/components/Footer.js
import React from 'react';
import { Container, Box, Typography, Link } from '@mui/material';
import CustomDivider from './ui/CustomDivider';

const linkStyle = {
  color: 'primary.main',
};

const Footer = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        flexShrink: 0,
        paddingX: 0,
      }}
    >
      <CustomDivider sx={{ mt: 1.5, mb: 1 }} />
      
      <Box
        component="footer"
        sx={{
          pt: 0,
          pb: 0.8,
          px: { xs: 2, sm: 0, md: 0 },
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Typography variant="body2" color="action.active">
          &copy; {new Date().getFullYear()} Stardial. Created by{' '}
          <Link href="https://github.com/claude-hao" sx={linkStyle}>
            Zhibo Hao
          </Link>
          ,{' '}
          <Link href="https://github.com/lydiazly" sx={linkStyle}>
            Lydia Zhang
          </Link>
          , and Jinsong Guo.
        </Typography>
      </Box>
    </Container>
  );
};

export default React.memo(Footer);
