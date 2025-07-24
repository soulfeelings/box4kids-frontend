// Константы для шагов авторизации
export const AUTH_STEPS = {
  WELCOME: "welcome",
  UPDATE_NAME: "update_name",
  CHILD: "child",
  CATEGORIES: "categories",
  SUBSCRIPTION: "subscription",
  VALIDATE_SUBSCRIPTIONS: "validate_subscriptions",
  DELIVERY: "delivery",
  PAYMENT: "payment",
  SUCCESS: "success",
} as const;

// Типы для шагов
export type AuthStep = (typeof AUTH_STEPS)[keyof typeof AUTH_STEPS];

export const isCorrectStep = (step: AuthStep) => {
  return Object.values(AUTH_STEPS).includes(step);
};
