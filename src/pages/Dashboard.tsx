import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Block } from 'konsta/react';
import { SessionSettings } from '../types/SessionSettings';
import { Lesson } from '../types/Lesson';
import { calculateTotalDuration } from '../utils/durationCalculator';
import PermissionDialog from '../components/PermissionDialog';
import logo from '../assets/SandhyaTime-Logo.svg';
import backgroundpattern from '../assets/background-pattern2.svg';
import sunrise from '../assets/sunrise.svg';
import sunset from '../assets/sunset.svg';
import start_button from '../assets/start_button.svg';
import SignOutButton from '../components/SignOutButton';
import { VISHNU_SMARANA } from '../data/lessons/VISHNU_SMARANA';
import { ACHAMANA } from '../data/lessons/ACHAMANA';
import { BHASMADHARANE } from '../data/lessons/BHASMADHARANE';
import { SANKALPA_PRATAH } from '../data/lessons/SANKALPA_PRATAH';
import { SANKALPA_SAYAM } from '../data/lessons/SANKALPA_SAYAM';
import { MANTRACHAMANA_PRATAH } from '../data/lessons/MANTRACHAMANA_PRATAH';
import { MARJANA } from '../data/lessons/MARJANA';
import { MANTRACHAMANA_SAYAM } from '../data/lessons/MANTRACHAMANA_SAYAM';
import { PUNAR_MARJANA } from '../data/lessons/PUNAR_MARJANA';
import { ARGHYA_PRATAH } from '../data/lessons/ARGHYA_PRATAH';
import { ARGHYA_SAYAM } from '../data/lessons/ARGHYA_SAYAM';
import { GAYATRI_JAPA } from '../data/lessons/GAYATRI_JAPA';
import { ABHIVADANA_VASISHTA } from '../data/lessons/ABHIVADANA_VASISHTA';
import { ABHIVADANA_VISHWAMITRA } from '../data/lessons/ABHIVADANA_VISHWAMITRA';
import { ASHTAKSHARI_PANCHAKSHARI_KARMA_SAMARPANAM } from '../data/lessons/ASHTAKSHARI_PANCHAKSHARI_KARMA_SAMARPANAM';
import { DVIRACHAMANA } from '../data/lessons/DVIRACHAMANA';
import { PANCHAKSHARI_JAPA } from '../data/lessons/PANCHAKSHARI_JAPA';
import { ASHTAKSHARI_JAPA } from '../data/lessons/ASHTAKSHARI_JAPA';
import { ASHTAKSHAI_PANCHAKSHARI_SANKALPA } from '../data/lessons/ASHTAKSHAI_PANCHAKSHARI_SANKALPA';
import { SANDHYA_KARMA_SAMARPANAM_SAYAM } from '../data/lessons/SANDHYA_KARMA_SAMARPANAM_SAYAM';
import { SANDHYA_KARMA_SAMARPANAM_PRATAH } from '../data/lessons/SANDHYA_KARMA_SAMARPANAM_PRATAH';
import { ABHIVADANA_JAMADAGNI } from '../data/lessons/ABHIVADANA_JAMADAGNI';
import { ABHIVADANA_GOUTAMA } from '../data/lessons/ABHIVADANA_GOUTAMA';
import { ABHIVADANA_BHARADWAJA } from '../data/lessons/ABHIVADANA_BHARADWAJA';
import { ABHIVADANA_KASHYAPA } from '../data/lessons/ABHIVADANA_KASHYAPA';
import { ABHIVADANA_ANGEERASA } from '../data/lessons/ABHIVADANA_ANGEERASA';
import { useUserSettings } from '../contexts/UserSettingsContext';
import { Dialog } from 'konsta/react';

// Define types
type Location = {
  latitude: number;
  longitude: number;
  city: string;
  stateCode: string;
  country: string;
};

type SunTimes = {
  sunrise: string;
  sunset: string;
};

