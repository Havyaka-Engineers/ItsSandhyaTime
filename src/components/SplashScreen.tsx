import backgroundImage from '../assets/background-pattern.svg';
import appIcon from '../../public/app_icon.png';
const SplashScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div
        className="flex flex-col justify-center items-center h-full w-full bg-[#532C16] bg-cover bg-center max-w-lg"
        style={{ backgroundImage: `linear-gradient(rgba(83, 44, 22, 0.8),rgba(83, 44, 22, 0.8)),url(${backgroundImage})` }}
      >
        <div className="text-center">
          <img src={appIcon} alt="App Icon" className="w-60 h-60 mx-auto mb-4" />
          {/* <div className="animate-pulse text-white text-xl">
          Loading...
        </div> */}
        </div>
        <div className="absolute bottom-4 w-full flex justify-center">
          <div className="flex item-center justify-center h-7 w-15 rounded-br-lg rounded-tl-lg bg-[#BB5F2A] ">
            <p className="text-white font-bold text-center p-1">Lite</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
