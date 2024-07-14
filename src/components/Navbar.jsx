import React, { useState, useEffect, useContext } from "react";
import {
  auth,
  signInWithGoogle,
  signOutFn,
  onAuthStateChanged,
} from "../utils/Firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../utils/AuthContextProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false); // Close navbar on navigation
  };

  const signOutFnWrapper = (event) => {
    event.preventDefault();
    signOutFn();
    navigate("/");
    setIsOpen(false); // Close navbar on sign out
  };

  const navigateAccountHandler = (event) => {
    event.preventDefault();
    navigate("/account");
    setIsOpen(false); // Close navbar on navigation
  };

  const signInFnWrapper = (event) => {
    event.preventDefault();
    signInWithGoogle();
    setIsOpen(false); // Close navbar on sign in
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 right-4 z-20 p-2 bg-gray-700 text-white rounded"
        onClick={toggleNavbar}
      >
        Menu
      </button>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={closeNavbar}></div>}
      <nav className={`border-r border-gray-300 py-4 fixed h-full flex flex-col items-start z-20 bg-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="px-4 flex flex-col justify-start items-start w-full">
          <div className="flex justify-between w-full">
            <div className="text-gray-700 text-3xl font-serif px-2 py-4 cursor-pointer hover:text-black"
              onClick={() => navigate("/discover")}>
              Artyfycial
            </div>
            <button
              className="md:hidden p-2 text-gray-700 hover:text-gray-900"
              onClick={closeNavbar}
            >
              Close
            </button>
          </div>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-400 px-2 py-2 transition-all duration-300"
            onClick={handleNavigation}
          >
            {location.pathname === "/discover" ? "Create" : "Discover"}
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-400 px-2 py-2 transition-all duration-300"
            onClick={navigateAccountHandler}
          >
            Account
          </a>
          {isSignedIn ? (
            <a
              href="#"
              className="text-gray-700 hover:text-gray-400 px-2 py-2 transition-all duration-300"
              onClick={signOutFnWrapper}
            >
              Sign Out
            </a>
          ) : (
            <a
              href="#"
              className="text-gray-700 hover:text-gray-400 px-2 py-2 transition-all duration-300"
              onClick={signInFnWrapper}
            >
              Sign In
            </a>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
