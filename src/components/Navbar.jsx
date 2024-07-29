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
  const [selectedOption, setSelectedOption] = useState(location.pathname);
  const user = useContext(AuthContext);

  // navigation config
  const navConfig = [
    { name: "Discover", path: "/discover" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Studio", path: "/studio" },
    { name: "Auctions", path: "/auctions" },
    { name: "Account", path: "/account" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });

    return () => unsubscribe();
  }, [user]);

  const handleNavigation = (event, path) => {
    event.preventDefault();
    setSelectedOption(path);
    navigate(path);
    setIsOpen(false); // Close navbar on navigation
  };

  const signOutFnWrapper = (event) => {
    event.preventDefault();
    signOutFn();
    navigate("/");
    setIsOpen(false); // Close navbar on sign out
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

  const getLinkClass = (path) => {
    return selectedOption === path
      ? "bg-black text-white animate-background-slide w-full"
      : "";
  };

  return (
    <>
      <button
        className="md:hidden fixed bottom-4 right-4 z-20 py-2 px-3 bg-black text-white rounded-xl"
        onClick={toggleNavbar}
      >
        {isOpen ? "Close" : "Menu"}
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={closeNavbar}
        ></div>
      )}
      <nav
        className={`border-r border-gray-300 py-4 fixed h-full flex flex-col items-start z-20 bg-white transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col justify-start items-start w-full">
          <div className="flex justify-between w-full">
            <div
              className="text-gray-700 text-3xl font-serif px-4 mb-4 cursor-pointer hover:text-black"
              onClick={(event) => handleNavigation(event, "/discover")}
            >
              Artyfycial
            </div>
          </div>
          {navConfig.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`w-full text-gray-700 hover:text-gray-400 px-4 py-2 transition-all duration-300 ${getLinkClass(
                item.path
              )}`}
              onClick={(event) => handleNavigation(event, item.path)}
            >
              {item.name}
            </a>
          ))}
          {isSignedIn ? (
            <a
              href="#"
              className={`w-full text-gray-700 hover:text-gray-400 px-4 py-2 transition-all duration-300`}
              onClick={signOutFnWrapper}
            >
              Sign Out
            </a>
          ) : (
            <a
              href="#"
              className={`w-full text-gray-700 hover:text-gray-400 px-4 py-2 transition-all duration-300`}
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
