import { db } from '../firebase.config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '../types/UserProfile';

export const userService = {
  async createOrUpdateUser(userId: string, userData: Partial<UserProfile>) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // New user
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    } else {
      // Existing user
      await setDoc(
        userRef,
        {
          ...userData,
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        },
        { merge: true },
      );
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  },
};
