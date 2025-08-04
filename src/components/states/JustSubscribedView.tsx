import React from "react";
import { UserData } from "../../types";
import { BottomNavigation } from "../../features/BottomNavigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

interface JustSubscribedViewProps {
  userData: UserData;
  formatDeliveryDate: (dateString: string) => string;
  formatDeliveryTime: (timeString: string) => string;
  allToys: Array<{ icon: string; count: number; name: string; color: string }>;
  getCurrentDate: () => string;
}

export const JustSubscribedView: React.FC<JustSubscribedViewProps> = ({
  userData,
  formatDeliveryDate,
  formatDeliveryTime,
  allToys,
  getCurrentDate,
}) => {
  const { t } = useTranslation();
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
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          {t("congrats_user", { name: userData.name })}
        </h1>

        {/* Current Set Card */}
        <div
          className="p-4 mb-4"
          style={{ backgroundColor: "#F0955E", borderRadius: "24px" }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-white font-medium">
              {t("current_set_with_date", { date: getCurrentDate() })}
            </h2>
          </div>

          <div className="space-y-2 mb-4">
            {allToys.map((toy, index) => (
              <div key={index} className="flex items-center text-white">
                <div
                  className="w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs"
                  style={{ backgroundColor: "#F8CAAF" }}
                >
                  {toy.icon}
                </div>
                <span className="text-sm">
                  x{toy.count} {toy.name}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery Info */}
          <div
            className="p-4 rounded-2xl"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <p className="text-gray-600 text-sm mb-1">{t("delivery")}</p>
            <p className="text-gray-800 font-medium">
              {formatDeliveryDate(userData.deliveryAddresses[0]?.date)} •{" "}
              {formatDeliveryTime(userData.deliveryAddresses[0]?.time)}
            </p>
          </div>
        </div>
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
