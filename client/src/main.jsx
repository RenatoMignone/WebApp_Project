// -----------------------------------------------------------------------------
// Main Entry Point
// -----------------------------------------------------------------------------
// This file is the entry point for the React application. It renders the root
// component (App) inside the HTML element with the ID 'root'. The application
// uses React Router for navigation.
// -----------------------------------------------------------------------------

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Render the root component (App) wrapped with StrictMode and BrowserRouter
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
