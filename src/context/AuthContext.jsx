import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import {
  DEMO_ADMIN,
  isDemoModeEnabled,
  enableDemoMode,
  disableDemoMode,
} from "../services/demoStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      setAuthLoading(true);
      if (isDemoModeEnabled()) {
        setAdmin({ ...DEMO_ADMIN });
        setIsDemoMode(true);
        return;
      }
      const res = await api.getAdminMe();
      setAdmin(res?.admin || null);
      setIsDemoMode(Boolean(res?.admin?.isDemo));
    } catch {
      setAdmin(null);
      setIsDemoMode(false);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const enterDemoMode = useCallback((email) => {
    const demoAdmin = enableDemoMode(email);
    setAdmin(demoAdmin);
    setIsDemoMode(true);
    return { admin: demoAdmin, demo: true };
  }, []);

  const login = useCallback(async (email, password) => {
<<<<<<< HEAD
    try {
      const res = await api.adminLogin({ email, password });
      setAdmin(res?.admin || null);
      setIsDemoMode(Boolean(res?.demo));
      return res;
    } catch (err) {
      if (err?.isBackendUnavailable) {
        const demoAdmin = enableDemoMode(email);
        setAdmin(demoAdmin);
        setIsDemoMode(true);
        return { admin: demoAdmin, demo: true };
      }
      throw err;
    }
=======
    const res = await api.adminLogin({ email, password });
    setAdmin(res?.admin || null);
    setIsDemoMode(false);
    return res;
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
  }, []);

  const logout = useCallback(async () => {
    try {
      if (!isDemoModeEnabled()) {
        await api.adminLogout();
      }
    } catch {
      // Ignore network/405 error when logging out cleanly
    } finally {
      disableDemoMode();
      setAdmin(null);
      setIsDemoMode(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: Boolean(admin),
        isDemoMode,
        authLoading,
        login,
        enterDemoMode,
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
