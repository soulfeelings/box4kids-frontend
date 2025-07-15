import React from "react";
import { UserData } from "../../types";
import { AUTH_STEPS } from "../../constants/auth";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "../../features/BottomNavigation";

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
        <div
          className="relative flex flex-col rounded-3xl overflow-hidden"
          style={{
            backgroundColor: "#747EEC",
            height: "50vh",
            minHeight: "400px",
          }}
        >
          {/* Illustration area - takes remaining space above bottom container */}
          <div
            className="relative flex-1 overflow-hidden"
            style={{ height: "calc(50vh - 140px)" }}
          >
            <img
              src="/illustrations/continue.png"
              alt="Girl with toy box"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          {/* Bottom container with text and button */}
          <div className="px-6 py-4 flex flex-col justify-center">
            <p
              className="text-sm text-white/90 text-center mb-4"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Завершите оформление подпсики, чтобы мы могли собрать коробку с
              игрушками и доставить её вам
            </p>

            <button
              onClick={() =>
                navigate(ROUTES.AUTH.ONBOARDING, {
                  state: {
                    step: AUTH_STEPS.SUBSCRIPTION,
                  },
                })
              }
              className="w-full bg-white text-[#30313D] py-3 rounded-3xl font-semibold text-sm"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Продолжить оформление
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation
        currentScreen="home"
        onHomeClick={() => {}}
        onChildrenClick={() => {}}
        onProfileClick={() => {}}
      />
    </div>
  );
};
