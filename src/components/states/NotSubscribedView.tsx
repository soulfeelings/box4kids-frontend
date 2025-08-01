import React from "react";
import { UserData } from "../../types";
import { AUTH_STEPS } from "../../constants/auth";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "../../features/BottomNavigation";
import { NoSubscribtionsView } from "../../features/NoSubscribtionsView";
import { useTranslation } from 'react-i18next';

interface NotSubscribedViewProps {
  userData: UserData;
}

export const NotSubscribedView: React.FC<NotSubscribedViewProps> = ({
  userData,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          {t('hello_user', { name: userData.name })}
        </h1>

        {/* Welcome Card - styled like welcome screen but half height */}
        <NoSubscribtionsView
          onClickButton={() => {
            navigate(ROUTES.AUTH.ONBOARDING, {
              state: { step: AUTH_STEPS.CHILD },
            });
          }}
          textButton={
            userData.children && userData.children.length > 0
              ? t('continue_subscription')
              : t('add_child')
          }
          text={
            userData.children && userData.children.length > 0
              ? t('finish_subscription_to_get_box')
              : t('add_child_to_get_box')
          }
        />
      </div>

      <BottomNavigation
        onHomeClick={() => {
          navigate(ROUTES.APP.ROOT);
        }}
        onChildrenClick={() => {
          navigate(ROUTES.APP.CHILDREN);
        }}
        onProfileClick={() => {
          navigate(ROUTES.APP.PROFILE);
        }}
      />
    </div>
  );
};
