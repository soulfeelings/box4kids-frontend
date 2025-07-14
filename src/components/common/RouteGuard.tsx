import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { ROUTES } from "../../constants/routes";

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated } = useStore();

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.AUTH.OTP} replace />;
  }

  return <>{children}</>;
};
