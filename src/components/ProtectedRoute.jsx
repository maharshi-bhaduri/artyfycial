import React, { useContext } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, onlyPublic = false, userId = null }) => {
    const user = localStorage.getItem("userId")
    const location = useLocation();
    const navigate = useNavigate();

    if (user && onlyPublic) {
        console.log("user present and only public")
        // Redirect to the discover page if the user is signed in and the route is only for public
        return <Navigate to="/discover" state={{ from: location }} />
    }

    if (!user && !onlyPublic) {
        console.log("user not present and only private")
        // Redirect to the login page if the user is not signed in and the route requires authentication
        return <Navigate to="/" state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;
