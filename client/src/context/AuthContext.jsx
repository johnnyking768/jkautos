import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jkautos_token"));
  const [loading, setLoading] = useState(Boolean(token));
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then(({ user: current }) => mounted && setUser(current))
      .catch(() => {
        localStorage.removeItem("jkautos_token");
        setToken(null);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [token]);

  const login = useCallback(
    async (payload) => {
      const data = await authService.login(payload);
      localStorage.setItem("jkautos_token", data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}`);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    },
    [navigate]
  );

  const register = useCallback(
    async (payload) => {
      const data = await authService.register(payload);
      localStorage.setItem("jkautos_token", data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success("Your JK Autos account is ready");
      navigate("/dashboard");
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("jkautos_token");
    setToken(null);
    setUser(null);
    navigate("/");
  }, [navigate]);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, isAdmin: user?.role === "admin" }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
