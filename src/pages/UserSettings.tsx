import { useState, useEffect } from 'react';
import { Block, Button, List, ListInput, Radio, ListItem } from 'konsta/react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config';
import { userService } from '../services/userService';
import { UserPreferences, VocalPitch } from '../types/UserProfile';
import backgroundPattern2 from '../assets/background-pattern2.svg';
import sandhyaTimeLogo from '../assets/SandhyaTime-Logo.svg';
import VoicePlay from '../assets/VoicePlay.svg';
import { gotras } from '../types/gotra';

function UserSettings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{
    email: string;
    fullName: string;
    gotra: string;
    preferences: UserPreferences;
  }>({
    email: '',
    fullName: '',
    gotra: 'Kashyapa',
    preferences: {
      language: 'english',
      vocalPitch: 'deep',
    },
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      // Set email from auth
      setProfile((prev) => ({
        ...prev,
        email: auth.currentUser?.email || '',
        fullName: auth.currentUser?.displayName || '',
      }));

      const userProfile = await userService.getUserProfile(userId);
      console.log(userProfile, 'USER PROFILE');
      if (userProfile) {
        setProfile((prev) => ({
          ...prev,
          fullName: userProfile.fullName.split(' ')[0],
          gotra: userProfile.gotra,
          preferences: userProfile.preferences,
        }));
      }
    };

    loadUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await userService.createOrUpdateUser(userId, profile);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="w-full h-full max-w-lg relative"
        style={{
          background: '#532C16',
          backgroundImage: `url(${backgroundPattern2})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {/* Logo Section */}
        <div className="flex justify-center items-center mt-10 relative z-10">
          <img src={sandhyaTimeLogo} alt="Sandhya Time Logo" className="w-32 h-auto" />
        </div>
        <Block style={{ margin: 0 }} className="relative z-10 p-6">
          <List strongIos insetIos style={{ margin: 0 }}>
            <div>
              <p className="text-white mb-2">Email</p>
              <ListInput
                outline
                // style={{ background: '#D1D5DB', height: 50, borderRadius: 10, padding: 0, color: '#6B7280',border:"none" }}
                placeholder="Enter email"
                type="email"
                value={profile.email}
                disabled
                readOnly
              />
              <p className="text-[#F3F4F6] mb-2 text-sm mt-2">Description</p>
            </div>
            <div className="mt-4">
              <p className="text-white mb-2">Name</p>
              <ListInput
                outline
                placeholder="Enter name"
                // style={{ background: '#fff', height: 50, borderRadius: 10, padding: 0, color: '#6B7280',border:"none" }}
                type="text"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
              />
              <p className="text-[#F3F4F6] mb-2 text-sm mt-2">Description</p>
            </div>
            <div className="mt-4">
              <p className="text-white mb-2">Your Gothra</p>
              <ListInput
                outline
                placeholder="select gothra"
                // style={{ background: '#fff', height: 50, borderRadius: 10, padding: 0, color: '#6B7280',border:"none" }}
                type="select"
                value={profile.gotra}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    gotra: e.target.value,
                  }))
                }
                className="bg-white text-black rounded-lg shadow-md border border-gray-300"
              >
                {gotras.map((gotra) => (
                  <option key={gotra} value={gotra} className="text-[#6B7280] bg-white">
                    {gotra}
                  </option>
                ))}
              </ListInput>
              <p className="text-[#F3F4F6] mb-2 text-sm mt-2">
                If you don't know the gothra, by default it will be set as Kashyapa gothra
              </p>
            </div>
            <div className="mt-10 w-full">
              <p className="text-white mb-2">Vocal Pitch</p>
              <div className="bg-[#fff] rounded-xl w-full px-2 py-2">
                <List strongIos outlineIos style={{ margin: 0 }}>
                  <div className="flex flex-row item-center justify-between">
                    <div>
                      <ListItem
                        label
                        title="Male Voice (Deep)"
                        style={{ color: 'black' }}
                        media={
                          <Radio
                            component="div"
                            value="deep"
                            checked={profile.preferences.vocalPitch === 'deep'}
                            onChange={() =>
                              setProfile((prev) => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  vocalPitch: 'deep' as VocalPitch,
                                },
                              }))
                            }
                          />
                        }
                      />
                      <div className="mb-2">
                        <p className="ml-14 text-sm text-[#6B7280]">Description</p>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <img src={VoicePlay} alt="voice-play" className="w-8 h-auto" />
                    </div>
                  </div>
                  <hr />
                  <div className="flex flex-row item-center justify-between">
                    <div>
                      <ListItem
                        label
                        title="Kid (Sharp Voice)"
                        style={{ color: 'black' }}
                        media={
                          <Radio
                            component="div"
                            value="sharp"
                            checked={profile.preferences.vocalPitch === 'sharp'}
                            onChange={() =>
                              setProfile((prev) => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  vocalPitch: 'sharp' as VocalPitch,
                                },
                              }))
                            }
                          />
                        }
                      />
                      <div className="mb-2">
                        <p className="ml-14 text-sm text-[#6B7280]">Description</p>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <img src={VoicePlay} alt="voice-play" className="w-8 h-auto" />
                    </div>
                  </div>
                </List>
              </div>
            </div>
          </List>

          <Block className="p-4">
            <Button large onClick={handleSave} style={{ background: '#B43403' }}>
              Save
            </Button>
          </Block>
        </Block>
      </div>
    </div>
  );
}

export default UserSettings;
