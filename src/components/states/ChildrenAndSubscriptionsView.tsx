import React from "react";
import { ArrowLeft, User } from "lucide-react";
import { UserChildData, UserData } from "../../types";
import { AddNewChildBanner } from "../../features/AddNewChildBanner";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { AUTH_STEPS } from "../../constants/auth";

interface ChildrenAndSubscriptionsViewProps {
  userData: UserData;
  setShowChildrenScreen: (show: boolean) => void;
  BottomNavigation: React.ComponentType;
  getAge: (birthDate: string) => number;
}

export const ChildrenAndSubscriptionsView: React.FC<
  ChildrenAndSubscriptionsViewProps
> = ({ userData, setShowChildrenScreen, BottomNavigation, getAge }) => {
  const child: UserChildData | null = userData.children[0] || null; // Assuming first child for now
  const navigate = useNavigate();

  return (
    <div
      className="w-full min-h-screen"
      style={{ fontFamily: "Nunito, sans-serif", backgroundColor: "#FFE8C8" }}
    >
      {/* Header */}
      <div
        className="p-4 flex items-center justify-center relative"
        style={{ backgroundColor: "#FFE8C8" }}
      >
        <button
          onClick={() => setShowChildrenScreen(false)}
          className="absolute left-4 p-1"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Дети и наборы</h1>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Combined Child Info and Toy Set Container */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          {/* Child Info */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mr-3">
                <User size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {child?.name}, {getAge(child?.date_of_birth)} лет
                </h3>
              </div>
            </div>

            {/* Interests */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Интересы</p>
              <div className="flex flex-wrap gap-2">
                {child?.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Навыки для развития</p>
              <div className="flex flex-wrap gap-2">
                {child?.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Subscription */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Тариф</p>
              <p className="text-gray-800 font-medium">
                {child?.subscriptions[0].plan_id === 1 ? "Базовый" : "Премиум"}{" "}
                • 6 игрушек • 535₽/мес
              </p>
            </div>
          </div>

          {/* Toy Set Composition */}
          <div className="mb-6">
            <h4 className="text-gray-800 font-medium mb-3">
              Состав набора игрушек
            </h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  🔧
                </div>
                <span className="text-gray-700">x2 Конструктор</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  🎨
                </div>
                <span className="text-gray-700">x2 Творческий набор</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  🧸
                </div>
                <span className="text-gray-700">x1 Мягкая игрушка</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                  🎪
                </div>
                <span className="text-gray-700">x1 Головоломка</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium">
              Изменить данные ребенка
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium">
              Изменить тариф
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium">
              Оставить подписку
            </button>
          </div>
        </div>

        <AddNewChildBanner
          onClick={() => {
            navigate(ROUTES.AUTH.ONBOARDING, {
              state: {
                step: AUTH_STEPS.CHILD,
              },
            });
          }}
        />
      </div>
      <BottomNavigation />
    </div>
  );
};
