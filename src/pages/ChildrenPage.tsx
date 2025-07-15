import { ChildrenAndSubscriptionsView } from "../components/states";
import { ROUTES } from "../constants/routes";
import { useStore } from "../store";
import { UserData } from "../types";
import { useNavigate } from "react-router-dom";

export const ChildrenPage = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  return (
    <ChildrenAndSubscriptionsView
      userData={user as UserData}
      onArrowLeftClick={() => {
        navigate(ROUTES.APP.ROOT);
      }}
    />
  );
};
