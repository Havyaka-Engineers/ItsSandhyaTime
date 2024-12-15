import {Block, Button } from "konsta/react";
import { auth } from '../firebase.config';
import { useState } from "react";
import { Navigate } from "react-router-dom";

function SignOutButton() {
  const [signedIn, setSignedIn] = useState(true);

  const signOut = () => {
    auth.signOut()
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
  
  if(!signedIn) {
    return <Navigate to="/signin" />
  }

  return (
    <Block>
        <Button onClick={signOut}>Sign Out</Button>
    </Block>
  ) 

}

export default SignOutButton;