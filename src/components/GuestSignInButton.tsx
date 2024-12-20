import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Block, Button } from "konsta/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

/**
 * GuestSignInButton component that provides direct access to UserSettings
 * @returns {JSX.Element} Guest access button component
 */
function GuestSignInButton(): JSX.Element {
  const [redirect, setRedirect] = useState<boolean>(false);

  const handleGuestAccess = (): void => {
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <Block className="w-full">
      <Button
        large
        onClick={handleGuestAccess}
        colors={{
          fillBgMaterial: "bg-primary",
          fillTextMaterial: "text-white",
          fillActiveBgMaterial: "active:bg-primary/90",
        }}
        className="flex justify-center items-center gap-2 w-full"
        touchRipple={false}
      >
        <UserCircleIcon className="w-5 h-5 text-white" />
        <span className="text-sm font-medium">Continue as Guest</span>
      </Button>
    </Block>
  );
}

export default GuestSignInButton;
