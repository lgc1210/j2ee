import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import AuthService from "../../Services/auth";
import paths from "../../Constants/paths";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../Components/Toast";
import { jwtDecode } from "jwt-decode";
import {
  clearTokens,
  getStoredToken,
  storeTokens,
} from "../../Utils/validation";
import { moveUserTo } from "../../Utils/moveUserTo";

const AuthContext = createContext();

const Auth = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isPendingLogin, setIsPendingLogin] = useState(false);
  const [isPendingRegister, setIsPendingRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          if (decoded.exp * 1000 > Date.now()) {
            setToken(storedToken);
            setUser({ email: decoded?.sub, role: decoded?.role });
          } else {
            clearTokens();
          }
        } catch (error) {
          clearTokens();
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (payload) => {
    try {
      setIsPendingLogin(true);
      const response = await AuthService.login(payload);
      if (response.status === 200) {
        showToast("Login successfully");
        const token = response.data;
        const decoded = jwtDecode(token);
        storeTokens(token);
        navigate(moveUserTo(decoded?.role));
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
      const response = await AuthService.register(payload);
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

  const logout = async () => {
    await AuthService.logout();
    showToast("Logged out successfully");
    clearTokens();
    navigate(paths.login);
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = useMemo(() => !!user, [user]);

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
