// firebase.config.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // or other Firebase services you need

const firebaseConfig = {
  // Your Firebase config here
  // apiKey: "AIzaSyCBGCFIsALglEyiTOIFlpWwXideceEKXzs",
  // authDomain: "sandhya-6f6ea.firebaseapp.com",
  // projectId: "sandhya-6f6ea",
  // storageBucket: "sandhya-6f6ea.appspot.com",
  // messagingSenderId: "293822012627",
  // appId: "1:293822012627:web:66839302edb11f45800826",

  apiKey: "AIzaSyBxzNd3LAXXxJ_oJRZKfU3BHXFqXsFGQPg",
  authDomain: "its-sandhya-time.firebaseapp.com",
  projectId: "its-sandhya-time",
  storageBucket: "its-sandhya-time.firebasestorage.app",
  messagingSenderId: "784497595233",
  appId: "1:784497595233:web:933f84e15530428a4d6b20",
  measurementId: "G-0R8YD4QL3M"

};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth(); 
export default firebase;