import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TabNavigation from './components/TabNavigation'; 
import Form from './components/Form';
import SubmissionList from './components/SubmissionList';
import PrivacyPolicy from './components/PrivacyPolicy';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const ADMIN_STORAGE_KEY = 'adminSession';
  const ADMIN_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

  const checkAdminSession = () => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (!stored) return false;

      const parsed = JSON.parse(stored);
      if (!parsed?.expiresAt) {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        return false;
      }

      if (Date.now() > parsed.expiresAt) {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        return false;
      }

      return true;
    } catch {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      return false;
    }
  };

  useEffect(() => {
    // Initial check on mount
    setIsAdmin(checkAdminSession());

    // Re-check periodically so the UI updates when the session expires
    const interval = setInterval(() => {
      setIsAdmin(checkAdminSession());
    }, 60 * 1000); // every minute

    return () => clearInterval(interval);
  }, []);

  const openLoginDialog = () => {
    setPassword('');
    setError('');
    setLoginOpen(true);
  };

  const closeLoginDialog = () => {
    setLoginOpen(false);
    setPassword('');
    setError('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!adminPassword) {
      setError('Admin password is not configured.');
      return;
    }

    if (password === adminPassword) {
      const expiresAt = Date.now() + ADMIN_DURATION_MS;
      localStorage.setItem(
        ADMIN_STORAGE_KEY,
        JSON.stringify({ expiresAt })
      );
      setIsAdmin(true);
      closeLoginDialog();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };
  
  return (
    <Router>
      <TabNavigation isAdmin={isAdmin} />
      <Routes>
        <Route path="/" element={<Form isAdmin={isAdmin} onAdminLoginClick={openLoginDialog} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="/submissions"
          element={
            isAdmin ? <SubmissionList /> : <Navigate to="/" replace />
          }
        />
      </Routes>
      {loginOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
          }}
          onClick={closeLoginDialog}
        >
          <div
            style={{ background: '#fff', padding: '24px', borderRadius: 8, minWidth: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label htmlFor="admin-password" style={{ display: 'block', marginBottom: 4 }}>
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                  autoFocus
                />
              </div>
              {error && (
                <div style={{ color: 'red', marginBottom: 12, fontSize: 14 }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  type="button"
                  onClick={closeLoginDialog}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    background: '#f5f5f5',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '6px 12px',
                    borderRadius: 4,
                    border: 'none',
                    background: '#1976d2',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;
