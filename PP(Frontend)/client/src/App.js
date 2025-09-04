import { Routes, Route, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState, useContext } from 'react';
import PodcastList from './components/PodcastList';
import PodcastDetails from './components/PodcastDetails';
import SplashScreen from './SplashScreen';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthContext } from './context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [showSplash, setShowSplash] = useState(true);
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFAB, setShowFAB] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    AOS.init({ 
      duration: 800, 
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowFAB(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { user, logout, switchAccount } = useContext(AuthContext);

  const handleLogout = () => {
    const confirm = window.confirm('Are you sure you want to logout?');
    if (confirm) {
      logout();
      toast.success('You have been logged out!');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showSplash) return <SplashScreen />;

  return (
    <div className="app-container">
      <ToastContainer 
        position="bottom-right" 
        theme={darkMode ? 'dark' : 'light'}
        autoClose={3000}
      />
      
      {/* Floating Action Button */}
      {showFAB && (
        <button
          onClick={scrollToTop}
          className="fab"
        >
          ⬆️
        </button>
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        {token ? (
          <>
            <Route
              path="/"
              element={
                <>
                  <Header
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    showLikedOnly={showLikedOnly}
                    setShowLikedOnly={setShowLikedOnly}
                    user={user}
                    handleLogout={handleLogout}
                    switchAccount={switchAccount}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                  <PodcastList showLikedOnly={showLikedOnly} searchQuery={searchQuery} />
                </>
              }
            />
            <Route
              path="/podcast/:id"
              element={
                <>
                  <Header
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    showLikedOnly={showLikedOnly}
                    setShowLikedOnly={setShowLikedOnly}
                    user={user}
                    handleLogout={handleLogout}
                    switchAccount={switchAccount}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                  <PodcastDetails />
                </>
              }
            />
          </>
        ) : (
          // Redirect if not logged in
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
}

function Header({
  darkMode,
  setDarkMode,
  showLikedOnly,
  setShowLikedOnly,
  user,
  handleLogout,
  switchAccount,
  searchQuery,
  setSearchQuery
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [savedUsers, setSavedUsers] = useState(() =>
    Object.keys(JSON.parse(localStorage.getItem('userTokens') || '{}'))
  );

  return (
    <header className="modern-header">
      {/* Top navigation bar */}
      <div className="top-nav">
        <div className="logo-section">
          <h1 className="logo">🎧 PodVerse</h1>
          <p className="tagline">Your gateway to inspiring audio journeys</p>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search podcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* User controls */}
        <div className="user-controls">
          {user && (
            <>
              <button
                className="control-btn switch-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                🔄 Switch
                <span className="tooltip">Switch to a different account</span>
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  {savedUsers.length > 0 ? (
                    savedUsers.map((u, i) => (
                      <div
                        key={i}
                        className={`dropdown-item ${user?.username === u ? 'active' : ''}`}
                        onClick={() => switchAccount(u)}
                      >
                        👤 @{u}
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-item disabled">No saved accounts</div>
                  )}
                </div>
              )}

              <button
                className="control-btn logout-btn"
                onClick={handleLogout}
              >
                🔓 Logout
                <span className="tooltip">Logout of your account</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="bottom-controls">
        <div className="control-group">
          <button 
            className="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '🌞 Light' : '🌙 Dark'}
          </button>

          <button
            className={`filter-btn ${showLikedOnly ? 'active' : ''}`}
            onClick={() => setShowLikedOnly(!showLikedOnly)}
          >
            💖 {showLikedOnly ? 'All Podcasts' : 'Show Liked'}
          </button>

          <button
            className="filter-btn"
            onClick={() => window.location.reload()}
          >
            📈 Trending
          </button>
        </div>

        {user && (
          <div className="user-info">
            👤 <span>Logged in as <strong>@{user.username}</strong></span>
          </div>
        )}
      </div>
    </header>
  );
}

export default App;