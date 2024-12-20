import logo from "../../public/logo.svg";

/**
 * SplashScreen component that displays the app logo with breathing concentric circles
 * @returns JSX.Element - The splash screen with animated logo and circles
 */
const SplashScreen = (): JSX.Element => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-gradient-to-br from-amber-900 to-amber-800 w-full h-full max-w-lg relative">
        {/* Logo container with concentric circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Fixed size container to maintain circle shape */}
          <div className="relative w-64 h-64">
            {/* Concentric circles - from outer to inner */}
            <div className="absolute inset-0 -m-32 animate-ring-breathe animation-delay-450">
              <div className="absolute inset-0 bg-amber-500/5 rounded-full" />
            </div>
            <div className="absolute inset-0 -m-24 animate-ring-breathe animation-delay-300">
              <div className="absolute inset-0 bg-amber-500/10 rounded-full" />
            </div>
            <div className="absolute inset-0 -m-16 animate-ring-breathe animation-delay-150">
              <div className="absolute inset-0 bg-amber-500/15 rounded-full" />
            </div>
            <div className="absolute inset-0 -m-8 animate-ring-breathe">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full" />
            </div>
            {/* Inner circles */}
            <div className="absolute inset-0 -m-4 animate-ring-breathe animation-delay-150">
              <div className="absolute inset-0 bg-amber-500/25 rounded-full" />
            </div>
            <div className="absolute inset-0 -m-2 animate-ring-breathe animation-delay-300">
              <div className="absolute inset-0 bg-amber-500/30 rounded-full" />
            </div>

            {/* Logo with breathing animation - centered in the fixed container */}
            <div className="absolute inset-0 flex items-center justify-center animate-logo-breathe">
              <img src={logo} alt="Logo" className="w-32 h-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
