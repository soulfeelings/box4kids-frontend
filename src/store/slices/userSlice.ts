import { State } from "../store";
import { UserData } from "../../types";
import * as userMutations from "../mutations/user";

// Типы мутаций для пользователя
export interface UserSlice {
  setUser: (user: UserData) => void;
  setUserName: (name: string) => void;
  setUserPhone: (phone: string) => void;
  logout: () => void;
  setCurrentChildIdToUpdate: (childId: number | null) => void;
}

// Slice для пользователя (для combine)
export const createUserSlice = (
  set: (fn: (state: State) => State) => void
) => ({
  // Мутаторы пользователя
  setUser: (user: UserData) => set(userMutations.setUser(user)),
  setUserName: (name: string) => set(userMutations.setUserName(name)),
  setUserPhone: (phone: string) => set(userMutations.setUserPhone(phone)),
  logout: () => set(userMutations.logout()),
  setCurrentChildIdToUpdate: (childId: number | null) =>
    set(userMutations.setCurrentChildIdToUpdate(childId)),
});
