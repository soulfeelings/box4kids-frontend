import { useMemo } from "react";
import { useStore } from "../store";
import { selectSubscriptionPlans } from "../selectors/subscriptionSelectors";
import { SubscriptionPlanResponse } from "../../api-client/model";

export const useSubscriptionPlan = (id?: number | null) => {
  const subscriptionPlans = useStore(selectSubscriptionPlans);

  return useMemo(() => {
    if (id === null || id === undefined) {
      return null;
    }

    return (
      subscriptionPlans.find(
        (plan: SubscriptionPlanResponse) => plan.id === id
      ) || null
    );
  }, [subscriptionPlans, id]);
};

export const useSubscriptionPlans = () => {
  return useStore(selectSubscriptionPlans);
};

export const useSubscriptionPlansCount = () => {
  const subscriptionPlans = useStore(selectSubscriptionPlans);

  return useMemo(() => {
    return subscriptionPlans.length;
  }, [subscriptionPlans.length]);
};
