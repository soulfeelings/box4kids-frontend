import { State } from "../store";

// Селекторы для подписок
export const selectSubscriptionPlan =
  (id?: number | null) => (state: State) => {
    return state.subscriptionPlans.find((plan) => plan.id === id) || null;
  };

export const selectSubscriptionPlans = (state: State) => {
  return state.subscriptionPlans;
};
