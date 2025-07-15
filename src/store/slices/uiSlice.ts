import { State } from "../store";
import { AppScreen } from "../types/ui";
import * as uiMutations from "../mutations/ui";

// Типы мутаций для UI
export interface UISlice {
  currentAppScreen: AppScreen;
  setCurrentAppScreen: (screen: AppScreen) => void;
}

// Slice для UI
export const createUISlice = (
  set: (fn: (state: State) => State) => void
): UISlice => ({
  currentAppScreen: "home" as AppScreen,
  setCurrentAppScreen: (screen: AppScreen) =>
    set(uiMutations.setCurrentAppScreen(screen)),
});
