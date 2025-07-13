import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export const SuccessStep: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccessComplete = () => {
    navigate(ROUTES.APP.ROOT);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-center items-center p-4 relative">
        <span
          className="text-lg font-bold text-gray-900 tracking-wider"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          BOX4BABY
        </span>
        <button
          className="absolute right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={handleSuccessComplete}
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Success Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <img
            src="/illustrations/ok.png"
            alt="Success"
            className="w-32 h-32 mx-auto"
          />
        </div>

        {/* Success Message */}
        <h1
          className="text-xl font-semibold text-gray-900 mb-4"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Подписка активирована!
        </h1>

        <p
          className="text-gray-600 leading-relaxed max-w-xs"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Мы уже начали собирать коробку для вашего ребёнка. Вы получите
          уведомление, когда она будет готова к доставке.
        </p>
      </div>

      {/* Bottom Button */}
      <div className="px-6 pb-6">
        <button
          className="w-full py-4 text-white rounded-full font-medium text-lg transition-colors"
          onClick={handleSuccessComplete}
          style={{
            fontFamily: "Nunito, sans-serif",
            backgroundColor: "#30313D",
          }}
        >
          Перейти на главную
        </button>
      </div>

      {/* Синий элемент справа */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-1 h-24 bg-indigo-400 rounded-l-full"></div>
    </div>
  );
};
