import { State } from "../store";
import { AppScreen } from "../types/ui";

// Мутаторы для UI
export const setCurrentAppScreen =
  (screen: AppScreen) =>
  (state: State): State => {
    return { ...state, currentAppScreen: screen };
  };
