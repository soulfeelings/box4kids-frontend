import { State } from "../store";
import { UserChildData } from "../../types";

// Селекторы для пользователя
export const selectUser = (state: State) => state.user;

export const selectUserChildren = (state: State): UserChildData[] => {
  return state.user?.children || [];
};

// Более специфичные селекторы для предотвращения ререндеров
export const selectUserExists = (state: State) => !!state.user;
export const selectUserChildrenCount = (state: State) =>
  state.user?.children?.length || 0;
export const selectUserChildrenIds = (state: State) =>
  state.user?.children?.map((child) => child.id) || [];

export const selectUserDeliveryAddresses = (state: State) => {
  return state.user?.deliveryAddresses || [];
};
