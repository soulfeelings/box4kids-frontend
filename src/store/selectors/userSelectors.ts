import { State } from "../store";
import { UserChildData } from "../../types";

// Селекторы для пользователя
export const selectUser = (state: State) => state.user;

export const selectUserChildren = (state: State): UserChildData[] => {
  return state.user?.children || [];
};

export const selectUserDeliveryAddresses = (state: State) => {
  return state.user?.deliveryAddresses || [];
};
