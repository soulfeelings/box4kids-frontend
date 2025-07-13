import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserData } from "../types";

interface AuthContextType {
  user: UserData | null;
  userId: number | null;
  setUser: (user: UserData, userId: number) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<UserData | null>(null);
  const [userId, setUserIdState] = useState<number | null>(null);

  const setUser = (userData: UserData, userIdParam: number) => {
    setUserState(userData);
    setUserIdState(userIdParam);
  };

  const logout = () => {
    setUserState(null);
    setUserIdState(null);
  };

  const isAuthenticated = userId !== null;

  const value: AuthContextType = {
    user,
    userId,
    setUser,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
