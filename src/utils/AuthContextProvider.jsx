import { createContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOutFn } from "./Firebase";
import Cookies from "js-cookie";
import { getAuth, onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

const getUserId = async function (user) {
  // Make the PUT API call
  const userData = {
    uid: user?.uid,
    firstName: user?.displayName.split(" ")[0],
    lastName: user?.displayName.split(" ").slice(1).join(" "),
  };
  const apiResponse = await axios.post(
    import.meta.env.VITE_APP_ADD_USER,
    userData
  );
  return apiResponse;
};

const AuthProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const allowedPaths = ["/"];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          Cookies.set("token", token);
          if (localStorage.getItem("userId") == null) {
            const userIdAPIresponse = getUserId(user).then(
              (userIdAPIresponse) => {
                console.log("userIdAPIresponse", userIdAPIresponse);

                if (userIdAPIresponse.status === 200) {
                  localStorage.setItem("userId", userIdAPIresponse.data.userId);
                  if (allowedPaths.includes(location.pathname)) {
                    navigate("/discover");
                  }
                } else {
                  signOutFn();
                }
                localStorage.setItem("displayName", user.displayName);
                setUser(user);
              }
            );
          }
          if (localStorage.getItem("userId") !== null) {
            if (allowedPaths.includes(location.pathname)) navigate("/discover");
          }
        });
      } else {
        if (!allowedPaths.includes(location.pathname)) {
          navigate("/");
        }
      }
    });

    return () => unsubscribe(); // Unsubscribe from the auth state changes when component unmounts
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
