import { State } from "../store";
import { DeliveryAddressData } from "../../types";

// Селекторы для доставки
export const selectDeliveryAddresses = (
  state: State
): DeliveryAddressData[] => {
  const user = state.user;
  return user?.deliveryAddresses || [];
};

export const selectSelectedDeliveryAddressId = (
  state: State
): number | null => {
  return state.selectedDeliveryAddressId;
};
