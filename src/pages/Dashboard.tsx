import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Block } from 'konsta/react';
import { SessionSettings } from '../types/SessionSettings';
import { Lesson } from '../types/Lesson';
import { VISHNU_SMARANA } from '../data/lessons/VISHNU_SMARANA';
import { calculateTotalDuration } from '../utils/durationCalculator';
import PermissionDialog from '../components/PermissionDialog';
import logo from '../assets/SandhyaTime-Logo.svg';
import backgroundpattern from '../assets/background-pattern2.svg';

// Define types
type Location = {
  latitude: number;
  longitude: number;
};

type SunTimes = {
  sunrise: string;
  sunset: string;
};

// Function to get user's location using Geolocation API
const getUserLocation = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => reject(error),
    );
  });
};

// Function to fetch sunrise and sunset times using Sunrise-Sunset API
const getSunriseSunset = async (latitude: number, longitude: number): Promise<SunTimes> => {
  const apiUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (data.status === 'OK') {
    return {
      sunrise: data.results.sunrise,
      sunset: data.results.sunset,
    };
  } else {
    throw new Error('Unable to fetch sunrise and sunset times.');
  }
};

const sendTimesToServiceWorker = async (sunriseTimestamp: number, sunsetTimestamp: number) => {
  try {
    // Wait for service worker registration
    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker ready state:', {
      active: !!registration.active,
      installing: !!registration.installing,
      waiting: !!registration.waiting,
    });

    if (!registration.active) {
      throw new Error('Service Worker is not active');
    }

    // Create a message channel
    const messageChannel = new MessageChannel();

    // Create a promise to wait for the response
    const responsePromise = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        messageChannel.port1.onmessage = null;
        reject(new Error('Timeout waiting for service worker response'));
      }, 5000);

      messageChannel.port1.onmessage = (event) => {
        console.log('Received response from Service Worker:', event.data);
        clearTimeout(timeoutId);
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data);
        }
      };
    });

    // Send the message with the port
    const message = {
      type: 'SET_SUN_TIMES',
      sunrise: sunriseTimestamp,
      sunset: sunsetTimestamp,
    };
    console.log('Sending message to Service Worker:', message);

    registration.active.postMessage(message, [messageChannel.port2]);

    // Wait for the response
    await responsePromise;
    console.log('Successfully received response from Service Worker');
  } catch (error) {
    console.error('Error sending message to Service Worker:', error);
  }
};

const showNotification = async (title: string, body: string, data: any = {}) => {
  try {
    // Wait for service worker registration
    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker ready state:', {
      active: !!registration.active,
      installing: !!registration.installing,
      waiting: !!registration.waiting,
    });

    if (!registration.active) {
      throw new Error('Service Worker is not active');
    }

    // Create a message channel
    const messageChannel = new MessageChannel();

    // Create a promise to wait for the response
    const responsePromise = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        messageChannel.port1.onmessage = null;
        reject(new Error('Timeout waiting for service worker response'));
      }, 5000);

      messageChannel.port1.onmessage = (event) => {
        console.log('Received response from Service Worker:', event.data);
        clearTimeout(timeoutId);
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data);
        }
      };
    });

    // Send the message with the port
    const message = {
      type: 'SHOW_NOTIFICATION',
      title,
      body,
      data,
    };
    console.log('Sending notification message to Service Worker:', message);

    registration.active.postMessage(message, [messageChannel.port2]);

    // Wait for the response
    await responsePromise;
    console.log('Successfully showed notification');
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};

const fetchAndSendSunTimes = async () => {
  try {
    const { latitude, longitude } = await getUserLocation();
    const { sunrise, sunset } = await getSunriseSunset(latitude, longitude);

    const sunriseTimestamp = new Date(sunrise).getTime();
    const sunsetTimestamp = new Date(sunset).getTime();

    await sendTimesToServiceWorker(sunriseTimestamp, sunsetTimestamp);
  } catch (error) {
    console.error('Error fetching or sending sun times:', error);
  }
};

