import { State } from "../store";

// Простые селекторы для получения данных без фильтрации
export const selectSubscriptionPlans = (state: State) => {
  return state.subscriptionPlans;
};
