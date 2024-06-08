import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getIdToken,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = function () {
  signInWithPopup(auth, provider)
    .then((res) => {
      console.log(res);
      localStorage.setItem("token", res._tokenResponse.idToken);
      localStorage.setItem("uid", res.user.uid);
    })
    .catch((error) => {
      console.log(error);
    });
};

const signOutFn = function () {
  signOut(auth)
    .then(() => {
      localStorage.clear();
      console.log("signed out");
    })
    .catch((error) => {
      console.log(error);
    });
};

export {
  auth,
  provider,
  onAuthStateChanged,
  signOutFn,
  signInWithGoogle,
  getIdToken,
};
