import { State } from "../store";
import { PhoneData, CategoriesData } from "../types/index";
import * as authMutations from "../mutations/auth";

// Типы мутаций для аутентификации
export interface AuthSlice {
  phoneData: PhoneData;
  isAuthenticated: () => boolean;
  setPhoneData: (data: Partial<PhoneData>) => void;
}

// Slice для аутентификации
export const createAuthSlice = (
  set: (fn: (state: State) => State) => void
): AuthSlice => ({
  phoneData: {
    phone: "",
    code: "",
    verified: false,
  },
  isAuthenticated: () => {
    const token = localStorage.getItem("access_token");
    return !!token;
  },
  setPhoneData: (data: Partial<PhoneData>) =>
    set(authMutations.setPhoneData(data)),
});
