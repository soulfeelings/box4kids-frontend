import { State } from "../store";
import { UserData } from "../../types";

// Мутаторы для пользователя
export const setUser =
  (user: UserData) =>
  (state: State): State => {
    return { ...state, user };
  };

export const setUserName =
  (name: string) =>
  (state: State): State => {
    if (!state.user) {
      console.error("setUserName: User not found");
      return state;
    }
    return { ...state, user: { ...state.user, name } };
  };

export const setUserPhone =
  (phone: string) =>
  (state: State): State => {
    if (!state.user) {
      console.error("setUserPhone: User not found");
      return state;
    }
    return { ...state, user: { ...state.user, phone } };
  };

export const logout =
  () =>
  (state: State): State => {
    return { ...state, user: null };
  };

export const setCurrentChildIdToUpdate =
  (childId: number | null) =>
  (state: State): State => {
    return { ...state, currentChildIdToUpdate: childId };
  };
