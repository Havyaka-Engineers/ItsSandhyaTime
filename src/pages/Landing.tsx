import { Page } from 'konsta/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/background-pattern.svg';

const calculateTimeLeft = () => {
  const launchDate = new Date('2025-01-31T00:00:00');
  const difference = launchDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const Landing = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = () => {
    setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
  };

  return (
    <Page>
      <div
        className="fixed inset-0 flex items-center justify-center bg-[#532C16] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(83, 44, 22, 0.8),rgba(83, 44, 22, 0.8)),url(${backgroundImage})`,
        }}
        onMouseDown={handleTouchStart}
        onTouchStart={handleTouchStart}
      >
        <div className="flex flex-col justify-center items-center h-full w-full">
          {/* App Icon */}
          <div className="text-center">
            <img src="/app_icon.png" alt="App Icon" className="w-60 h-60 mx-auto mb-4" />
          </div>

          {/* Countdown Timer */}
          <div className="text-center text-white mt-6">
            <p className="text-lg mb-2">Launching in:</p>
            <div className="flex gap-4 text-2xl font-mono justify-center">
              <div className="text-center">
                <span className="text-yellow-500">{timeLeft.days}</span>
                <div className="text-sm text-gray-300">days</div>
              </div>
              <div className="text-center">
                <span className="text-yellow-500">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <div className="text-sm text-gray-300">hours</div>
              </div>
              <div className="text-center">
                <span className="text-yellow-500">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <div className="text-sm text-gray-300">mins</div>
              </div>
              <div className="text-center">
                <span className="text-yellow-500">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <div className="text-sm text-gray-300">secs</div>
              </div>
            </div>
          </div>

          {/* Festival Wishes and Contact Info */}
          <div className="text-center text-white mt-8">
            <h2 className="text-2xl text-yellow-500 font-bold mb-4">ಶುಭ ಸಂಕ್ರಾಂತಿ</h2>
            <p className="text-lg px-4 max-w-md">
              We require a bit more time to complete the app, interested interns are welcome and can contact 9740080146
            </p>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Landing;
