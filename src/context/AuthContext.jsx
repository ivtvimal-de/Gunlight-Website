import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      setAuthLoading(true);
      const res = await api.getAdminMe();
      setAdmin(res?.admin || null);
    } catch {
      setAdmin(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (email, password) => {
    const res = await api.adminLogin({ email, password });
    setAdmin(res?.admin || null);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.adminLogout();
    } finally {
      setAdmin(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: Boolean(admin),
        authLoading,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
