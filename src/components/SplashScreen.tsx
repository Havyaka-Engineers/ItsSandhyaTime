import { Block } from 'konsta/react';
// import backgroundImage from '../assets/Group 2.svg'
const SplashScreen = () => {
  return (
    <Block
      className="fixed inset-0 flex items-center justify-center bg-[#532C16] bg-cover bg-center"
      style={{ backgroundImage: `url(/public/assets/Group%202.svg)` }}
    >
      <div className="flex flex-col">
        <div className="text-center">
          <img src="/public/app_icon.png" alt="App Icon" className="w-60 h-60 mx-auto mb-4" />
          {/* <div className="animate-pulse text-white text-xl">
          Loading...
        </div> */}
        </div>

        <div className="flex item-center justify-center h-8 w-15 rounded-br-lg rounded-tl-lg bg-[#BB5F2A] ">
          <p className="text-white font-bold text-center p-2">Lite</p>
        </div>
      </div>
    </Block>
  );
};

export default SplashScreen;
