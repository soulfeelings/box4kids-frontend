import { useLocation } from "react-router-dom";

export const useChildIdLocation = () => {
  const { state } = useLocation();

  return state?.childId as number | undefined;
};
