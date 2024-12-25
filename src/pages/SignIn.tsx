// import { Block } from 'konsta/react';
import GoogleSignInButton from '../components/GoogleSignInButton';
import SignInQuote from '../assets/SignInQuote.svg';
import SignInBenifits from '../assets/Benefits.svg';
import BackgroundPattern3 from '../assets/Background_Pattern_3.svg';
import sandhyaTimeLogo from '../assets/SandhyaTime-Logo.svg';
function SignIn() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className=" flex flex-col justify-between w-full h-full max-w-lg relative  bg-[#532C16] bg-center bg-cover"
        style={{ backgroundImage: `linear-gradient(rgba(83, 44, 22, 0.8),rgba(83, 44, 22, 0.8)),url(${BackgroundPattern3})` }}
      >
        <div className="flex justify-center items-center mt-10 relative z-10">
          <img src={sandhyaTimeLogo} alt="Sandhya Time Logo" className="w-30 h-auto" />
        </div>
        <div className="flex justify-center items-center mt-4 relative z-10">
          <img src={SignInQuote} alt="Sandhya Time Logo" className="w-70 h-auto" />
        </div>
        <div className="flex justify-center items-center mt-4 relative z-10">
          <img src={SignInBenifits} alt="Sandhya Time Logo" className="w-70 h-auto" />
        </div>
        <GoogleSignInButton />
      </div>
    </div>
  );
}

export default SignIn;
