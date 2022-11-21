import React, { useState, useRef, useContext } from "react";
import axiosConfig from "../../util/axiosConfig.js";
import { SectionsContext } from "../../context/sectionsContext";
import { Navigate, NavLink } from "react-router-dom";
import "./LoginForm.css";

function LoginForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth, setIsAuth, eventLogin } = useContext(SectionsContext);

  const formEl = useRef(null);
  const usernameEL = useRef(null);
  const passwordEl = useRef(null);

  const handleSuccessfulLogin = (respData) => {
    setIsAuth(true);
    localStorage.setItem("userName", respData.userName);
    localStorage.setItem("userId", respData.userId);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = {
      userName: usernameEL.current.value,
      password: passwordEl.current.value,
    };
    try {
      setIsLoading(true);
      const axiosResp = await axiosConfig.post("/user/login", data);
      console.debug("axiosResp.data", axiosResp.data);
      setIsLoading(false);

      if (axiosResp.data.error) {
        setError(axiosResp.data.error.message);
        return;
      }
      setError(""); // Falls wir zuvor einen Fehler hatten, wird dieser entfernt
      handleSuccessfulLogin(axiosResp.data);
    } catch (error) {
      console.error("Error while sending with axios", error);
      setError(error);
      return;
    }

    formEl.current.reset(); // Alle Felder vom Formular leer machen
  };

  return (
    <div>
      {isAuth && eventLogin && <Navigate to="/event-form" replace={true} />}
      {isAuth && !eventLogin ? (
        <Navigate to="/profile" replace={true} />
      ) : (
        <form ref={formEl} method="post" onSubmit={submitHandler}>
          <h2>Login</h2>
          <label htmlFor="username"> Nutzername:</label>
          <input type="text" name="username" id="username" ref={usernameEL} />
          <label htmlFor="password">Passwort:</label>
          <input
            type="password"
            name="password"
            id="password"
            ref={passwordEl}
          />
          <input id="button" type="submit" value="einloggen" />
        </form>
      )}
      <button id="button">
        <NavLink to={"/register"}>noch nicht registriert?</NavLink>
      </button>

      {error && <p>Da ist etwas schief gelaufen: {error}</p>}

      {isLoading && <p>Lade – bitte warten...</p>}
    </div>
  );
}

export default LoginForm;
