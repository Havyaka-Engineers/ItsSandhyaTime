import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Block } from 'konsta/react';
import { SessionSettings } from '../types/SessionSettings';
import { Lesson } from '../types/Lesson';
import { getLessonByCode } from '../data/mockLessons';
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [sunTimes, setSunTimes] = useState<SunTimes>({ sunrise: '', sunset: '' });
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  // Initialize session settings state
  let sessionSettings: SessionSettings = {
    sandhyaTime: 'pratah',
    learningMode: 'repeat',
    chantingSpeed: 'slow',
    gayatriCount: 10,
    ashtakshariCount: 28,
    panchakshariCount: 54,
    vocalPitch: 'deep',
    language: 'english',
    duration: 0,
    lessons: [],
  };

  // Function to build lessons array with current settings
  const buildLessonsArray = (settings: SessionSettings): Lesson[] => {
    const lessons: Lesson[] = [];

    lessons.push(getLessonByCode('ACHAMANAM'));
    lessons.push(getLessonByCode('BHASMADHARANAM'));
    lessons.push(settings.sandhyaTime === 'pratah' ? getLessonByCode('SANKALPA_PRATAH') : getLessonByCode('SANKALPA_SAYAM'));
    lessons.push(getLessonByCode('MARJANAM1'));
    lessons.push(settings.sandhyaTime === 'pratah' ? getLessonByCode('MARJANAM2_PRATAH') : getLessonByCode('MARJANAM2_SAYAM'));
    lessons.push(getLessonByCode('MARJANAM3'));
    lessons.push({ ...getLessonByCode('GAYATRI_JAPA'), loopCount: settings.gayatriCount });
    // lessons.push(settings.learningMode === 'repeat' ?
    //   getLessonByCode('PRANAYAMA_REPEAT') :
    //   getLessonByCode('PRANAYAMA_PERFORM')
    // );
    // lessons.push(settings.sandhyaTime === 'pratah' ?
    //   getLessonByCode('ARGHYA_PRADANAM_PRATAH') :
    //   getLessonByCode('ARGHYA_PRADANAM_SAYAM')
    // );
    // lessons.push(getLessonByCode('GAYATRI_SANKALPA'));
    // lessons.push({...getLessonByCode('GAYATRI_JAPA'), loopCount: settings.gayatriCount});
    // lessons.push(getLessonByCode('SANDHYA_UPASTHANAM'));
    // lessons.push(getLessonByCode('GOTRA_PRAVARA'));
    // lessons.push(getLessonByCode('GAYATRI_JAPA_SAMARPANAM'));
    // lessons.push(getLessonByCode('ASHTAKSHARI_PANCHAKSHARI_SANKALPA'));
    // lessons.push({...getLessonByCode('ASHTAKSHARI_JAPA'), loopCount: settings.ashtakshariCount});
    // lessons.push({...getLessonByCode('PANCHAKSHARI_JAPA'), loopCount: settings.panchakshariCount});
    // lessons.push(getLessonByCode('ASHTAKSHARI_PANCHAKSHARI_JAPA_SAMARPANAM'));
    // lessons.push(getLessonByCode('PRAYASCHITTA'));

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
    navigate('/sandhya-session', { state: { sessionSettings } });
  };

  // Function to fetch location and sunrise/sunset data
  const fetchSunriseSunsetData = async () => {
    try {
      const { latitude, longitude } = await getUserLocation();
      setLocation({ latitude, longitude });

      const { sunrise, sunset } = await getSunriseSunset(latitude, longitude);
      setSunTimes({
        sunrise: new Date(sunrise).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
        sunset: new Date(sunset).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });
    } catch (error) {
      console.error('Error fetching location or sun times:', error);
    }
  };

  // Check permissions on mount
  useEffect(() => {
    const checkPermissions = () => {
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
    };

    checkPermissions();
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
