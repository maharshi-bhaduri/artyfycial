import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async function () {
  try {
    const res = await signInWithPopup(auth, provider);
    localStorage.setItem("token", res._tokenResponse.idToken);
    localStorage.setItem("uid", res.user.uid);

  } catch (error) {
    console.log(error);
  }
};

const signOutFn = function () {
  localStorage.clear();
  signOut(auth)
    .then(() => {
      console.log("User has been signed out");
    })
    .catch((error) => {
      console.log(error);
    });
};

export { auth, provider, onAuthStateChanged, signOutFn, signInWithGoogle };
