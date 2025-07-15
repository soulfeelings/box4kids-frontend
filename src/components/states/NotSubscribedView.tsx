import React from "react";
import { UserData } from "../../types";
import { AUTH_STEPS } from "../../constants/auth";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "../../features/BottomNavigation";
import { NoSubscribtionsView } from "../../features/NoSubscribtionsView";

interface NotSubscribedViewProps {
  userData: UserData;
}

export const NotSubscribedView: React.FC<NotSubscribedViewProps> = ({
  userData,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full min-h-screen pb-24"
      style={{ fontFamily: "Nunito, sans-serif", backgroundColor: "#FFE8C8" }}
    >
      <div
        className="p-4"
        style={{
          backgroundColor: "#FFE8C8",
          opacity: 1,
          borderRadius: "0 0 24px 24px",
          aspectRatio: "46%",
        }}
      >
        <h1 className="text-xl text-center font-semibold text-gray-800 mb-6">
          Привет, {userData.name}! 🦋
        </h1>

        {/* Welcome Card - styled like welcome screen but half height */}
        <NoSubscribtionsView
          onClickButton={() => {
            navigate(ROUTES.AUTH.ONBOARDING, {
              state: { step: AUTH_STEPS.CHILD },
            });
          }}
          textButton="Добавить ребенка"
        />
      </div>

      <BottomNavigation
        onHomeClick={() => {}}
        onChildrenClick={() => {}}
        onProfileClick={() => {}}
      />
    </div>
  );
};
