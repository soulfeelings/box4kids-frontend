// Константы для роутов приложения
export const ROUTES = {
  // Основные роуты
  HOME: "/",
  DEMO: "/demo",

  // Авторизация
  AUTH: {
    OTP: "/auth/otp",
    ONBOARDING: "/auth/onboarding",
    SUCCESS: "/auth/success",
  },

  // Приложение
  APP: {
    ROOT: "/app",
    PROFILE: "/app/profile",
    CHILDREN: "/app/children",
    EDIT_CHILD: "/app/edit-child/:childId",
    DELIVERY_HISTORY: "/app/delivery-history",
    SUPPORT: "/app/support",
    CANCEL_SUBSCRIPTION: "/app/cancel-subscription/:subscriptionId",
  },

  // Админка
  ADMIN: "/admin",
} as const;

// Вспомогательные типы для типизации
export type AuthRoute = (typeof ROUTES.AUTH)[keyof typeof ROUTES.AUTH];
export type AppRoute = (typeof ROUTES.APP)[keyof typeof ROUTES.APP];
export type Route = (typeof ROUTES)[keyof typeof ROUTES] | AuthRoute | AppRoute;
