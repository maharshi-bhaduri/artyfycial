import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import {
  auth,
  provider,
  signInWithGoogle,
  signOutFn,
  onAuthStateChanged,
} from "./utils/Firebase";
function App() {
  const [showBtn, setShowBtn] = useState(false);
  let currTime;
  const getCurrenTime = async function () {
    const headers = {
      "Content-Type": "Aaplication/json",
      Authorization: localStorage.getItem("token"),
      uid: localStorage.getItem("uid"),
    };
    try {
      const response = await axios.get("http://localhost:3000/api/getTime", {
        headers: headers,
      });
      currTime = response.data.time;
      console.log(currTime);
    } catch (error) {
      console.log(error);

      return error.response.status;
    }
  };
  //const currTime = getCurrenTime();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(`user is logged in and his uid is ${uid}`);
        setShowBtn(true);
      } else {
        console.log("user is not logged in");
        setShowBtn(false);
      }
    });
  }, []);

  return (
    <>
      <div className="signInOut">
        <button id="signin" onClick={signInWithGoogle}>
          SignIn
        </button>
        <button id="signout" onClick={signOutFn}>
          SignOut
        </button>
      </div>
      {
        <div className="box">
          <button onClick={getCurrenTime}>Get Current Time</button>
          {currTime && <div className="time">{currTime}</div>}
        </div>
      }
    </>
  );
}

export default App;
