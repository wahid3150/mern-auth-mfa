import { createContext, useContext, useEffect, useState } from "react";
import api from "../apiIntercepter";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  async function fetchUser() {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/user/me`);

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ setIsAuth, isAuth, user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AppData = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("AppData must be used within an AuthProvider");
  return context;
};
