import { useMemo } from "react";
import { useStore } from "../store";
import { selectUser } from "../selectors/userSelectors";
import { UserChildData } from "../../types";

export const useUser = () => {
  return useStore(selectUser);
};

export const useUserExists = () => {
  const user = useStore(selectUser);

  return useMemo(() => !!user, [user]);
};

export const useUserWithFilteredChildren = (children: UserChildData[]) => {
  const user = useStore(selectUser);

  return useMemo(() => {
    if (!user) return null;

    return {
      ...user,
      children,
    };
  }, [user, children]);
};
