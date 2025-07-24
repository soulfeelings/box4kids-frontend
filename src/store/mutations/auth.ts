import { State } from "../store";
import { PhoneData, CategoriesData } from "../types/index";

// Мутаторы для аутентификации
export const setPhoneData =
  (data: Partial<PhoneData>) =>
  (state: State): State => {
    return {
      ...state,
      phoneData: { ...state.phoneData, ...data },
    };
  };

export const setCategoriesData =
  (data: Partial<CategoriesData>) =>
  (state: State): State => {
    return {
      ...state,
      categoriesData: { ...state.categoriesData, ...data },
    };
  };
