import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { clearSessionToken } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser, clearUser] = useLocalStorage("carerx-user", null);

  const login = useCallback(
    (nextUser) => {
      setUser({
        _id: nextUser._id,
        email: nextUser.email,
        name: nextUser.name,
        createdAt: nextUser.createdAt,
      });
    },
    [setUser]
  );

  const logout = useCallback(() => {
    clearSessionToken();
    clearUser();
  }, [clearUser]);

  const value = useMemo(
    () => ({
      user: user && typeof user === "object" ? user : null,
      isAuthenticated: Boolean(user && user.email),
      login,
      logout,
    }),
    [user, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
