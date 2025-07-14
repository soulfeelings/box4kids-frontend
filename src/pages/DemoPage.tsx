import React from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../types";
import { useStore } from "../store/store";

// Test data scenarios for different states
const testUserDataScenarios: Record<string, UserData> = {
  // 1. User not subscribed
  notSubscribed: {
    id: 1,
    name: "Елена",
    phone: "+7 (999) 123-45-67",
    children: [
      {
        id: 1,
        name: "Алина",
        date_of_birth: "2016-03-15",
        gender: "female",
        limitations: false,
        comment: "",
        interests: [1, 2],
        skills: [1, 2, 3],
        subscriptions: [],
      },
    ],
    deliveryAddresses: [
      {
        id: 1,
        name: "г. Москва, ул. Тверская, д. 1, кв. 10",
        address: "г. Москва, ул. Тверская, д. 1, кв. 10",
        date: "24.04",
        time: "14-18",
        comment: null,
      },
    ],
    subscriptionStatus: "not_subscribed",
    nextSetStatus: "not_determined",
  },

  // 2. User just subscribed (first 2 hours)
  justSubscribed: {
    id: 1,
    name: "Елена",
    phone: "+7 (999) 123-45-67",
    children: [
      {
        id: 1,
        name: "Алина",
        date_of_birth: "2016-03-15",
        gender: "female",
        limitations: false,
        comment: "",
        interests: [1, 2],
        skills: [1, 2, 3],
        subscriptions: [],
      },
    ],
    deliveryAddresses: [
      {
        id: 1,
        name: "г. Москва, ул. Тверская, д. 1, кв. 10",
        address: "г. Москва, ул. Тверская, д. 1, кв. 10",
        date: "24.04",
        time: "14-18",
        comment: null,
      },
    ],
    subscriptionStatus: "just_subscribed",
    nextSetStatus: "not_determined",
    subscriptionDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },

  // 3. Next set not determined
  nextSetNotDetermined: {
    id: 1,
    name: "Елена",
    phone: "+7 (999) 123-45-67",
    children: [
      {
        id: 1,
        name: "Алина",
        date_of_birth: "2016-03-15",
        gender: "female",
        limitations: false,
        comment: "",
        interests: [1, 2],
        skills: [1, 2, 3],
        subscriptions: [],
      },
    ],
    deliveryAddresses: [
      {
        id: 1,
        name: "г. Москва, ул. Тверская, д. 1, кв. 10",
        address: "г. Москва, ул. Тверская, д. 1, кв. 10",
        date: "24.04",
        time: "14-18",
        comment: null,
      },
    ],
    subscriptionStatus: "active",
    nextSetStatus: "not_determined",
  },

  // 4. Next set determined (original state)
  nextSetDetermined: {
    id: 1,
    name: "Елена",
    phone: "+7 (999) 123-45-67",
    children: [
      {
        id: 1,
        name: "Алина",
        date_of_birth: "2016-03-15",
        gender: "female",
        limitations: false,
        comment: "",
        interests: [1, 2],
        skills: [1, 2, 3],
        subscriptions: [],
      },
    ],
    deliveryAddresses: [
      {
        id: 1,
        name: "г. Москва, ул. Тверская, д. 1, кв. 10",
        address: "г. Москва, ул. Тверская, д. 1, кв. 10",
        date: "24.04",
        time: "14-18",
        comment: null,
      },
    ],
    subscriptionStatus: "active",
    nextSetStatus: "determined",
  },
};

export const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleTestDemo = (scenario: string) => {
    // Сохраняем данные демо-сценария в контекст и переходим на /app
    const userData = testUserDataScenarios[scenario];
    setUser(userData);
    navigate("/app");
  };

  const handleGoToAuth = () => {
    navigate("/auth/phone");
  };

  return (
    <div
      className="min-h-screen bg-gray-100 p-4"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Демонстрация состояний приложения
        </h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-3">
              Выберите состояние:
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => handleTestDemo("notSubscribed")}
                className="w-full bg-red-100 text-red-800 py-3 px-4 rounded-lg text-left font-medium hover:bg-red-200 transition-colors"
              >
                <div className="font-medium">1. Не подписан</div>
                <div className="text-sm opacity-75">
                  Пользователь не оформил подписку
                </div>
              </button>

              <button
                onClick={() => handleTestDemo("justSubscribed")}
                className="w-full bg-green-100 text-green-800 py-3 px-4 rounded-lg text-left font-medium hover:bg-green-200 transition-colors"
              >
                <div className="font-medium">2. Только подписался</div>
                <div className="text-sm opacity-75">
                  Первые 2 часа после подписки
                </div>
              </button>

              <button
                onClick={() => handleTestDemo("nextSetNotDetermined")}
                className="w-full bg-yellow-100 text-yellow-800 py-3 px-4 rounded-lg text-left font-medium hover:bg-yellow-200 transition-colors"
              >
                <div className="font-medium">3. Набор не определен</div>
                <div className="text-sm opacity-75">
                  Состав следующего набора еще не определен
                </div>
              </button>

              <button
                onClick={() => handleTestDemo("nextSetDetermined")}
                className="w-full bg-blue-100 text-blue-800 py-3 px-4 rounded-lg text-left font-medium hover:bg-blue-200 transition-colors"
              >
                <div className="font-medium">4. Набор определен</div>
                <div className="text-sm opacity-75">
                  Обычное состояние - состав следующего набора определен
                </div>
              </button>
            </div>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={handleGoToAuth}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Перейти к регистрации
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
