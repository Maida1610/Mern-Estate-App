// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-b67ce.firebaseapp.com",
  projectId: "real-estate-b67ce",
  storageBucket: "real-estate-b67ce.appspot.com",
  messagingSenderId: "491643145193",
  appId: "1:491643145193:web:aedbcafd6022ff6ff29978"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);