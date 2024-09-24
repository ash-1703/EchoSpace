// Import necessary dependencies
import { ThemeProvider } from '@emotion/react'; // Provides theme context to the app for styled components
import { CssBaseline } from '@mui/material'; // CSS baseline to normalize styles across browsers
import { createTheme } from '@mui/material/styles'; // Utility to create a custom Material UI theme
import { useSelector } from 'react-redux'; // Hook to access Redux state
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Router components for navigation between different pages
import HomePage from 'scenes/homePage'; // Home page component
import LoginPage from 'scenes/loginPage'; // Login page component
import ProfilePage from 'scenes/profilePage'; // Profile page component
import { themeSettings } from 'theme'; // Custom theme settings, likely based on light/dark mode
import { useMemo } from "react"; // Hook to optimize performance by memoizing expensive computations

// Main App component
function App() {
  // Access the current mode (light or dark) from the Redux store
  const mode = useSelector((state) => state.mode);

  // Memoize the theme creation to optimize performance, only recompute when 'mode' changes
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      {/* Set up routing for different pages */}
      <BrowserRouter>
        {/* Provide the theme to the rest of the app components */}
        <ThemeProvider theme={theme}>
          {/* Normalize the CSS across all browsers */}
          <CssBaseline />
          
          {/* Define all routes for the application */}
          <Routes>
            {/* Route for login page */}
            <Route path="/" element={ <LoginPage/> } />
            {/* Route for home page */}
            <Route path="/home" element={ <HomePage/> } />
            {/* Route for profile page with dynamic userId */}
            <Route path="/profile/:userId" element={ <ProfilePage/> } />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
