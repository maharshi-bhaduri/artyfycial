import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ImageGallery from "../components/ImageGallery";
import { auth, signInWithGoogle, onAuthStateChanged } from "../utils/Firebase";
import Navbar from "../components/Navbar";

export default function Home() {
  const [showBtn, setShowBtn] = useState(false);
  const [currTime, setCurrTime] = useState(null);
  const navigate = useNavigate();

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
        navigate("/discover"); // Redirect to the home page after login
      } else {
        console.log("User is not logged in");
        setShowBtn(false);
      }
    });
  }, [navigate]);

  return (
    <div className="w-full h-full p-8 flex justify-around">
      <div className="flex flex-col justify-center">
        <div className="text-4xl font-serif mb-4">Indulge in art.</div>
        <div className="text-4xl font-serif mb-4">
          Discover, Collect, Cherish.
        </div>
        <button
          className="my-8 px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
          onClick={signInWithGoogle}
        >
          Login
        </button>
      </div>
      <ImageGallery />
    </div>
  );
}
