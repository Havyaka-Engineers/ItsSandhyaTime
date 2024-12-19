import { App as KonstaApp, Page } from 'konsta/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './firebase.config'; 
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import SplashScreen from './components/SplashScreen';
import SandhyaPlayer from './pages/SandhyaPlayer';
import ReviewSessionSetting from './pages/ReviewSessionSetting';
import SandhyaSession from "./pages/SandhyaSession";
import { User } from 'firebase/auth';
import UserSettings from './pages/UserSettings';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    // Handle auth state
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      
      if (user) {
        // Check if user has completed onboarding
        const db = getFirestore();
        const prefsDoc = await getDoc(doc(db, 'userPreferences', user.uid));
        setOnboardingCompleted(prefsDoc.exists() && prefsDoc.data()?.onboardingCompleted);
      }
      
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
          <Route 
            path="/" 
            element={
              user 
                ? (onboardingCompleted 
                    ? <Navigate to="/dashboard" /> 
                    : <Navigate to="/onboarding" />)
                : <Navigate to="/signin" />
            } 
          />
          <Route path="/onboarding" element={<UserSettings />} />
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
