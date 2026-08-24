import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { IncidentProvider } from './context/IncidentContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IncidentProvider>
      <App />
    </IncidentProvider>
  </StrictMode>,
);
