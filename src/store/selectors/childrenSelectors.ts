import { State } from "../store";
import { UserChildData } from "../../types";
import { SubscriptionStatus } from "../../api-client/model";

// Селекторы для детей
export const selectChildById =
  (childId?: number | null) =>
  (state: State): UserChildData | null => {
    const user = state.user;
    if (!user || !childId) {
      return null;
    }
    return (
      user.children.find((child: UserChildData) => child.id === childId) || null
    );
  };

export const selectChildrenWithoutSubscriptionByStatus =
  (statuses: SubscriptionStatus[]) =>
  (state: State): UserChildData[] => {
    const user = state.user;
    if (!user) return [];
    return user.children.filter(
      (child: UserChildData) =>
        !child.subscriptions.some((subscription) =>
          statuses.includes(subscription.status)
        )
    );
  };

export const selectAllChildrenSubscriptionsIds =
  (onlyPending: boolean = true) =>
  (state: State): number[] => {
    return (
      state.user?.children.flatMap((child) =>
        child.subscriptions
          .filter((subscription) =>
            onlyPending
              ? subscription.status === SubscriptionStatus.pending_payment
              : true
          )
          .map((subscription) => subscription.id)
      ) || []
    );
  };
