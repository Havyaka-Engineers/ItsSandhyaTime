import { Block, Button } from "konsta/react";
import { useNavigate } from "react-router-dom";
import SignOutButton from "../components/SignOutButton";
import { SessionSettings } from '../types/SessionSettings';
import { Lesson } from '../types/Lesson';
import { getLessonByCode } from "../data/mockLessons";
import { calculateTotalDuration } from '../utils/durationCalculator';

function Dashboard() {
  const navigate = useNavigate();

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
    lessons: []
  };

  // Function to build lessons array with current settings
  const buildLessonsArray = (settings: SessionSettings): Lesson[] => {
    const lessons: Lesson[] = [];
    
      lessons.push(getLessonByCode('ACHAMANAM'));
      lessons.push(getLessonByCode('BHASMADHARANAM'));
      lessons.push(settings.sandhyaTime === 'pratah' ? 
        getLessonByCode('SANKALPA_PRATAH') : 
        getLessonByCode('SANKALPA_SAYAM')
      );
      lessons.push(getLessonByCode('MARJANAM1'));
      lessons.push(settings.sandhyaTime === 'pratah' ? 
        getLessonByCode('MARJANAM2_PRATAH') : 
        getLessonByCode('MARJANAM2_SAYAM')
      );
      lessons.push(getLessonByCode('MARJANAM3'));
      lessons.push({...getLessonByCode('GAYATRI_JAPA'), loopCount: settings.gayatriCount});
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
  sessionSettings.duration = calculateTotalDuration({...sessionSettings, lessons});

  console.log("sessionSettings", sessionSettings);
  
  // const handleLearnNowClick = () => {
  //   navigate('/review-settings');
  // };

  const handleSandhyaSessionClick = () => {
    navigate('/sandhya-session', { state: { sessionSettings } });
  };

  return (
    <Block>
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