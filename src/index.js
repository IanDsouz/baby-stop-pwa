import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import getBaseURL from './apiConfig';


// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        if (registration.active) {
          registration.active.postMessage({ type: 'SET_BASE_URL', baseURL: getBaseURL() });
        }
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
