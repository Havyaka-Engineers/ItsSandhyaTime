import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserSettings {
  gotra?: string;
  // Add other user settings as needed
}

interface UserSettingsContextType {
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const UserSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userSettings, setUserSettings] = useState<UserSettings>({});

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings((prev) => ({ ...prev, ...settings }));
  };

  return <UserSettingsContext.Provider value={{ userSettings, updateUserSettings }}>{children}</UserSettingsContext.Provider>;
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};
