import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChatInterface from './components/ChatInterface';
import Navbar from './components/Navbar';
import Onboarding from './components/Onboarding';

export const ThemeContext = React.createContext();
export const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowOnboarding(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <UserContext.Provider value={{ user, setUser: handleLogin, logout: handleLogout }}>
        <Router>
          <div className={`App min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/" 
                  element={
                    user ? (
                      <>
                        <ChatInterface />
                        {showOnboarding && (
                          <Onboarding onClose={() => setShowOnboarding(false)} />
                        )}
                      </>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;