// Call this function daily or when the app initializes
useEffect(() => {
  fetchAndSendSunTimes();
  const interval = setInterval(fetchAndSendSunTimes, 24 * 60 * 60 * 1000); // Every 24 hours

  return () => clearInterval(interval);
}, []);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [sunTimes, setSunTimes] = useState<SunTimes>({ sunrise: '', sunset: '' });
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  // Initialize session settings
  let sessionSettings: SessionSettings = {
    sandhyaTime: 'pratah',
    learningMode: 'perform',
    chantingSpeed: 'slow',
    vocalPitch: 'deep',
    language: 'english',
    duration: 0,
    lessons: [],
    loops: {
      gayatriCount: 10,
      ashtakshariCount: 28,
      panchakshariCount: 54,
      pranayamaCount: 3,
    },
  };

  // Function to build lessons array with current settings
  const buildLessonsArray = (settings: SessionSettings): Lesson[] => {
    console.log('settings', settings);
    const lessons: Lesson[] = [];
    lessons.push(VISHNU_SMARANA);
    return lessons;
  };

  const lessons = buildLessonsArray(sessionSettings);

  sessionSettings.lessons = lessons;
  sessionSettings.duration = calculateTotalDuration({ ...sessionSettings, lessons });

  console.log('sessionSettings', sessionSettings);

  // const handleLearnNowClick = () => {
  //   navigate('/review-settings');
  // };

  const handleSandhyaSessionClick = () => {
    showNotification('Sandhya Session Started', 'Your sandhya session has begun. May your practice be blessed! 🙏', {
      type: 'session_start',
    });
    navigate('/player', { state: { sessionSettings } });
  };

  // Function to fetch location and sunrise/sunset data
  const fetchSunriseSunsetData = async () => {
    try {
      const { latitude, longitude } = await getUserLocation();
      setLocation({ latitude, longitude });

      const { sunrise, sunset } = await getSunriseSunset(latitude, longitude);

      const sunriseTimestamp = new Date(sunrise).getTime();
      const sunsetTimestamp = new Date(sunset).getTime();

      setSunTimes({
        sunrise: new Date(sunriseTimestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
        sunset: new Date(sunsetTimestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Ensure service worker is registered before sending messages
        await sendTimesToServiceWorker(sunriseTimestamp, sunsetTimestamp);
      }
    } catch (error) {
      console.error('Error fetching location or sun times:', error);
    }
  };

  // Update useEffect to register service worker and initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registration successful:', registration);

        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;
        console.log('Service Worker is ready');

        // Check permissions and fetch data
        const notificationPermission = localStorage.getItem('notificationPermission');
        const locationPermission = localStorage.getItem('locationPermission');
        const lastRequestedAt = localStorage.getItem('permissionsLastRequestedAt');

        if (notificationPermission === 'granted' && locationPermission === 'granted') {
          fetchSunriseSunsetData();
          return;
        }

        // If permissions were never requested, show dialog
        if (!lastRequestedAt) {
          setShowPermissionDialog(true);
          return;
        }

        // Check if a week has passed since last request
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const lastRequested = new Date(lastRequestedAt).getTime();
        const now = new Date().getTime();

        if (now - lastRequested > oneWeek) {
          setShowPermissionDialog(true);
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    initializeApp();
  }, []);

  const requestPermissions = async () => {
    try {
      // Request notifications permission
      const notificationResult = await Notification.requestPermission();
      localStorage.setItem('notificationPermission', notificationResult);

      // Request location permission
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        localStorage.setItem('locationPermission', 'granted');
      } catch (error) {
        console.log('Location permission denied or error:', error);
        localStorage.setItem('locationPermission', 'denied');
      }

      // Store the timestamp of when permissions were requested
      localStorage.setItem('permissionsLastRequestedAt', new Date().toISOString());
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const handlePermissionAccept = () => {
    setShowPermissionDialog(false);
    requestPermissions();
  };

  const handlePermissionClose = () => {
    setShowPermissionDialog(false);
    localStorage.setItem('permissionsLastRequestedAt', new Date().toISOString());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <PermissionDialog isOpen={showPermissionDialog} onClose={handlePermissionClose} onAccept={handlePermissionAccept} />
      <div
        className="w-full h-full max-w-lg relative"
        style={{
          background: '#532C16',
          backgroundImage: `url(${backgroundpattern})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {/* Header */}
        <Block className="bg-[#6F3F24] text-white flex items-center space-x-2 shadow-md">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <h1 className="text-lg font-bold">Sandhya Time</h1>
        </Block>

        {/* Location and Time Details */}
        <Block className=" bg-[#451F10] text-white shadow-md">
          <Block className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold">Today</p>
              <p className="text-sm">
                {sunTimes.sunrise || '--'} / {new Date().toLocaleDateString()}
              </p>
            </div>
            <button className="text-sm bg-[#6F3F24] text-white px-2 py-1 rounded shadow-md">Change</button>
          </Block>
          <p className="text-sm mt-2">
            {location
              ? `Latitude: ${location.latitude.toFixed(4)}, Longitude: ${location.longitude.toFixed(4)}`
              : 'Fetching location...'}
          </p>
        </Block>

        {/* Sunrise and Sunset Cards */}
        <Block className="p-4 space-y-4">
          {/* Sunrise Card */}
          <Block className="bg-[#8B0000] text-white rounded-lg shadow-md p-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{sunTimes.sunrise ? sunTimes.sunrise : 'Fetching...'}</h2>
              <p className="text-sm">Sunrise</p>
            </div>
            <button className="bg-white text-[#8B0000] px-4 py-2 rounded-lg shadow" onClick={handleSandhyaSessionClick}>
              Start
            </button>
          </Block>

          {/* Sunset Card */}
          <Block className="bg-[#00008B] text-white rounded-lg shadow-md p-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{sunTimes.sunset ? sunTimes.sunset : 'Fetching...'}</h2>
              <p className="text-sm">Sunset</p>
            </div>
            <button className="bg-white text-[#00008B] px-4 py-2 rounded-lg shadow opacity-50 cursor-not-allowed">Start</button>
          </Block>
        </Block>
      </div>
    </div>
  );
};

export default Dashboard;
