// Константы для шагов авторизации
export const AUTH_STEPS = {
  WELCOME: "welcome",
  REGISTER: "register",
  CHILD: "child",
  CATEGORIES: "categories",
  SUBSCRIPTION: "subscription",
  DELIVERY: "delivery",
  PAYMENT: "payment",
  SUCCESS: "success",
} as const;

// Типы для шагов
export type AuthStep = (typeof AUTH_STEPS)[keyof typeof AUTH_STEPS];
