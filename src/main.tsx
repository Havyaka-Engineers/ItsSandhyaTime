import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UserSettingsProvider } from './contexts/UserSettingsContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserSettingsProvider>
      <App />
    </UserSettingsProvider>
  </StrictMode>,
);
