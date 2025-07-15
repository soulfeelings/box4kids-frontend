import { State } from "../store";
import { CreateChildData, UpdateChildData } from "../types";
import { SubscriptionResponse } from "../../api-client/model";

// Мутаторы для управления детьми
export const addChild =
  (childData: CreateChildData) =>
  (state: State): State => {
    if (!state.user) {
      console.error("addChild: User not found");
      return state;
    }
    return {
      ...state,
      user: {
        ...state.user,
        children: [...state.user.children, childData],
      },
    };
  };

export const removeChild =
  (childId: number) =>
  (state: State): State => {
    if (!state.user) {
      console.error("removeChild: User not found");
      return state;
    }
    return {
      ...state,
      user: {
        ...state.user,
        children: state.user.children.filter((child) => child.id !== childId),
      },
    };
  };

export const updateChild =
  (childId: number, updateData: UpdateChildData) =>
  (state: State): State => {
    if (!state.user) {
      console.error("updateChild: User not found");
      return state;
    }

    const childIndex = state.user.children.findIndex(
      (child) => child.id === childId
    );
    if (childIndex === -1) {
      console.error(`updateChild: Child with id ${childId} not found`);
      return state;
    }

    const updatedChildren = [...state.user.children];
    updatedChildren[childIndex] = {
      ...updatedChildren[childIndex],
      ...updateData,
    };

    return {
      ...state,
      user: {
        ...state.user,
        children: updatedChildren,
      },
    };
  };

export const updateChildSubscription =
  (
    childId: number,
    subscriptionId: number,
    updatedSubscription: SubscriptionResponse
  ) =>
  (state: State): State => {
    if (!state.user) {
      console.error("updateChildSubscription: User not found");
      return state;
    }

    const childIndex = state.user.children.findIndex(
      (child) => child.id === childId
    );
    if (childIndex === -1) {
      console.error(
        `updateChildSubscription: Child with id ${childId} not found`
      );
      return state;
    }

    const child = state.user.children[childIndex];
    const subscriptionIndex = child.subscriptions.findIndex(
      (sub) => sub.id === subscriptionId
    );
    if (subscriptionIndex === -1) {
      console.error(
        `updateChildSubscription: Subscription with id ${subscriptionId} not found`
      );
      return state;
    }

    const updatedChildren = [...state.user.children];
    const updatedSubscriptions = [...child.subscriptions];
    updatedSubscriptions[subscriptionIndex] = updatedSubscription;

    updatedChildren[childIndex] = {
      ...child,
      subscriptions: updatedSubscriptions,
    };

    return {
      ...state,
      user: {
        ...state.user,
        children: updatedChildren,
      },
    };
  };
