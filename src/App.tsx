import React, { useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { DemoPage } from "./pages/DemoPage";
import { AppInterface } from "./pages/AppInterface";
// import { ProfilePage } from "./pages/ProfilePage";
// import { SupportPage } from "./pages/SupportPage";
// import { DeliveryHistoryPage } from "./pages/DeliveryHistoryPage";
import { LoadingComponent } from "./components/common/LoadingComponent";
import { ErrorComponent } from "./components/common/ErrorComponent";
import { RouteGuard } from "./components/common/RouteGuard";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthContainer } from "./components/layout/AuthContainer";
import { useStore } from "./store/store";
import { ROUTES } from "./constants/routes";

// Импорт компонентов шагов авторизации
import { OtpStep } from "./components/auth/otp/OtpStep";
import { SuccessStep } from "./components/auth/SuccessStep";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DataGuard } from "./components/common/DataGuard";
import { ChildrenPage } from "./pages/ChildrenPage";
import { ProfilePage } from "./pages/ProfilePage";

// Основное приложение с роутингом
const AppWithRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Демонстрация состояний */}
        <Route path={ROUTES.DEMO} element={<DemoPage />} />

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
          {/* TODO: Адаптировать для router */}
          {/* <Route path="delivery-history" element={<DeliveryHistoryPage />} /> */}
          {/* <Route path="support" element={<SupportPage />} /> */}
        </Route>

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
  }, []);

  if (isInitDataLoading || !ref.current) {
    return <LoadingComponent />;
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
