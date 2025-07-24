import { useParams } from "react-router-dom";
import { RouteParams } from "../types/router";
import { ROUTES } from "../constants/routes";

// Хук для типизированного получения параметров роута редактирования ребенка
export const useEditChildParams = () => {
  return useParams<RouteParams[typeof ROUTES.APP.EDIT_CHILD]>();
};

export const useCancelSubscriptionParams = () => {
  return useParams<RouteParams[typeof ROUTES.APP.CANCEL_SUBSCRIPTION]>();
};

// Общий хук для типизированных параметров
export const useTypedParams = <T extends keyof RouteParams>(route: T) => {
  return useParams<RouteParams[T]>();
};
