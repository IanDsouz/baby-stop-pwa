import React from 'react';
import ReactDOM from 'react-dom/client'; // Note that we use 'react-dom/client'
import './index.css';
import App from './App';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
