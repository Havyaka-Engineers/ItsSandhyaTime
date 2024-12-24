import { Block, Button } from 'konsta/react';
import { useNavigate } from 'react-router-dom';
import SignOutButton from '../components/SignOutButton';
import { SessionSettings } from '../types/SessionSettings';
import { Lesson } from '../types/Lesson';
import { getLessonByCode } from '../data/mockLessons';
import { calculateTotalDuration } from '../utils/durationCalculator';
import { useEffect, useState } from 'react';
import PermissionDialog from '../components/PermissionDialog';

function Dashboard() {
  const navigate = useNavigate();
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  // Initialize session settings state
  let sessionSettings: SessionSettings = {
    sandhyaTime: 'pratah',
    learningMode: 'perform',
    chantingSpeed: 'fast',
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
    navigate('/player', { state: { sessionSettings } });
  };

  useEffect(() => {
    const checkPermissions = () => {
      const notificationPermission = localStorage.getItem('notificationPermission');
      const locationPermission = localStorage.getItem('locationPermission');
      const lastRequestedAt = localStorage.getItem('permissionsLastRequestedAt');

      // If both permissions are granted, don't show dialog
      if (notificationPermission === 'granted' && locationPermission === 'granted') {
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
    <Block>
      <PermissionDialog isOpen={showPermissionDialog} onClose={handlePermissionClose} onAccept={handlePermissionAccept} />
      <p>Dashboard Page!</p>
      <Block className="space-y-4">
        {/* <Button onClick={handleLearnNowClick}>Learn Now!</Button> */}
        <Button onClick={handleSandhyaSessionClick}>Start Sandhya Session</Button>
        <SignOutButton />
      </Block>
    </Block>
  );
}

export default Dashboard;
