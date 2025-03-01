import React, { createContext, useContext, useState } from "react";
import UserService from "../../Services/user";
import paths from "../../Constants/paths";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../Components/Toast";

const AuthContext = createContext();

const Auth = ({ children }) => {
  const [user, setUser] = useState({});
  const [pendingLogin, setPendingLogin] = useState(false);
  const [pendingRegister, setPendingRegister] = useState(false);
  const navigate = useNavigate();

  const login = async (payload) => {};

  const register = async (payload) => {
    try {
      const response = await UserService.create(payload);
      if (response.status === 201) {
        showToast("Registered successfully");
        navigate(paths.login);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        showToast("Email or phone existed", "error");
      }
      showToast("Internal Server Error", "error");
      console.log("Error occurs while registering:", error);
    }
  };

  const logout = async (payload) => {};

  const isAuthenticated = () => {
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        pendingLogin,
        pendingRegister,
        login,
        register,
        logout,
        isAuthenticated,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default Auth;
