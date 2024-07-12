import React, { useState, useEffect, useContext } from "react";
import {
  auth,
  provider,
  signInWithGoogle,
  signOutFn,
  onAuthStateChanged,
} from "../utils/Firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../utils/AuthContextProvider";
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const user = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });

    return () => unsubscribe();
  }, [user]);

  const handleNavigation = (event) => {
    event.preventDefault();
    if (location.pathname === "/discover") {
      navigate("/create");
    } else {
      navigate("/discover");
    }
  };

  const signOutFnWrapper = (event) => {
    event.preventDefault();
    signOutFn();
    navigate("/");
  };

  const navigateAccountHandler = (event) => {
    event.preventDefault();
    navigate("/account");
  };

  const signInFnWrapper = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };
  return (
    <nav className="border-b border-gray-300 py-4 w-full fixed h-12 flex items-center z-10">
      <div className="px-4 flex justify-between items-center w-full">
        <div className="text-gray-700 text-3xl font-serif px-2 cursor-pointer hover:text-black"
          onClick={() => navigate("/discover")}>
          Artyfycial
        </div>
        <div className="flex">
          <a
            href="#"
            className="text-gray-700 hover:text-gray-400 px-2 transition-all duration-300"
            onClick={handleNavigation}
          >
            {location.pathname === "/discover" ? "Create" : "Discover"}
          </a>
          {/* <Link onClick={handleNavigation}>
            {location.pathname === "/discover" ? "Create" : "Discover"}
          </Link> */}
          <a
            href="#"
            className="text-gray-700 hover:text-gray-400 px-2 transition-all duration-300"
            onClick={navigateAccountHandler}
          >
            Account
          </a>
          {isSignedIn ? (
            <a
              href="#"
              className="text-gray-700 hover:text-gray-400 px-2 transition-all duration-300"
              onClick={signOutFnWrapper}
            >
              Sign Out
            </a>
          ) : (
            <a
              href="#"
              className="text-gray-700 hover:text-gray-400 px-2 transition-all duration-300"
              onClick={signInFnWrapper}
            >
              Sign In
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
