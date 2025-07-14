import React, { useEffect, useRef } from "react";
import { useStore } from "../../store/store";
import { LoadingComponent } from "./LoadingComponent";
import { ErrorComponent } from "./ErrorComponent";

interface DataGuardProps {
  children: React.ReactNode;
}

export const DataGuard: React.FC<DataGuardProps> = ({ children }) => {
  const ref = useRef(false);
  const { isInitDataLoading, initDataError, user, fetchInitData } = useStore();

  useEffect(() => {
    if (user) {
      return;
    }

    if (!ref.current) {
      ref.current = true;
      fetchInitData();
    }
  }, []);

  if (user) {
    return <>{children}</>;
  }

  if (isInitDataLoading || !ref.current) {
    return <LoadingComponent />;
  }

  if (initDataError) {
    return <ErrorComponent errorMessage={initDataError} />;
  }

  return <>{children}</>;
};
