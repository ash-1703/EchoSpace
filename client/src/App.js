import { ThemeProvider } from '@emotion/react';
// import { CssBaseline } from '@mui/material';
import { createTheme } from '@mui/system';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/loginPage';
import ProfilePage from 'scenes/profilePage';
import { themeSettings } from 'theme';
import { useMemo } from "react";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        {/* <CssBaseline/> */}
        <Routes>
          <Route path="/" element={ <LoginPage/> }></Route>
          <Route path="/home" element={ <HomePage/> }></Route>
          <Route path="/profile/:userId" element={ <ProfilePage/> }></Route>
        </Routes>
      </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
