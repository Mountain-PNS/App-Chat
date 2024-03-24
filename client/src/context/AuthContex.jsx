import React, { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";
export const AuthContex = createContext();
const AuthContexProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLaoding, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isloginLaoding, setIsLoginLaoding] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("User");
    try {
      const userData = JSON.parse(data);
      setUser(userData);
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
    }
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  });
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  });
  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);

      const response = await postRequest(
        `${baseUrl}/register`,
        JSON.stringify(registerInfo)
      );
      setIsRegisterLoading(false);
      if (response.error) {
        return setRegisterError(response);
      }
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoginLaoding(true);
      setLoginError(null);

      const response = await postRequest(
        `${baseUrl}/login`,
        JSON.stringify(loginInfo)
      );
      setIsLoginLaoding(false);
      if (response.error) {
        return setLoginError(response);
      }
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );
  
  const logoutUser = () => {
    localStorage.removeItem("User");
    setUser(null);
  }
  return (
    <AuthContex.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLaoding,
        logoutUser,
        loginUser,
        isloginLaoding,
        loginError,
        updateLoginInfo,
        loginInfo,
      }}
    >
      {children}
    </AuthContex.Provider>
  );
};

export default AuthContexProvider;
