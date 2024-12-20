// GoogleSignInButton.tsx
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase.config";
import { Navigate } from "react-router-dom";
import { Block, Button, Preloader } from "konsta/react";
import { Google as GoogleIcon } from "@mui/icons-material";

function GoogleSignInButton() {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = () => {
    setLoading(true);

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Google Sign In Successful.", result.user);
        setSignedIn(true);
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (signedIn) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <Block className="w-full">
      {loading ? (
        <div className="flex justify-center">
          <Preloader />
        </div>
      ) : (
        <Button
          large
          onClick={signInWithGoogle}
          colors={{
            fillBgMaterial: "bg-primary",
            fillTextMaterial: "text-white",
            fillActiveBgMaterial: "active:bg-primary/90",
          }}
          className="flex justify-center items-center gap-2 w-full"
          touchRipple={false}
        >
          <GoogleIcon className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">Sign in with Google</span>
        </Button>
      )}
    </Block>
  );
}

export default GoogleSignInButton;
