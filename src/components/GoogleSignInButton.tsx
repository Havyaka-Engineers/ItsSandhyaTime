import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase.config';
import { Block, Button, Preloader } from 'konsta/react';
import { userService } from '../services/userService';

function GoogleSignInButton() {
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check user existence in the database
      const userProfile = await userService.getUserProfile(user.uid);

      if (userProfile) {
        // User exists, navigate to landing page
        setRedirectPath('/landing');
      } else {
        setRedirectPath('/onboarding');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    } finally {
      setLoading(false);
    }
  };

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return (
    <Block className="text-center">
      {loading ? (
        <Preloader />
      ) : (
        <Button
          large
          onClick={signInWithGoogle}
          className="flex justify-center items-center p-0 border-none cursor-pointer"
          style={{ height: '60px', background: '#B43403' }}
        >
          <p className="text-xl text-white">Continue With Google</p>
        </Button>
      )}
    </Block>
  );
}

export default GoogleSignInButton;
