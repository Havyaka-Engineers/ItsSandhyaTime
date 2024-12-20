import { Block } from "konsta/react";
import GoogleSignInButton from "../components/GoogleSignInButton";
import GuestSignInButton from "../components/GuestSignInButton";
import {
  SparklesIcon,
  BoltIcon,
  HeartIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

/**
 * SignIn component that displays benefits of the app and authentication options
 * @returns {JSX.Element} SignIn page component
 */
function SignIn(): JSX.Element {
  /**
   * Array of benefits with their corresponding icons
   */
  const benefits: Array<{ text: string; icon: JSX.Element }> = [
    { text: "Sharpened Intellect", icon: <BoltIcon className="w-4 h-4" /> },
    { text: "Mental Clarity", icon: <SparklesIcon className="w-4 h-4" /> },
    { text: "Sin Free Life", icon: <ShieldCheckIcon className="w-4 h-4" /> },
    { text: "Anxiety Free", icon: <HeartIcon className="w-4 h-4" /> },
    { text: "Improved Focus", icon: <LightBulbIcon className="w-4 h-4" /> },
    { text: "Spiritual Progress", icon: <StarIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-gradient-to-br from-amber-900 to-orange-700 w-full h-full max-w-lg relative">
        <Block className="h-full flex flex-col px-4 py-4 sm:py-8">
          {/* Header Section */}
          <Block className="text-center flex-none mt-safe">
            <h2 className="text-xl font-semibold text-amber-100">
              Welcome to Sandhya Time
            </h2>
            <p className="text-amber-200/80 text-sm">
              Begin Your Spiritual Journey
            </p>
          </Block>

          {/* Benefits Section */}
          <Block className="flex-1 flex flex-col justify-center">
            <p className="text-amber-200/90 text-center text-xs uppercase tracking-wider mb-4">
              Transform Your Life Through
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {benefits.map(({ text, icon }) => (
                <div
                  key={text}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-2"
                >
                  <div className="text-amber-500/80">{icon}</div>
                  <span className="text-amber-100 text-xs leading-tight">
                    {text}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-4 mt-6">
              <GoogleSignInButton />
              <GuestSignInButton />
            </div>
          </Block>
        </Block>
      </div>
    </div>
  );
}

export default SignIn;
