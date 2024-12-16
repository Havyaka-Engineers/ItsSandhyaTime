import { Page, Block } from 'konsta/react';
import { useState, useEffect } from 'react';

const calculateTimeLeft = () => {
  const launchDate = new Date('2024-12-27T00:00:00');
  const difference = launchDate.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
};

const Landing = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Page>
      <div className="absolute inset-0 bg-gray-900">
        <div className="flex flex-col items-center justify-between min-h-screen px-6 py-20">
          {/* Top text */}
          <div className="text-7xl font-bold text-gray-100">It's</div>

          {/* Center content */}
          <Block className="text-center max-w-full">
            {/* Sun logo */}
            <div className="w-32 h-16 bg-gradient-to-t from-yellow-500 to-orange-300 rounded-t-full mb-6 mx-auto"></div>
            
            <div className="text-7xl font-bold text-yellow-500 mb-4 break-words">Sandhya</div>
          </Block>

          {/* Bottom text */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-7xl font-bold text-gray-100">Time!</div>
            
            {/* Countdown timer */}
            <div className="text-xl text-gray-300 mt-8 text-center">
              <div className="mb-2">Launching in</div>
              <div className="flex gap-4 text-2xl font-mono">
                <div className="text-center">
                  <span className="text-yellow-500">{timeLeft.days}</span>
                  <div className="text-sm text-gray-400">days</div>
                </div>
                <div className="text-center">
                  <span className="text-yellow-500">{timeLeft.hours.toString().padStart(2, '0')}</span>
                  <div className="text-sm text-gray-400">hours</div>
                </div>
                <div className="text-center">
                  <span className="text-yellow-500">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <div className="text-sm text-gray-400">mins</div>
                </div>
                <div className="text-center">
                  <span className="text-yellow-500">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  <div className="text-sm text-gray-400">secs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Landing; 