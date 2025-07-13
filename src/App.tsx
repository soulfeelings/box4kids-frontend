import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DemoPage } from "./pages/DemoPage";
import { KidsAppInterface } from "./pages/KidsAppInterface";
// import { ProfilePage } from "./pages/ProfilePage";
// import { SupportPage } from "./pages/SupportPage";
// import { DeliveryHistoryPage } from "./pages/DeliveryHistoryPage";
import { UserData } from "./types";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RouteGuard } from "./components/common/RouteGuard";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthContainer } from "./components/layout/AuthContainer";
import { ROUTES } from "./constants/routes";

// Импорт компонентов шагов авторизации
import { PhoneStep } from "./components/auth/PhoneStep";
import { CodeStep } from "./components/auth/CodeStep";
import { WelcomeStep } from "./components/auth/WelcomeStep";
import { RegisterStep } from "./components/auth/RegisterStep";
import { ChildStep } from "./components/auth/ChildStep";
import { CategoriesStep } from "./components/auth/CategoriesStep";
import { SubscriptionStep } from "./components/auth/SubscriptionStep";
import { DeliveryStep } from "./components/auth/DeliveryStep";
import { PaymentStep } from "./components/auth/PaymentStep";
import { SuccessStep } from "./components/auth/SuccessStep";

// Временный компонент для app маршрутов
const AppRoutes: React.FC = () => {
  const { userId, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Если не авторизован - перенаправляем на регистрацию
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.PHONE} replace />;
  }

  const handleBackToDemo = () => {
    logout(); // Очищаем состояние
    navigate(ROUTES.DEMO);
  };

  return (
    <div>
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={handleBackToDemo}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          ← Назад к демо
        </button>
      </div>
      <KidsAppInterface userId={userId!} />
    </div>
  );
};

// Основное приложение с роутингом
const AppWithRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Главная страница - редирект на /demo */}
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.DEMO} replace />}
        />

        {/* Демонстрация состояний */}
        <Route path={ROUTES.DEMO} element={<DemoPage />} />

        {/* Авторизация - компоненты напрямую с AuthContainer */}
        <Route
          path={ROUTES.AUTH.PHONE}
          element={
            <AuthContainer>
              <PhoneStep />
            </AuthContainer>
          }
        />
        <Route
          path={ROUTES.AUTH.CODE}
          element={
            <AuthContainer>
              <CodeStep />
            </AuthContainer>
          }
        />

        {/* WelcomeStep использует свой fullscreen layout */}
        <Route path={ROUTES.AUTH.WELCOME} element={<WelcomeStep />} />

        {/* Остальные шаги - пока заглушки, потом добавим с AuthContainer */}
        <Route path={ROUTES.AUTH.REGISTER} element={<RegisterStep />} />
        <Route path={ROUTES.AUTH.CHILD} element={<ChildStep />} />
        <Route path={ROUTES.AUTH.CATEGORIES} element={<CategoriesStep />} />
        <Route path={ROUTES.AUTH.SUBSCRIPTION} element={<SubscriptionStep />} />
        <Route path={ROUTES.AUTH.DELIVERY} element={<DeliveryStep />} />
        <Route path={ROUTES.AUTH.PAYMENT} element={<PaymentStep />} />
        <Route path={ROUTES.AUTH.SUCCESS} element={<SuccessStep />} />

        {/* Приложение - защищенные маршруты */}
        <Route
          path={ROUTES.APP.ROOT}
          element={
            <RouteGuard>
              <AppLayout />
            </RouteGuard>
          }
        >
          <Route index element={<AppRoutes />} />
          {/* TODO: Адаптировать для router */}
          {/* <Route path="profile" element={<ProfilePage />} /> */}
          {/* <Route path="delivery-history" element={<DeliveryHistoryPage />} /> */}
          {/* <Route path="support" element={<SupportPage />} /> */}
        </Route>

        {/* Fallback - перенаправление на регистрацию */}
        <Route path="*" element={<Navigate to={ROUTES.AUTH.PHONE} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

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
      <AuthProvider>
        <AppWithRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
