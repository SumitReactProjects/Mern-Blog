// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-8edf1.firebaseapp.com",
  projectId: "mern-blog-8edf1",
  storageBucket: "mern-blog-8edf1.appspot.com",
  messagingSenderId: "384039081339",
  appId: "1:384039081339:web:cce48f201fbd6bd4f499de",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
