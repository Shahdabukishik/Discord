import { useMemo, useState } from "react";

import { AuthContext } from "./AuthContextCore";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = ({ user: nextUser, token: nextToken }) => {
    localStorage.setItem("user", JSON.stringify(nextUser));
    localStorage.setItem("token", nextToken);
    setUser(nextUser);
    setToken(nextToken);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token && user), login, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
