import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2',
    },
    secondary: {
      main: '#50E3C2', // Soothing green for highlights and interactions
    },
    background: {
      default: '#f4f7fc', // Light background for a modern look
    },
    text: {
      primary: '#333', // Dark, easy-to-read text color
      secondary: '#555', // Slightly lighter secondary text
    },
  },
  typography: {
    fontFamily: `'Roboto', sans-serif`,
    h4: {
      fontWeight: 600,
      color: '#333',
    },
    body1: {
      color: '#555',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          textTransform: 'none',
          padding: '10px 20px',
        },
      },
    },
  },
});

export default theme;
