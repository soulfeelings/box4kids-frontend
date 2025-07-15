import { ROUTES } from "../constants/routes";

// Типы для параметров роутов
export interface RouteParams {
  [ROUTES.APP.EDIT_CHILD]: {
    childId: string;
  };
  [ROUTES.APP.CANCEL_SUBSCRIPTION]: {
    childId: string;
  };
}

// Вспомогательные типы для типизации роутов
export type AppRoutes = typeof ROUTES.APP;
export type AppRouteKeys = keyof AppRoutes;
export type AppRouteValues = AppRoutes[AppRouteKeys];

// Тип для получения параметров конкретного роута
export type GetRouteParams<T extends AppRouteValues> =
  T extends keyof RouteParams ? RouteParams[T] : never;

// Константы для типизированных параметров
export const EDIT_CHILD_PARAMS: RouteParams[typeof ROUTES.APP.EDIT_CHILD] = {
  childId: ":childId",
} as const;

export const CANCEL_SUBSCRIPTION_PARAMS: RouteParams[typeof ROUTES.APP.CANCEL_SUBSCRIPTION] = {
  childId: ":childId",
} as const;
