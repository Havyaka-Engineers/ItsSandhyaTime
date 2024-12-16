// src/firebase.config.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firebaseConfig as prodConfig } from './firebase.config.prod';
import { firebaseConfig as devConfig } from './firebase.config.dev';

const firebaseConfig = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export default firebase;
