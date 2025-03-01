import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../../Services/auth";
import UserService from "../../Services/user";
import paths from "../../Constants/paths";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../Components/Toast";
import { jwtDecode } from "jwt-decode";
import { getStoredToken, isEmpty, storeTokens } from "../../Utils/validation";

const AuthContext = createContext();

const Auth = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [isPendingLogin, setIsPendingLogin] = useState(false);
  const [isPendingRegister, setIsPendingRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      setToken(storedToken);
      const decoded = jwtDecode(storedToken);
      setUser({ email: decoded.sub, role: decoded.role });
    }
    return () => {};
  }, []);

  const login = async (payload) => {
    try {
      setIsPendingLogin(true);
      const response = await AuthService.login(payload);
      if (response.status === 200) {
        showToast("Login successfully");
        const token = response?.data?.token;
        storeTokens(token);
        const decoded = jwtDecode(token);
        navigate(decoded.role === 2 ? paths.home : paths.dashboard);
        setUser({ email: decoded.sub, role: decoded.role });
        setToken(token);
      }
    } catch (error) {
      if (error.response?.status === 404)
        showToast("Account does not exist", "error");
      else if (error.response?.status === 401)
        showToast("Password is incorrect", "error");
      else {
        showToast("Internal Server Error", "error");
        console.log("Error occurs while registering:", error);
      }
    } finally {
      setIsPendingLogin(false);
    }
  };

  const register = async (payload) => {
    try {
      setIsPendingRegister(true);
      const response = await UserService.create(payload);
      if (response.status === 201) {
        showToast("Register successfully");
        navigate(paths.login);
      }
    } catch (error) {
      if (error.response?.status === 409)
        showToast("Email or phone was registered", "error");

      showToast("Internal Server Error", "error");
      console.log("Error occurs while registering:", error);
    } finally {
      setIsPendingRegister(false);
    }
  };

  const logout = async () => {};

  const isAuthenticated = () => {
    if (isEmpty(token)) return false;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isPendingLogin,
        isPendingRegister,
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
