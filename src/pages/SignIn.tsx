import { Page, Block } from 'konsta/react';
// import { GoogleSignIn } from '../components/GoogleSignIn';

const SignIn = () => {
  return (
    <Page>
      <div className="absolute inset-0 bg-gray-900">
        <div className="flex flex-col items-center justify-between min-h-screen px-6 py-40">
          {/* Top text */}
          <div className="text-7xl font-bold text-gray-100">It's</div>

          {/* Center content */}
          <Block className="text-center max-w-full">
            {/* Sun logo */}
            <div className="w-32 h-16 bg-gradient-to-t from-yellow-500 to-orange-300 rounded-t-full mb-6 mx-auto"></div>
            
            <div className="text-7xl font-bold text-yellow-500 mb-4 break-words">Sandhya</div>
          </Block>

          {/* Bottom text */}
          <div className="text-7xl font-bold text-gray-100">Time!</div>
        </div>
      </div>
    </Page>
  );
};

export default SignIn;