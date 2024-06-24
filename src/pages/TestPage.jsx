import { useEffect, useState } from "react";

import ImageGallery from "../components/ImageGallery";
import {
  auth,
  provider,
  signInWithGoogle,
  signOutFn,
  onAuthStateChanged,
} from "../utils/Firebase";
import { getCurrenTime } from "../utils/utils";

export default function TestPage() {
  const [showBtn, setShowBtn] = useState(false);
  const [currTime, setCurrTime] = useState(null);

  const handleGetTime = async function () {
    const time = await getCurrenTime();
    setCurrTime(time);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(`User is logged in and their UID is ${uid}`);
        setShowBtn(true);
      } else {
        console.log("User is not logged in");
        setShowBtn(false);
      }
    });
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Artyfycial</h1>
      <div className="signInOut">
        <button id="signin" onClick={signInWithGoogle}>
          SignIn
        </button>
        <button id="signout" onClick={signOutFn}>
          SignOut
        </button>
      </div>
      <div className="box">
        <button onClick={handleGetTime}>Get Current Time</button>
        {currTime && <div className="time">{currTime}</div>}
      </div>

      <ImageGallery />
    </>
  );
}
