import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [modal, setModal] = useState(false);
  useEffect(() => {
    const storedAuthData = localStorage.getItem("authData");
    if (storedAuthData) {
      const parsedAuthData = JSON.parse(storedAuthData);
      setAuth(parsedAuthData);
    }
  }, []);

  useEffect(() => {
    console.log("Auth state changed:", auth);
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, modal, setModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
