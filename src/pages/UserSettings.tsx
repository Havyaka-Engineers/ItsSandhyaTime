import { useState, useEffect, useRef } from "react";
import {
  Block,
  Button,
  List,
  ListInput,
  Radio,
  ListItem,
  Popover,
} from "konsta/react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
import { userService } from "../services/userService";
import { UserPreferences, VocalPitch } from "../types/UserProfile";

function UserSettings() {
  const navigate = useNavigate();
  const isGuestUser = !auth.currentUser?.email;

  const [profile, setProfile] = useState<{
    email: string;
    fullName: string;
    gotra: string;
    preferences: UserPreferences;
  }>({
    email: "",
    fullName: "",
    gotra: "Kashyapa",
    preferences: {
      vocalPitch: "deep",
      language: "english",
    },
  });

  const [gothraPopoverOpened, setGothraPopoverOpened] = useState(false);
  const popoverTargetRef = useRef(null);

  useEffect(() => {
    // Only set email and name for Google sign-in users
    if (!isGuestUser) {
      setProfile((prev) => ({
        ...prev,
        email: auth.currentUser?.email || "",
        fullName: auth.currentUser?.displayName || "",
      }));
    }
  }, [isGuestUser]);

  const handleSave = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await userService.createOrUpdateUser(userId, {
        ...profile,
        onboardingCompleted: true,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving user settings:", error);
    }
  };

  const gothraOptions = [
    "Agastya",
    "Angirasa",
    "Atri",
    "Bharadwaja",
    "Bhrigu",
    "Garga",
    "Harita",
    "Jamadagni",
    "Kanva",
    "Kashyapa",
    "Kaushika",
    "Kutsa",
    "Lohita",
    "Maitreya",
    "Mandavya",
    "Mudgala",
    "Nidruva",
    "Parashara",
    "Pulaha",
    "Pulastya",
    "Rishyasringa",
    "Sakti",
    "Sankhyayana",
    "Sankritya",
    "Shandilya",
    "Shounaka",
    "Upamanyu",
    "Vasishta",
    "Vasishtha",
    "Vatsa",
    "Vishnu",
    "Vishwamitra",
    "Yaska",
  ].sort();

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-gradient-to-br from-amber-900 to-amber-800 w-full h-full max-w-lg relative">
        <Block className="w-full h-full p-4">
          <div className="mb-8 text-center">
            <img
              src="../../public/logo.svg"
              alt="Sandhya Time"
              className="w-24 h-24 mx-auto mb-4"
            />
          </div>

          <List strongIos insetIos>
            {!isGuestUser && (
              <>
                <ListInput
                  label="Email"
                  type="email"
                  value={profile.email}
                  disabled
                  readOnly
                />

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
              </>
            )}

            <ListInput
              label="Your Gothra"
              type="text"
              value={profile.gotra}
              readOnly
              onClick={() => setGothraPopoverOpened(true)}
              className="text-white z-50"
              colors={{
                labelTextIos: "text-white",
                bgIos: "bg-gray-800",
              }}
            />

            <Popover
              opened={gothraPopoverOpened}
              angle={false}
              target={popoverTargetRef.current}
              onBackdropClick={() => setGothraPopoverOpened(false)}
              className="left-1/2 -translate-x-1/2 z-[9999]"
              colors={{
                bgMaterial: "bg-gray-800",
              }}
            >
              <List
                nested
                className="max-h-80 overflow-y-auto scrollbar-hide rounded-sm z-[9999]"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {gothraOptions.map((gothra) => (
                  <ListItem
                    key={gothra}
                    title={gothra}
                    link
                    className="text-white"
                    onClick={() => {
                      setProfile((prev) => ({
                        ...prev,
                        gotra: gothra,
                      }));
                      setGothraPopoverOpened(false);
                    }}
                  />
                ))}
              </List>
            </Popover>

            <div className="px-4 py-2 text-xs text-white/70">
              Default gothra is Kashyapa if unknown
            </div>

            <Block
              strong
              inset
              className="mt-4 flex flex-col gap-4 justify-between bg-red-500"
            >
              <p className="text-white">Select Voice</p>
              <List strongIos outlineIos>
                <ListItem
                  label
                  title="Male Voice"
                  className="text-white"
                  media={
                    <Radio
                      component="div"
                      value="deep"
                      checked={profile.preferences.vocalPitch === "deep"}
                      onChange={() =>
                        setProfile((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            vocalPitch: "deep" as VocalPitch,
                          },
                        }))
                      }
                    />
                  }
                />
                <ListItem
                  label
                  title="Child Voice"
                  media={
                    <Radio
                      component="div"
                      value="sharp"
                      checked={profile.preferences.vocalPitch === "sharp"}
                      onChange={() =>
                        setProfile((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            vocalPitch: "sharp" as VocalPitch,
                          },
                        }))
                      }
                    />
                  }
                />
              </List>
            </Block>
          </List>

          <div className="mt-8">
            <Button
              large
              onClick={handleSave}
              colors={{
                fillBgMaterial: "bg-orange-700",
                fillTextMaterial: "text-white",
                fillActiveBgMaterial: "active:bg-orange-800",
              }}
              className="w-full"
            >
              Save
            </Button>
          </div>
        </Block>
      </div>
    </div>
  );
}

export default UserSettings;
