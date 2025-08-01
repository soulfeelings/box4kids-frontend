import React, { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AppInterface } from "./pages/AppInterface";
import { LoadingComponent } from "./components/common/LoadingComponent";
import { ErrorComponent } from "./components/common/ErrorComponent";
import { RouteGuard } from "./components/common/RouteGuard";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthContainer } from "./components/layout/AuthContainer";
import { useStore } from "./store/store";
import { ROUTES } from "./constants/routes";
import './i18n';
import { useTranslation } from 'react-i18next';

// Импорт компонентов шагов авторизации
import { OtpStep } from "./components/auth/otp/OtpStep";
import { SuccessStep } from "./components/auth/SuccessStep";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DataGuard } from "./components/common/DataGuard";
import { ChildrenPage } from "./pages/ChildrenPage";
import { ProfilePage } from "./pages/ProfilePage";
import { EditChildPage } from "./pages/EditChildPage";
import { EditDeliveryInfoPage } from "./pages/EditDeliveryInfoPage";
import { AdminPage } from "./pages/AdminPage";
import { CancelSubscriptionPage } from "./pages/CancelSubscriptionPage";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

// Основное приложение с роутингом
const AppWithRoutes: React.FC = () => {
  const { i18n, t } = useTranslation();
  return (
    <>
      <LanguageSwitcher />
      <BrowserRouter>
        <Routes>
          {/* Авторизация - компоненты напрямую с AuthContainer */}
          <Route
            path={ROUTES.AUTH.OTP}
            element={
              <AuthContainer>
                <OtpStep />
              </AuthContainer>
            }
          />

          {/* Новый объединенный роут для онбординга */}
          <Route
            path={ROUTES.AUTH.ONBOARDING}
            element={
              <RouteGuard>
                <DataGuard>
                  <OnboardingPage />
                </DataGuard>
              </RouteGuard>
            }
          />

          <Route
            path={ROUTES.AUTH.SUCCESS}
            element={
              <RouteGuard>
                <SuccessStep />
              </RouteGuard>
            }
          />

          {/* Приложение - защищенные маршруты */}
          <Route
            path={ROUTES.APP.ROOT}
            element={
              <RouteGuard>
                <DataGuard>
                  <AppLayout />
                </DataGuard>
              </RouteGuard>
            }
          >
            <Route index element={<AppInterface />} />
            <Route path={ROUTES.APP.CHILDREN} element={<ChildrenPage />} />
            <Route path={ROUTES.APP.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.APP.EDIT_CHILD} element={<EditChildPage />} />
            <Route
              path={ROUTES.APP.EDIT_DELIVERY}
              element={<EditDeliveryInfoPage />}
            />
            <Route
              path={ROUTES.APP.CANCEL_SUBSCRIPTION}
              element={<CancelSubscriptionPage />}
            />
          </Route>

          {/* Админка */}
          <Route path={ROUTES.ADMIN} element={<AdminPage />} />

          {/* Fallback - перенаправление на регистрацию */}
          <Route
            path={ROUTES.HOME}
            element={
              <RouteGuard>
                <InitialPage />
              </RouteGuard>
            }
          />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
              fontFamily: "Nunito, sans-serif",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </BrowserRouter>
    </>
  );
};

function InitialPage() {
  const ref = useRef(false);
  const { isInitDataLoading, initDataError, fetchInitData, user } = useStore();

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      fetchInitData();
    }
  }, [fetchInitData]);

  if (isInitDataLoading || !ref.current) {
    return <LoadingComponent type="onboarding" />;
  }

  if (initDataError) {
    return <ErrorComponent errorMessage={initDataError} />;
  }

  // Если есть имя значит юзер уже открывал онбординг и каким то образом ушел с него, мы больше ему его не показываем
  if (user?.name) {
    return <Navigate to={ROUTES.APP.ROOT} replace />;
  }

  return <Navigate to={ROUTES.AUTH.ONBOARDING} replace />;
}

// Создаем QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 минут
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWithRoutes />
    </QueryClientProvider>
  );
}

export default App;
