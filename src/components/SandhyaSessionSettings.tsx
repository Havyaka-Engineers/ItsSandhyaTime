import { Sheet, List, ListItem, Navbar, Button, Block } from "konsta/react";
import { SessionSettings } from '../types/SessionSettings';
import { 
  Speed as SpeedIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  RecordVoiceOver as VoiceIcon,
  Numbers as CountIcon,
} from '@mui/icons-material';
import { formatTime } from '../utils/durationCalculator';
import { useState } from 'react';
import SandhyaSettingEditor from './SandhyaSettingEditor';
import { calculateTotalDuration } from '../utils/durationCalculator';

interface SandhyaSessionSettingsProps {
  opened: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
  sessionSettings: SessionSettings;
  onSettingsChange: (settings: SessionSettings) => void;
}

function SandhyaSessionSettings({ 
  opened, 
  onClose, 
  onSettingsClick, 
  sessionSettings,
  onSettingsChange 
}: SandhyaSessionSettingsProps) {
  const [currentEditor, setCurrentEditor] = useState<string | null>(null);
  const [localSettings, setLocalSettings] = useState<SessionSettings>(sessionSettings);

  const handleDone = () => {
    onSettingsChange(localSettings);
    onClose();
    onSettingsClick();
  };

  const handleLocalSettingChange = (changes: Partial<SessionSettings>) => {
    setLocalSettings(prev => {
      const newSettings = {
        ...prev,
        ...changes
      };
      
      // Recalculate duration using the existing calculator
      const duration = calculateTotalDuration(newSettings);
      
      return {
        ...newSettings,
        duration
      };
    });
  };

  const speedOptions = [
    { value: 'slow', label: 'Slow' },
    { value: 'regular', label: 'Regular' },
    { value: 'fast', label: 'Fast' },
  ];

  const learningModeOptions = [
    { value: 'repeat', label: 'Repeat Mode' },
    { value: 'perform', label: 'Perform Mode' },
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'kannada', label: 'Kannada' },
  ];

  const vocalPitchOptions = [
    { value: 'deep', label: 'Deep' },
    { value: 'sharp', label: 'Sharp' },
  ];

  const japaCountOptions = [
    { value: '10', label: '10 times' },
    { value: '28', label: '28 times' },
    { value: '54', label: '54 times' },
    { value: '108', label: '108 times' },
    { value: '256', label: '256 times' },
  ];

  // Create filtered options lists for both Ashtakshari and Panchakshari
  const filteredAshtakshariOptions = japaCountOptions.filter(option => 
    parseInt(option.value) >= localSettings.gayatriCount
  );

  const filteredPanchakshariOptions = japaCountOptions.filter(option => 
    parseInt(option.value) >= localSettings.ashtakshariCount
  );

  return (
    <>
      <Sheet
        className="pb-safe !w-[calc(100%-16px)] mx-2 rounded-t-xl"
        opened={opened}
        onBackdropClick={onClose}
      >
        <Navbar
          centerTitle
          title="Settings"
          subtitle="Adjust your settings to your liking"
        />

        <List nested dividers outline>
          <ListItem
            title="Chanting Speed"
            after={localSettings.chantingSpeed}
            link
            onClick={() => setCurrentEditor('speed')}
            media={<SpeedIcon className="text-primary-600" />}
          />
          <ListItem
            title="Learning Mode"
            after={localSettings.learningMode}
            link
            onClick={() => setCurrentEditor('mode')}
            media={<SchoolIcon className="text-primary-600" />}
          />
          <ListItem
            title="Language"
            after={localSettings.language}
            link  
            onClick={() => setCurrentEditor('language')}
            media={<LanguageIcon className="text-primary-600" />}
          />
          <ListItem
            title="Voice Type"
            after={localSettings.vocalPitch}
            link
            onClick={() => setCurrentEditor('voice')}
            media={<VoiceIcon className="text-primary-600" />}
          />
          <ListItem
            title="Gayatri Japa Count"
            after={`${localSettings.gayatriCount}`}
            link
            onClick={() => setCurrentEditor('gayatri')}
            media={<CountIcon className="text-primary-600" />}
          />
          <ListItem
            title="Ashtakshari Japa Count"
            after={`${localSettings.ashtakshariCount}`}
            link
            onClick={() => setCurrentEditor('ashtakshari')}
            media={<CountIcon className="text-primary-600" />}
          />
          <ListItem
            title="Panchakshari Japa Count"
            after={`${localSettings.panchakshariCount}`}
            link
            onClick={() => setCurrentEditor('panchakshari')}
            media={<CountIcon className="text-primary-600" />}
          />
        </List>

        <Block className="!mt-4 text-center text-gray-500" strong>
          Session Duration: <span className="font-bold text-lg text-primary-600">
            {formatTime(localSettings.duration)}
          </span> min
        </Block>

        <Block className="!mt-4 !mb-4">
          <Button 
            large
            rounded
            onClick={handleDone}
            className="w-full bg-primary-600 hover:bg-primary-700"
          >
            Done
          </Button>
        </Block>
      </Sheet>

      <SandhyaSettingEditor
        opened={currentEditor === 'speed'}
        onClose={() => setCurrentEditor(null)}
        title="Chanting Speed"
        subtitle="Select your preferred chanting speed"
        options={speedOptions}
        value={localSettings.chantingSpeed}
        onSelect={(value) => {
          handleLocalSettingChange({ 
            chantingSpeed: value as 'slow' | 'regular' | 'fast'
          });
          setCurrentEditor(null);
        }}
      />

      <SandhyaSettingEditor
        opened={currentEditor === 'mode'}
        onClose={() => setCurrentEditor(null)}
        title="Learning Mode"
        subtitle="Select your preferred learning mode"
        options={learningModeOptions}
        value={localSettings.learningMode}
        onSelect={(value) => {
          handleLocalSettingChange({ 
            learningMode: value as 'repeat' | 'perform'
          });
          setCurrentEditor(null);
        }}
      />

      <SandhyaSettingEditor
        opened={currentEditor === 'language'}
        onClose={() => setCurrentEditor(null)}
        title="Language"
        subtitle="Select your preferred language"
        options={languageOptions}
        value={localSettings.language}
        onSelect={(value) => {
          handleLocalSettingChange({ 
            language: value as 'english' | 'kannada'
          });
          setCurrentEditor(null);
        }}
      />

      <SandhyaSettingEditor
        opened={currentEditor === 'voice'}
        onClose={() => setCurrentEditor(null)}
        title="Voice Type"
        subtitle="Select your preferred voice type"
        options={vocalPitchOptions}
        value={localSettings.vocalPitch}
        onSelect={(value) => {
          handleLocalSettingChange({ 
            vocalPitch: value as 'deep' | 'sharp'
          });
          setCurrentEditor(null);
        }}
      />

      <SandhyaSettingEditor
        opened={currentEditor === 'gayatri'}
        onClose={() => setCurrentEditor(null)}
        title="Gayatri Japa Count"
        subtitle="Select number of repetitions"
        options={japaCountOptions}
        value={localSettings.gayatriCount.toString()}
        onSelect={(value: string | number) => {
          const newGayatriCount = parseInt(value.toString());
          const changes: Partial<SessionSettings> = {
            gayatriCount: newGayatriCount
          };
          
          // If Ashtakshari count becomes invalid, increase it
          if (localSettings.ashtakshariCount < newGayatriCount) {
            changes.ashtakshariCount = newGayatriCount;
            
            // If Panchakshari count becomes invalid due to Ashtakshari adjustment,
            // increase it as well
            if (localSettings.panchakshariCount < newGayatriCount) {
              changes.panchakshariCount = newGayatriCount;
            }
          }
          
          handleLocalSettingChange(changes);
          setCurrentEditor(null);
        }}
      />

      <SandhyaSettingEditor
        opened={currentEditor === 'ashtakshari'}
        onClose={() => setCurrentEditor(null)}
        title="Ashtakshari Japa Count"
        subtitle="Select number of repetitions"
        options={filteredAshtakshariOptions}
        value={localSettings.ashtakshariCount.toString()}
        onSelect={(value: string | number) => {
          const newAshtakshariCount = parseInt(value.toString());
          const changes: Partial<SessionSettings> = {
            ashtakshariCount: newAshtakshariCount
          };
          
          // If Panchakshari count becomes invalid, increase it
          if (localSettings.panchakshariCount < newAshtakshariCount) {
            changes.panchakshariCount = newAshtakshariCount;
          }
          
          handleLocalSettingChange(changes);
          setCurrentEditor(null);
        }}
      />

      <SandhyaSettingEditor
        opened={currentEditor === 'panchakshari'}
        onClose={() => setCurrentEditor(null)}
        title="Panchakshari Japa Count"
        subtitle="Select number of repetitions"
        options={filteredPanchakshariOptions}
        value={localSettings.panchakshariCount.toString()}
        onSelect={(value: string | number) => {
          handleLocalSettingChange({ 
            panchakshariCount: parseInt(value.toString())
          });
          setCurrentEditor(null);
        }}
      />
    </>
  );
}

export default SandhyaSessionSettings; 