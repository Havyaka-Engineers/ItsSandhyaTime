import { Block } from "konsta/react";
import GoogleSignInButton from "../components/GoogleSignInButton";

function SignIn() {
  return (
    <Block>
      <Block>
        <p>Here comes my PWA app with Google SignIn and Routing!</p>
      </Block>
      <GoogleSignInButton />
    </Block>
  )
}

export default SignIn;