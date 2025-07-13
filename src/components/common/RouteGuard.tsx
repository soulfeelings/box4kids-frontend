import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRegistrationStore } from "../../store/registrationStore";
import { ROUTES } from "../../constants/routes";

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { userId } = useRegistrationStore();

  // Проверяем либо глобальную авторизацию, либо завершенную регистрацию
  if (!isAuthenticated && !userId) {
    return <Navigate to={ROUTES.AUTH.PHONE} replace />;
  }

  return <>{children}</>;
};
