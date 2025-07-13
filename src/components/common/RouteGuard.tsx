import React from "react";
import { Navigate } from "react-router-dom";
import { useRegistrationStore } from "../../store/registrationStore";
import { ROUTES } from "../../constants/routes";

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated } = useRegistrationStore();

  // Проверяем завершенную регистрацию
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.PHONE} replace />;
  }

  return <>{children}</>;
};
