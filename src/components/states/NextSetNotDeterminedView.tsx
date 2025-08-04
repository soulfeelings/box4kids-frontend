import React from "react";
import { Star } from "lucide-react";
import { UserData } from "../../types";
import { BottomNavigation } from "../../features/BottomNavigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

interface NextSetNotDeterminedViewProps {
  userData: UserData;
  currentToys: Array<{
    icon: string;
    count: number;
    name: string;
    color: string;
  }>;
  rating: number;
  setShowAllToys: (show: boolean) => void;
  handleStarClick: (starIndex: number) => void;
  getCurrentDate: () => string;
  formatDeliveryDate: (dateString: string) => string;
  formatDeliveryTime: (timeString: string) => string;
}

export const NextSetNotDeterminedView: React.FC<
  NextSetNotDeterminedViewProps
> = ({
  userData,
  currentToys,
  rating,
  setShowAllToys,
  handleStarClick,
  getCurrentDate,
  formatDeliveryDate,
  formatDeliveryTime,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div
      className="w-full min-h-screen pb-24"
      style={{ fontFamily: "Nunito, sans-serif", backgroundColor: "#F2F2F2" }}
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
          {t("hello_user", { name: userData.name })}
        </h1>

        {/* Current Set Card */}
        <div
          className="p-4 mb-4"
          style={{ backgroundColor: "#F0955E", borderRadius: "24px" }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-white font-medium">{t("current_set")}</h2>
            <span className="text-white text-sm">{getCurrentDate()}</span>
          </div>

          <div className="space-y-2 mb-4">
            {currentToys.map((toy, index) => (
              <div key={index} className="flex items-center text-white">
                <div
                  className="w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs"
                  style={{ backgroundColor: toy.color }}
                >
                  {toy.icon}
                </div>
                <span className="text-sm">
                  x{toy.count} {toy.name}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowAllToys(true)}
            className="w-full text-white py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: "#F4B58E" }}
          >
            {t("show_all_toys")}
          </button>
        </div>

        {/* Rating Section */}
        <div
          className="p-4 mb-6"
          style={{ backgroundColor: "#747EEC", borderRadius: "24px" }}
        >
          <h3 className="text-white font-medium mb-3">
            {t("how_do_you_like_the_current_set")}
          </h3>
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <button
                key={index}
                onClick={() => handleStarClick(index)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={`${
                    index < rating
                      ? "fill-[#FFDB28] text-[#FFDB28]"
                      : "fill-[#BABFF6] text-[#BABFF6]"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Next Set Section - Not Determined */}
      <div
        className="p-4 flex-1"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          marginTop: "16px",
          marginLeft: "16px",
          marginRight: "16px",
        }}
      >
        <h3 className="text-gray-800 font-medium mb-4">{t("next_set")}</h3>

        {/* Not determined message */}
        <div
          className="p-4 mb-4"
          style={{
            backgroundColor: "#FFF9E6",
            borderRadius: "16px",
            border: "1px solid #F0D000",
          }}
        >
          <p className="text-gray-700 text-sm mb-2">
            <strong>{t("next_set_not_determined")}</strong>
          </p>
          <p className="text-gray-600 text-sm">
            {t("you_can_influence_toys_by_changing_interests")}
          </p>
        </div>

        {/* Delivery Info */}
        <div
          className="p-4 mb-4"
          style={{ backgroundColor: "#F2F2F2", borderRadius: "16px" }}
        >
          <div>
            <p className="text-gray-600 text-sm mb-1">{t("delivery")}</p>
            <p className="text-gray-800 font-medium">
              {formatDeliveryDate(userData.deliveryAddresses[0]?.date)} •{" "}
              {formatDeliveryTime(userData.deliveryAddresses[0]?.time)}
            </p>
          </div>
        </div>

        {/* Change Interests Button - more prominent */}
        <button
          className="w-full text-white py-4 text-sm font-medium mb-4"
          style={{ backgroundColor: "#F0955E", borderRadius: "16px" }}
        >
          {t("change_child_interests")}
        </button>

        {/* Secondary button */}
        <button
          className="w-full text-gray-600 py-3 text-sm font-medium"
          style={{ backgroundColor: "#E3E3E3", borderRadius: "16px" }}
        >
          {t("view_previous_sets")}
        </button>
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
