import { State } from "../store";
import { CategoriesData } from "../types/index";
import { SubscriptionPlanResponse } from "../../api-client/model";
import * as commonMutations from "../mutations/common";

// Типы мутаций для общих данных
export interface CommonSlice {
  categoriesData: CategoriesData;
  subscriptionPlans: SubscriptionPlanResponse[];
  setCategoriesData: (data: Partial<CategoriesData>) => void;
  setSubscriptionPlans: (plans: SubscriptionPlanResponse[]) => void;
}

// Slice для общих данных
export const createCommonSlice = (
  set: (fn: (state: State) => State) => void
): CommonSlice => ({
  categoriesData: {
    interests: [],
    skills: [],
  },
  subscriptionPlans: [],
  setCategoriesData: (data: Partial<CategoriesData>) =>
    set(commonMutations.setCategoriesData(data)),
  setSubscriptionPlans: (plans: SubscriptionPlanResponse[]) =>
    set(commonMutations.setSubscriptionPlans(plans)),
});
