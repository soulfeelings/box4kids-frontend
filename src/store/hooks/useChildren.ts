import { useMemo } from "react";
import { useStore } from "../store";
import { selectUserChildren } from "../selectors/userSelectors";
import { SubscriptionStatus } from "../../api-client/model/subscriptionStatus";
import { UserChildData } from "../../types";

export const useChildrenWithoutSubscriptionByStatus = (
  statuses: SubscriptionStatus[]
) => {
  const children = useStore(selectUserChildren);

  return useMemo(() => {
    if (!children.length) return [];

    return children.filter(
      (child: UserChildData) =>
        !child.subscriptions.some((subscription) =>
          statuses.includes(subscription.status)
        )
    );
  }, [children, statuses]);
};

export const useChildrenWithSubscriptionByStatus = (
  statuses: SubscriptionStatus[]
) => {
  const children = useStore(selectUserChildren);

  return useMemo(() => {
    if (!children.length) return [];

    return children.filter((child: UserChildData) =>
      child.subscriptions.some((subscription) =>
        statuses.includes(subscription.status)
      )
    );
  }, [children, statuses]);
};

export const useChildrenSubscriptionsIds = (onlyPending: boolean = true) => {
  const children = useStore(selectUserChildren);

  return useMemo(() => {
    return (
      children.flatMap((child) =>
        child.subscriptions
          .filter((subscription) =>
            onlyPending
              ? subscription.status === SubscriptionStatus.pending_payment
              : true
          )
          .map((subscription) => subscription.id)
      ) || []
    );
  }, [children, onlyPending]);
};

export const useChildById = (childId?: number | null) => {
  const children = useStore(selectUserChildren);

  return useMemo(() => {
    if (!children.length || !childId) {
      return null;
    }
    return (
      children.find((child: UserChildData) => child.id === childId) || null
    );
  }, [children, childId]);
};
