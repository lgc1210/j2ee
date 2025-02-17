import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const Auth = ({ children }) => {
  const [user, setUser] = useState({});
  const [pendingLogin, setPendingLogin] = useState(false);
  const [pendingRegister, setPendingRegister] = useState(false);

  const login = async (payload) => {};

  const register = async (payload) => {};

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
