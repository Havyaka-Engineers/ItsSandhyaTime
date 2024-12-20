import { Timestamp } from "firebase/firestore";

export type Language = "english" | "kannada" | "sanskrit";
export type VocalPitch = "deep" | "sharp";

export interface UserPreferences {
  language: Language;
  vocalPitch: VocalPitch;
}

export interface UserProfile {
  email: string;
  fullName: string;
  gotra: string;
  preferences: UserPreferences;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastLoginAt?: Timestamp;
  onboardingCompleted?: boolean;
}
