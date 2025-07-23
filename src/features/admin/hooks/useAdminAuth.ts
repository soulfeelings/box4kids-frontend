import { useState } from "react";
import { adminLogin } from "../api/adminApi";
import { AdminLoginRequest, AdminLoginResponse } from "../types";

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("adminToken")
  );

  const login = async (credentials: AdminLoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AdminLoginResponse = await adminLogin(credentials);
      setToken(response.access_token);
      localStorage.setItem("adminToken", response.access_token);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка авторизации");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
  };

  const isAuthenticated = !!token;

  return {
    login,
    logout,
    isAuthenticated,
    isLoading,
    error,
    token,
  };
};
