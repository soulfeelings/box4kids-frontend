import { ROUTES } from "../constants/routes";

// Типы для параметров роутов
export interface RouteParams {
  [ROUTES.APP.EDIT_CHILD]: {
    childId: string;
  };
}

// Типы для поисковых параметров (query params)
export interface RouteSearchParams {
  [ROUTES.APP.EDIT_CHILD]: {
    // Можно добавить дополнительные query параметры если нужно
  };
}

// Типы для состояния роута
export interface RouteState {
  [ROUTES.APP.EDIT_CHILD]: {
    // Можно добавить состояние если нужно
  };
}
