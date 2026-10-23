import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { TripsProvider } from './context/TripsContext.jsx';
import { ApiKeyProvider } from './context/ApiKeyContext.jsx';
import { ToastProvider } from './components/common/Toast.jsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ApiKeyProvider>
          <TripsProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </TripsProvider>
        </ApiKeyProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
