import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UserSettingsProvider } from './contexts/UserSettingsContext';

createRoot(document.getElementById('root')!).render(
  <UserSettingsProvider>
    <App />
  </UserSettingsProvider>,
);
