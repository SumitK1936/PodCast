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
const { token } = useContext(AuthContext);

useEffect(() => {
AOS.init({ duration: 800, once: true });
const timer = setTimeout(() => setShowSplash(false), 4000);
return () => clearTimeout(timer);
}, []);

useEffect(() => {
document.body.className = darkMode ? 'dark' : 'light';
localStorage.setItem('theme', darkMode ? 'dark' : 'light');
}, [darkMode]);

const { user, logout, switchAccount } = useContext(AuthContext);

const handleLogout = () => {
const confirm = window.confirm('Are you sure you want to logout?');
if (confirm) {
logout();
toast.success('You have been logged out!');
}
};

if (showSplash) return <SplashScreen />;

return (
<div className="app-container">
<ToastContainer position="bottom-right" />
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
              />
              <PodcastList showLikedOnly={showLikedOnly} />
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
switchAccount
}) {
const [showDropdown, setShowDropdown] = React.useState(false);
const [savedUsers, setSavedUsers] = React.useState(() =>
Object.keys(JSON.parse(localStorage.getItem('userTokens') || '{}'))
);

return (
<header style={{ padding: '1rem', position: 'relative' }}>
{/* Top-right controls */}
<div
style={{
position: 'absolute',
top: '1rem',
right: '1rem',
display: 'flex',
gap: '12px'
}}
>
{user && (
<>
<div className="tooltip-container" style={{ position: 'relative' }}>
<button
onClick={() => setShowDropdown((prev) => !prev)}
style={{
backgroundColor: darkMode ? '#1e40af' : '#3b82f6',
color: '#fff',
fontWeight: 'bold',
borderRadius: '8px',
padding: '8px 12px',
border: 'none',
cursor: 'pointer'
}}
>
🔄 Switch
</button>
<span className="tooltip-text">Switch to a different account</span>
{showDropdown && (
<div
style={{
position: 'absolute',
top: '110%',
right: 0,
background: '#1e293b',
color: '#fff',
borderRadius: '8px',
boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
padding: '8px',
zIndex: 999
}}
>
{savedUsers.length > 0 ? (
  savedUsers.map((u, i) => (
    <div
      key={i}
      onClick={() => switchAccount(u)}
      style={{
        padding: '8px 16px',
        marginBottom: '6px',
        borderRadius: '6px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        textAlign: 'left',
        fontWeight: user?.username === u ? 'bold' : 'normal',
        backgroundColor: user?.username === u ? '#3b82f6' : 'transparent',
        transition: 'background 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#0ea5e9')}
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = user?.username === u ? '#3b82f6' : 'transparent')
      }
    >
      @{u}
    </div>
  ))
) : (
  <div style={{ padding: '6px 12px', color: '#ccc' }}>No saved accounts</div>
)}

</div>
)}
</div>
        <div className="tooltip-container">
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: darkMode ? '#7f1d1d' : '#dc2626',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '8px',
              padding: '8px 12px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🔓 Logout
          </button>
          <span className="tooltip-text">Logout of your account</span>
        </div>
      </>
    )}
  </div>

  {/* Logo and theme toggle */}
  <div>
    <h1>🎧 PodVerse</h1>
    <p>Your gateway to inspiring audio journeys</p>
    <div style={{ marginTop: '1rem' }}>
      <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
        {darkMode ? '🌞 Light' : '🌙 Dark'}
      </button>
      <button
        onClick={() => setShowLikedOnly((prev) => !prev)}
        className="theme-toggle"
        style={{ marginLeft: '10px' }}
      >
        {showLikedOnly ? '🎵 All Podcasts' : '💖 Show Liked'}
      </button>
      {user && (
        <span style={{ marginLeft: '15px', color: '#94a3b8' }}>
          Logged in as <strong>@{user.username}</strong>
        </span>
      )}
    </div>
  </div>
</header>
);
}

export default App;