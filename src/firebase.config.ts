// src/firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig as prodConfig } from './firebase.config.prod';
import { firebaseConfig as devConfig } from './firebase.config.dev';

const firebaseConfig = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
