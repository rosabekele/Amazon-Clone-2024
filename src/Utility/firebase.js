// Import the functions from the SDKs
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXRzb2tY5dTm2N1hR8frUIHwqQY4gsAhY",
  authDomain: "clone-59cbb.firebaseapp.com",
  projectId: "clone-59cbb",
  storageBucket: "clone-59cbb.firebasestorage.app",
  messagingSenderId: "313211856426",
  appId: "1:313211856426:web:4282a93f9862a8fe6d4553",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth =getAuth(app)
export const db = getFirestore(app);

