import { auth } from '../firebase.config';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import logoutIcon from '../../public/logout.svg';

function SignOutButton() {
  const [signedIn, setSignedIn] = useState(true);

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        // Handle successful sign-out
        console.log('User signed out');
        setSignedIn(false);
      })
      .catch((error) => {
        // Handle errors
        console.error('Error during sign-out:', error);
      });
  };

  if (!signedIn) {
    return <Navigate to="/signin" />;
  }

  return (
    <div>
      <img src={logoutIcon} className="h-6 w-auto" onClick={signOut} />
    </div>
  );
}

export default SignOutButton;
