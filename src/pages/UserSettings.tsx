import { useState, useEffect } from 'react';
import { Block, Button, List, ListInput, Radio, ListItem } from 'konsta/react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config';
import { userService } from '../services/userService';
import { UserPreferences, VocalPitch } from '../types/UserProfile';
import backgroundPattern from '../assets/background-pattern.svg';
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
      if (userProfile) {
        setProfile((prev) => ({
          ...prev,
          fullName: userProfile.fullName,
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
          backgroundImage: `url(${backgroundPattern})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(83, 44, 22, 0.8)',
          }}
        ></div>
        <Block>
          <List strongIos insetIos>
            <ListInput label="Email" type="email" value={profile.email} disabled readOnly />

            <ListInput
              label="Full Name"
              type="text"
              value={profile.fullName}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
            />

            <ListInput
              label="Gotra"
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
                <option key={gotra} value={gotra} className="text-black bg-white">
                  {gotra}
                </option>
              ))}
            </ListInput>

            <Block strong inset>
              <p>Vocal Pitch</p>
              <List strongIos outlineIos>
                <ListItem
                  label
                  title="Deep Voice"
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
                <ListItem
                  label
                  title="Sharp Voice"
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
              </List>
            </Block>
          </List>

          <Block className="p-4">
            <Button large onClick={handleSave}>
              Save Settings
            </Button>
          </Block>
        </Block>
      </div>
    </div>
  );
}

export default UserSettings;
