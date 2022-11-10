import React, { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { SectionsContext } from "../context/sectionsContext.js";
import LoginForm from "../components/LoginForm/LoginForm.js";
import axiosConfig from "./axiosConfig.js";
import UserProfil from "../components/UserProfile/UserProfile.jsx";

function AuthLogin() {
  const {isAuth, setIsAuth, setAllSectFalse, setIsHome} = useContext(SectionsContext);

  const handleSuccessfulLogin = (respData) => {
    setIsAuth(true);
    localStorage.setItem("userName", respData.userName);
  };

  const hasValidToken = () => {
    const cookieValue = Cookies.get("isLogged");
    console.log(cookieValue);
    if (!cookieValue) return false;
    const expireDate = decodeURIComponent(cookieValue);
    const expiresInMs = new Date(expireDate) - new Date();
    if (expiresInMs <= 0) return false;
    return true;
  };

  useEffect(() => {
    if (hasValidToken()) {
      setIsAuth(true);
    }
  }, [isAuth]);

  return (
    <div>
      {!isAuth ? (
        <LoginForm handleSuccessfulLogin={handleSuccessfulLogin} />
      ) : (
        <>
        <UserProfil />
        </>
      )}
    </div>
  );
}

export default AuthLogin;
