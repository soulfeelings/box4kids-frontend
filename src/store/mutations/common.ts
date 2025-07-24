import { State } from "../store";
import { CategoriesData } from "../types/index";
import { SubscriptionPlanResponse } from "../../api-client/model";

// Мутаторы для общих данных
export const setCategoriesData =
  (data: Partial<CategoriesData>) =>
  (state: State): State => {
    return {
      ...state,
      categoriesData: { ...state.categoriesData, ...data },
    };
  };

export const setSubscriptionPlans =
  (plans: SubscriptionPlanResponse[]) =>
  (state: State): State => {
    return {
      ...state,
      subscriptionPlans: plans,
    };
  };
