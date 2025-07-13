// Константы для шагов авторизации
export const AUTH_STEPS = {
  PHONE: "phone",
  CODE: "code",
  WELCOME: "welcome",
  REGISTER: "register",
  CHILD: "child",
  CATEGORIES: "categories",
  SUBSCRIPTION: "subscription",
  DELIVERY: "delivery",
  PAYMENT: "payment",
  SUCCESS: "success",
} as const;

// Карта переходов между шагами
export const AUTH_STEP_TRANSITIONS = {
  [AUTH_STEPS.PHONE]: AUTH_STEPS.CODE,
  [AUTH_STEPS.CODE]: AUTH_STEPS.WELCOME,
  [AUTH_STEPS.WELCOME]: AUTH_STEPS.REGISTER,
  [AUTH_STEPS.REGISTER]: AUTH_STEPS.CHILD,
  [AUTH_STEPS.CHILD]: AUTH_STEPS.CATEGORIES,
  [AUTH_STEPS.CATEGORIES]: AUTH_STEPS.SUBSCRIPTION,
  [AUTH_STEPS.SUBSCRIPTION]: AUTH_STEPS.DELIVERY,
  [AUTH_STEPS.DELIVERY]: AUTH_STEPS.PAYMENT,
  [AUTH_STEPS.PAYMENT]: AUTH_STEPS.SUCCESS,
  [AUTH_STEPS.SUCCESS]: null, // Завершение
} as const;

// Типы для шагов
export type AuthStep = (typeof AUTH_STEPS)[keyof typeof AUTH_STEPS];
export type AuthStepTransition =
  (typeof AUTH_STEP_TRANSITIONS)[keyof typeof AUTH_STEP_TRANSITIONS];
