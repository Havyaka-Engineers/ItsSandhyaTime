import { auth } from '../firebase.config';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';

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
      <BiLogOut size={25} onClick={signOut} />
    </div>
  );
}

export default SignOutButton;
