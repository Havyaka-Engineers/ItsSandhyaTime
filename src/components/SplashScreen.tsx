import { Block } from 'konsta/react';

const SplashScreen = () => {
  return (
    <Block className="fixed inset-0 flex items-center justify-center bg-primary-900">
      <div className="text-center">
        <img 
          src="/app_icon.png" 
          alt="App Icon" 
          className="w-32 h-32 mx-auto mb-4"
        />
        <div className="animate-pulse text-white text-xl">
          Loading...
        </div>
      </div>
    </Block>
  );
};

export default SplashScreen; 