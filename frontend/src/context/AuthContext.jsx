import { createContext, useContext, useEffect, useState } from "react";
import api from "../apiIntercepter";
import { toast } from "react-toastify";

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

  async function logoutUser(navigate) {
    try {
      const { data } = await api.post("/api/user/logout");
      toast.success(data.message);
      setIsAuth(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      toast.error("something went wrong");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ setIsAuth, isAuth, user, setUser, loading, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AppData = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("AppData must be used within an AuthProvider");
  return context;
};
