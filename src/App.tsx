import { App as KonstaApp, Page } from 'konsta/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './firebase.config'; 
import firebase from './firebase.config';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import SplashScreen from './components/SplashScreen';
import SandhyaPlayer from './pages/SandhyaPlayer';
import ReviewSessionSetting from './pages/ReviewSessionSetting';
import SandhyaSession from "./pages/SandhyaSession";

function App() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Handle auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Handle splash screen
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Show splash for 2 seconds minimum

    return () => {
      unsubscribe();
      clearTimeout(splashTimer);
    };
  }, []);

  if (showSplash || loading) {
    return (
      <KonstaApp theme="material" dark>
        <Page>
          <SplashScreen />
        </Page>
      </KonstaApp>
    );
  }

  return (
    <KonstaApp theme="material" dark>
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/review-settings" element={<ReviewSessionSetting />} />
          <Route path="/sandhya-player" element={<SandhyaPlayer />} />
          <Route path="/sandhya-session" element={<SandhyaSession />} />
        </Routes>
      </Router>
    </KonstaApp>
  );
}

export default App;
