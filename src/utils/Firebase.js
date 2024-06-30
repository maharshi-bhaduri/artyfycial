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
    console.log(res);
    localStorage.setItem("token", res._tokenResponse.idToken);
    localStorage.setItem("uid", res.user.uid);

    // // Prepare data for the API call
    // const userData = {
    //   uid: res.user.uid,
    //   firstName: res.user.displayName.split(' ')[0],
    //   lastName: res.user.displayName.split(' ').slice(1).join(' '),
    // };

    // // Make the PUT API call
    // const apiResponse = await axios.post(import.meta.env.VITE_APP_ADD_USER, userData);
    // if (apiResponse.status != 200) {
    //   console.log(apiResponse.status);
    //   signOutFn();
    // }
    // localStorage.setItem("userId", apiResponse.data.userId);

  } catch (error) {
    console.log(error);
  }
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

export { auth, provider, onAuthStateChanged, signOutFn, signInWithGoogle };
