import { 
  Block, 
  Button, 
  Page, 
  Navbar, 
  Link, 
  Radio, 
  List, 
  ListItem,
  Segmented,
  SegmentedButton,
  Toolbar
} from "konsta/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SessionSettings } from '../types/SessionSettings';
import { Lesson } from '../types/Lesson';
import { getLessonByCode } from "../data/mockLessons";
import { calculateTotalDuration, formatTime } from '../utils/durationCalculator';


function ReviewSessionSetting() {
  const navigate = useNavigate();
  
  // Initialize session settings state
  const [sessionSettings, setSessionSettings] = useState<SessionSettings>({
    sandhyaTime: 'pratah',
    learningMode: 'repeat',
    chantingSpeed: 'regular',
    gayatriCount: 10,
    ashtakshariCount: 28,
    panchakshariCount: 54,
    vocalPitch: 'deep',
    duration: 0,
    language: 'english',
    lessons: []
  });

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

  // Update session settings and recalculate duration
  const updateSessionSettings = (updates: Partial<SessionSettings>) => {
    setSessionSettings(prevSettings => {
      const newSettings = { ...prevSettings, ...updates };
      const lessons = buildLessonsArray(newSettings);
      const estimatedDuration = calculateTotalDuration({ ...newSettings, lessons });
      
      return {
        ...newSettings,
        lessons,
        estimatedDuration
      };
    });
  };

  // Setting update handlers
  const setLearningMode = (mode: SessionSettings['learningMode']) => 
    updateSessionSettings({ learningMode: mode });
  
  const setChantingSpeed = (speed: SessionSettings['chantingSpeed']) => 
    updateSessionSettings({ chantingSpeed: speed });
  
  const setGayatriCount = (count: number) => 
    updateSessionSettings({ gayatriCount: count });
  
  const setAshtakshariCount = (count: number) => 
    updateSessionSettings({ ashtakshariCount: count });
  
  const setPanchakshariCount = (count: number) => 
    updateSessionSettings({ panchakshariCount: count });
  
  const setVocalPitch = (pitch: SessionSettings['vocalPitch']) => 
    updateSessionSettings({ vocalPitch: pitch });

  // Initialize lessons and duration
  useEffect(() => {
    updateSessionSettings({});
  }, []);

  const handleStartSession = () => {
    navigate('/sandhya-player', { state: { sessionSettings } });
  };

  return (
    <Page className="flex flex-col h-screen">
      <Navbar
        centerTitle
        title="Session Settings"
        left={<Link navbar onClick={() => navigate('/dashboard')}>back</Link>}
      />
      
      {/* Scrollable content */}
      <Block className="flex-1 overflow-auto my-0">
        {/* Learning Mode */}
        <Block strong inset className="space-y-4">
          <div className="text-lg font-semibold">Learning Mode</div>
          <List>
            <ListItem
              title="Repeat Mode"
              media={
                <Radio
                  checked={sessionSettings.learningMode === 'repeat'}
                  onChange={() => setLearningMode('repeat')}
                />
              }
            />
            <ListItem
              title="Perform Mode"
              media={
                <Radio
                  checked={sessionSettings.learningMode === 'perform'}
                  onChange={() => setLearningMode('perform')}
                />
              }
            />
          </List>
        </Block>

        {/* Chanting Speed */}
        <Block strong inset className="space-y-4">
          <div className="text-lg font-semibold">Chanting Speed</div>
          <List>
            <ListItem
              title="Slow Speed"
              media={
                <Radio
                  checked={sessionSettings.chantingSpeed === 'slow'}
                  onChange={() => setChantingSpeed('slow')}
                />
              }
            />
            <ListItem
              title="Regular Speed"
              media={
                <Radio
                  checked={sessionSettings.chantingSpeed === 'regular'}
                  onChange={() => setChantingSpeed('regular')}
                />
              }
            />
            <ListItem
              title="Fast Speed"
              media={
                <Radio
                  checked={sessionSettings.chantingSpeed === 'fast'}
                  onChange={() => setChantingSpeed('fast')}
                />
              }
            />
          </List>
        </Block>

        {/* Chant Counts */}
        <Block strong inset className="space-y-4">
          <div className="text-lg font-semibold">Chant Counts</div>
          
          {/* Gayatri Count */}
          <div className="space-y-2">
            <div className="font-medium">Gayatri</div>
            <Segmented>
              {[10, 28, 54, 108].map((count) => (
                <SegmentedButton
                  key={count}
                  active={sessionSettings.gayatriCount === count}
                  onClick={() => setGayatriCount(count)}
                >
                  {count}
                </SegmentedButton>
              ))}
            </Segmented>
          </div>

          {/* Ashtakshari Count */}
          <div className="space-y-2">
            <div className="font-medium">Ashtakshari</div>
            <Segmented>
              {[28, 54, 108, 216].map((count) => (
                <SegmentedButton
                  key={count}
                  active={sessionSettings.ashtakshariCount === count}
                  onClick={() => setAshtakshariCount(count)}
                >
                  {count}
                </SegmentedButton>
              ))}
            </Segmented>
          </div>

          {/* Panchakshari Count */}
          <div className="space-y-2">
            <div className="font-medium">Panchakshari</div>
            <Segmented>
              {[54, 108, 216, 512].map((count) => (
                <SegmentedButton
                  key={count}
                  active={sessionSettings.panchakshariCount === count}
                  onClick={() => setPanchakshariCount(count)}
                >
                  {count}
                </SegmentedButton>
              ))}
            </Segmented>
          </div>
        </Block>

        {/* Vocal Pitch */}
        <Block strong inset className="space-y-4">
          <div className="text-lg font-semibold">Vocal Pitch</div>
          <List>
            <ListItem
              title="Deep Voice (Adult Male)"
              media={
                <Radio
                  checked={sessionSettings.vocalPitch === 'deep'}
                  onChange={() => setVocalPitch('deep')}
                />
              }
            />
            <ListItem
              title="Sharp Voice (Non Adult Male)"
              media={
                <Radio
                  checked={sessionSettings.vocalPitch === 'sharp'}
                  onChange={() => setVocalPitch('sharp')}
                />
              }
            />
          </List>
        </Block>
      </Block>

      {/* Bottom Toolbar */}
      <Toolbar className="bg-white">
        <Block className="w-full p-4 flex justify-between items-center">
          <span className="text-lg font-bold">{formatTime(sessionSettings.duration)}</span>
          <Button onClick={handleStartSession} className="w-1/2">
            Start Session
          </Button>
        </Block>
      </Toolbar>
    </Page>
  );
}

export default ReviewSessionSetting; 