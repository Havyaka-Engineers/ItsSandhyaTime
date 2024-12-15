// GoogleSignInButton.tsx
import { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from '../firebase.config';
import { Navigate } from 'react-router-dom';
import {Block, Button, Preloader } from 'konsta/react';

function GoogleSignInButton() {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = () => {
    
    //sign in is async op. Until, the promise resolves, we need to show loading icon.
    setLoading(true);

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => {
        // Handle successful sign-in
        console.log('Google Sign In Successful.', result.user);
        setSignedIn(true);
      })
      .catch((error) => {
        // Handle errors
        console.error('Error during sign-in:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  if(signedIn) {
    return <Navigate to="/dashboard" />
  }

  return (
    <Block className='text-center'>
      {loading ? (
        <Preloader />
      ) : (
        <Button
              large
              onClick={signInWithGoogle}
              className="flex justify-center items-center bg-transparent p-0 border-none cursor-pointer"
        >
          <img
            src="/android_neutral_rd_ctn@1x.png"
            alt="Sign In with Google"
            className="w-full h-auto"
          />
        </Button>
      )}
    </Block>  
  );
};

export default GoogleSignInButton;