// Function to get user's location using hardcoded values
const getUserLocation = async (): Promise<Location> => {
  console.warn('Using hardcoded location: Bangalore, KA, India');
  return {
    latitude: 12.9716,
    longitude: 77.5946,
    city: 'Bangalore',
    stateCode: 'KA',
    country: 'India',
  };
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

// const showNotification = async (title: string, body: string, data: any = {}) => {
//   try {
//     // Wait for service worker registration
//     const registration = await navigator.serviceWorker.ready;
//     console.log('Service Worker ready state:', {
//       active: !!registration.active,
//       installing: !!registration.installing,
//       waiting: !!registration.waiting,
//     });

//     if (!registration.active) {
//       throw new Error('Service Worker is not active');
//     }

//     // Create a message channel
//     const messageChannel = new MessageChannel();

//     // Create a promise to wait for the response
//     const responsePromise = new Promise((resolve, reject) => {
//       const timeoutId = setTimeout(() => {
//         messageChannel.port1.onmessage = null;
//         reject(new Error('Timeout waiting for service worker response'));
//       }, 5000);

//       messageChannel.port1.onmessage = (event) => {
//         console.log('Received response from Service Worker:', event.data);
//         clearTimeout(timeoutId);
//         if (event.data.error) {
//           reject(new Error(event.data.error));
//         } else {
//           resolve(event.data);
//         }
//       };
//     });

//     // Send the message with the port
//     const message = {
//       type: 'SHOW_NOTIFICATION',
//       title,
//       body,
//       data,
//     };
//     console.log('Sending notification message to Service Worker:', message);

//     registration.active.postMessage(message, [messageChannel.port2]);

//     // Wait for the response
//     await responsePromise;
//     console.log('Successfully showed notification');
//   } catch (error) {
//     console.error('Error showing notification:', error);
//   }
// };

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

const Dashboard: React.FC = () => {
  // const navigate = useNavigate();
  const { userSettings } = useUserSettings();
  const [location, setLocation] = useState<Location | null>(null);
  const [sunTimes, setSunTimes] = useState<SunTimes>({ sunrise: '', sunset: '' });
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  // const redirect = true;

  // console.log('VITE_NODE_ENV:', import.meta.env.VITE_NODE_ENV);

  // useEffect(() => {
  //   if (import.meta.env.VITE_NODE_ENV === 'production') {
  //     navigate('/landing', { replace: true });
  //   }
  // }, [navigate]);

  // if (import.meta.env.NODE_ENV === 'production' && redirect) {
  //   console.log('Rendering redirect message...');
  //   return <p>Redirecting...</p>;
  // }

  // Call this function daily or when the app initializes
  useEffect(() => {
    fetchAndSendSunTimes();
    const interval = setInterval(fetchAndSendSunTimes, 24 * 60 * 60 * 1000); // Every 24 hours

    return () => clearInterval(interval);
  }, []);

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
    lessons.push(ACHAMANA);
    lessons.push(BHASMADHARANE);
    lessons.push(settings.sandhyaTime === 'pratah' ? SANKALPA_PRATAH : SANKALPA_SAYAM);
    lessons.push(MARJANA);
    lessons.push(settings.sandhyaTime === 'pratah' ? MANTRACHAMANA_PRATAH : MANTRACHAMANA_SAYAM);
    lessons.push(PUNAR_MARJANA);
    lessons.push(settings.sandhyaTime === 'pratah' ? ARGHYA_PRATAH : ARGHYA_SAYAM);
    lessons.push(GAYATRI_JAPA);

    // Add the appropriate ABHIVADANA lesson based on gotra
    switch (userSettings?.gotra?.toLowerCase()) {
      case 'kashyapa':
        lessons.push(ABHIVADANA_KASHYAPA);
        break;
      case 'vasishta':
        lessons.push(ABHIVADANA_VASISHTA);
        break;
      case 'vishwamitra':
        lessons.push(ABHIVADANA_VISHWAMITRA);
        break;
      case 'bharadwaja':
        lessons.push(ABHIVADANA_BHARADWAJA);
        break;
      case 'goutama':
        lessons.push(ABHIVADANA_GOUTAMA);
        break;
      case 'angeerasa':
        lessons.push(ABHIVADANA_ANGEERASA);
        break;
      case 'jamadagni':
        lessons.push(ABHIVADANA_JAMADAGNI);
        break;
      default:
        // If no gotra is set or it's unknown, default to Kashyapa
        // You might want to handle this differently based on your requirements
        lessons.push(ABHIVADANA_KASHYAPA);
        break;
    }

    lessons.push(settings.sandhyaTime === 'pratah' ? SANDHYA_KARMA_SAMARPANAM_PRATAH : SANDHYA_KARMA_SAMARPANAM_SAYAM);
    lessons.push(ASHTAKSHAI_PANCHAKSHARI_SANKALPA);
    lessons.push(ASHTAKSHARI_JAPA);
    lessons.push(PANCHAKSHARI_JAPA);
    lessons.push(ASHTAKSHARI_PANCHAKSHARI_KARMA_SAMARPANAM);
    lessons.push(DVIRACHAMANA);
    return lessons;
  };

  const lessons = buildLessonsArray(sessionSettings);

  sessionSettings.lessons = lessons;
  sessionSettings.duration = calculateTotalDuration({ ...sessionSettings, lessons });

  console.log('sessionSettings', sessionSettings);

  // const handleLearnNowClick = () => {
  //   navigate('/review-settings');
  // };

  // const handleSandhyaSessionClick = () => {
  //   showNotification('Sandhya Session Started', 'Your sandhya session has begun. May your practice be blessed! 🙏', {
  //     type: 'session_start',
  //   });
  //   navigate('/player', { state: { sessionSettings } });
  // };

  // Function to fetch location and sunrise/sunset data
  const fetchSunriseSunsetData = async () => {
    try {
      const { latitude, longitude } = await getUserLocation();
      setLocation({ latitude, longitude, city: 'Bangalore', stateCode: 'KA', country: 'India' });

      const { sunrise, sunset } = await getSunriseSunset(latitude, longitude);
      const sunriseTimestamp = new Date(sunrise).getTime();
      const sunsetTimestamp = new Date(sunset).getTime();

      setSunTimes({
        sunrise: new Date(sunriseTimestamp)
          .toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Ensures 12-hour format with AM/PM
          })
          .toUpperCase(),
        sunset: new Date(sunsetTimestamp)
          .toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Ensures 12-hour format with AM/PM
          })
          .toUpperCase(),
      });

      // Only check notification permission if we need to send notifications
      const notificationPermission = await Notification.requestPermission();
      if (notificationPermission === 'granted') {
        await sendTimesToServiceWorker(sunriseTimestamp, sunsetTimestamp);
      }
    } catch (error) {
      console.error('Error fetching location or sun times:', error);
      setSunTimes({ sunrise: 'Error fetching', sunset: 'Error fetching' });
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
        const lastRequestedAt = localStorage.getItem('permissionsLastRequestedAt');

        // Always fetch data since we're using hardcoded location
        fetchSunriseSunsetData();

        // Show permission dialog for notifications if needed
        if (!lastRequestedAt || !notificationPermission) {
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
      // try {
      //   await new Promise((resolve, reject) => {
      //     navigator.geolocation.getCurrentPosition(resolve, reject);
      //   });
      //   localStorage.setItem('locationPermission', 'granted');
      // } catch (error) {
      //   console.log('Location permission denied or error:', error);
      //   localStorage.setItem('locationPermission', 'denied');
      // }

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

  console.log(location, 'Location');
  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <PermissionDialog isOpen={showPermissionDialog} onClose={handlePermissionClose} onAccept={handlePermissionAccept} />
      <div
        className="w-full h-full max-w-lg relative "
        style={{
          background: '#532C16',
          backgroundImage: `url(${backgroundpattern})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div className="bg-[#6F3F24] text-white flex items-center justify-between shadow-md p-4">
          <img src={logo} alt="Logo" className="w-12 h-12 ml-4" />
          <h1 className="text-lg font-bold font-otomanopee" style={{ fontFamily: 'Otomanopee' }}>
            It's Sandhya Time!
          </h1>
          <div>{''}</div>
          <SignOutButton />
        </div>

        {/* Location and Time Details */}
        <div className=" bg-[#602F14] text-white shadow-md">
          <div className="flex justify-between items-center p-4">
            {/* <p className="text-sm font-semibold">Today</p> */}
            <div>{''}</div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm">
                {sunTimes.sunrise || '--'} /{' '}
                {new Date().toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  weekday: 'long',
                })}
              </p>
              <p className="text-sm mt-2 text-[#A47B64]">
                {location ? (
                  <>
                    {/* {location.city}, {location.stateCode}, {location.country} */}
                    Bangalore, KA
                  </>
                ) : (
                  ''
                )}
              </p>
            </div>
            {/* <button className="text-sm bg-[#6F3F24] text-white px-2 py-1 rounded shadow-md">Change</button> */}
            <div>{''}</div>
          </div>
        </div>

        {/* Sunrise and Sunset Cards */}
        <div className="flex flex-col item-center justify-center p-4 mt-15 space-y-10">
          {/* Sunrise Card */}
          <div className="bg-[#8B0000] text-white rounded-lg shadow-md p-6 flex flex-row items-center justify-between">
            <div>
              <img src={sunrise} alt="sunrise" className="w-30 h-auto" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{sunTimes.sunrise ? sunTimes.sunrise : 'Fetching...'}</h2>
              <p className="text-sm">Sunrise</p>
              <button
                className="bg-[#8A2C0D] text-[#8B0000] px-4 py-2 rounded-lg shadow mt-6"
                onClick={() => setIsStartDialogOpen(true)} // Open dialog
              >
                <img src={start_button} alt="Logo" className="w-15 h-auto" />
              </button>
            </div>
          </div>

          {/* Start Dialog */}
          {isStartDialogOpen && (
            <Dialog
              opened={isStartDialogOpen}
              onBackdropClick={() => setIsStartDialogOpen(false)} // Close dialog on backdrop click
              colors={{ bgIos: 'bg-white', bgMaterial: 'bg-white' }}
            >
              <div className="p-4 space-y-4">
                <p className="text-center text-gray-900">
                  "The interactive, guided learning of Sandhya Vandana feature will be available on 14-Jan-2025. Stay tuned!"
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setIsStartDialogOpen(false)} // Close dialog
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Ok
                  </button>
                </div>
              </div>
            </Dialog>
          )}

          {/* Sunset Card */}
          <div className="bg-[#00008B] text-white rounded-lg shadow-md p-6  flex flex-row items-center justify-between">
            <div>
              <img src={sunset} alt="sunset" className="w-30 h-auto" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{sunTimes.sunset ? sunTimes.sunset : 'Fetching...'}</h2>
              <p className="text-sm">Sunset</p>
              <button className="bg-white text-[#00008B] px-4 py-2 rounded-lg shadow opacity-50 cursor-not-allowed mt-6">
                <img src={start_button} alt="Logo" className="w-15 h-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
