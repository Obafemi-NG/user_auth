import { createContext, useState, useEffect } from "react";

const INITIAL_STATE = {
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
};
const authContext = createContext(INITIAL_STATE);
let logoutTimer;

const calculateExpirationTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredData = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationTime = localStorage.getItem("expirationTime");

  const durationLeft = calculateExpirationTime(storedExpirationTime);
  if (durationLeft <= 60000) {
    localStorage.removeItem("item");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: durationLeft,
  };
};

export const AuthContextProvider = (props) => {
  const retrievedData = retrieveStoredData();
  let initialTokenValue;
  if (retrievedData) {
    initialTokenValue = retrievedData.token;
  }
  const [token, setToken] = useState(initialTokenValue);

  const userIsLoggedIn = !!token;

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  };

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateExpirationTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (retrievedData) {
      logoutTimer = setTimeout(logoutHandler, retrievedData.duration);
    }
  }, [retrievedData]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <authContext.Provider value={contextValue}>
      {props.children}
    </authContext.Provider>
  );
};

export default authContext;
