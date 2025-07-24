import { State } from "../store";
import { CreateChildData, UpdateChildData } from "../types/children";
import { SubscriptionResponse } from "../../api-client/model";
import * as childrenMutations from "../mutations/children";

// Типы мутаций для детей
export interface ChildrenSlice {
  addChild: (childData: CreateChildData) => void;
  removeChild: (childId: number) => void;
  updateChild: (childId: number, updateData: UpdateChildData) => void;
  updateChildSubscription: (
    childId: number,
    subscriptionId: number,
    updatedSubscription: SubscriptionResponse
  ) => void;
}

// Slice для детей
export const createChildrenSlice = (
  set: (fn: (state: State) => State) => void
): ChildrenSlice => ({
  // Мутаторы детей
  addChild: (childData: CreateChildData) =>
    set(childrenMutations.addChild(childData)),
  removeChild: (childId: number) => set(childrenMutations.removeChild(childId)),
  updateChild: (childId: number, updateData: UpdateChildData) =>
    set(childrenMutations.updateChild(childId, updateData)),
  updateChildSubscription: (
    childId: number,
    subscriptionId: number,
    updatedSubscription: SubscriptionResponse
  ) =>
    set(
      childrenMutations.updateChildSubscription(
        childId,
        subscriptionId,
        updatedSubscription
      )
    ),
});
