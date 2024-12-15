import { App as KonstaApp, Page, Preloader, Block } from 'konsta/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './firebase.config'; 
import firebase from './firebase.config';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import SandhyaPlayer from './pages/SandhyaPlayer';
import ReviewSessionSetting from './pages/ReviewSessionSetting';
import SandhyaSession from "./pages/SandhyaSession";
import Landing from './pages/Landing';


function App() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <KonstaApp theme="material" dark>
        <Page>
          <Block className="flex justify-center">
            <Preloader />
          </Block>
        </Page>
      </KonstaApp>
    );
  }
  return (
    <KonstaApp theme="material" dark>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={user ? <Navigate to="/app/dashboard" /> : <Navigate to="/app/signin" />} />
          <Route path="/app/dashboard" element={user ? <Dashboard /> : <Navigate to="/app/signin" />} />
          <Route path="/app/signin" element={<SignIn />} />
          <Route path="/app/review-settings" element={<ReviewSessionSetting />} />
          <Route path="/app/sandhya-player" element={<SandhyaPlayer />} />
          <Route path="/app/sandhya-session" element={<SandhyaSession />} />
        </Routes>
      </Router>
    </KonstaApp>
  );
}

export default App
