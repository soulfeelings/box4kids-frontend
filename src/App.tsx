import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { LandingPage } from "./pages/LandingPage";
import { KidsAppInterface } from "./pages/KidsAppInterface";
import { AdminPage } from "./pages/AdminPage";
import { UserData } from "./types";
import {
  useScenarioNavigation,
  scenarioConfigs,
} from "./hooks/useScenarioNavigation";

// Test data scenarios for different states
const testUserDataScenarios: Record<string, UserData> = {
  // 1. User not subscribed
  notSubscribed: {
    name: "Елена",
    phone: "+7 (999) 123-45-67",
    children: [
      {
        id: "1",
        name: "Алина",
        birthDate: "2016-03-15",
        gender: "female",
        limitations: "none",
        comment: "",
        interests: ["Конструкторы", "Творчество"],
        skills: ["Логика", "Воображение", "Творчество"],
        subscription: "",
      },
    ],
    deliveryAddress: "г. Москва, ул. Тверская, д. 1, кв. 10",
    deliveryDate: "24.04",
    deliveryTime: "14-18",
    subscriptionStatus: "not_subscribed",
    nextSetStatus: "not_determined",
  },

  // 2. User just subscribed (first 2 hours)
  justSubscribed: {
    name: "Елена",
    phone: "+7 (999) 123-45-67",
    children: [
      {
        id: "1",
        name: "Алина",
        birthDate: "2016-03-15",
        gender: "female",
        limitations: "none",
        comment: "",
        interests: ["Конструкторы", "Творчество"],
        skills: ["Логика", "Воображение", "Творчество"],
        subscription: "base",
      },
    ],
    deliveryAddress: "г. Москва, ул. Тверская, д. 1, кв. 10",
    deliveryDate: "24.04",
    deliveryTime: "14-18",
    subscriptionStatus: "just_subscribed",
    nextSetStatus: "not_determined",
    subscriptionDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },

  // 3. Next set not determined
  nextSetNotDetermined: {
    name: "Елена",
    phone: "+7 (999) 123-45-67",
    children: [
      {
        id: "1",
        name: "Алина",
        birthDate: "2016-03-15",
        gender: "female",
        limitations: "has_limitations",
        comment:
          "Не любит слишком громкие игрушки, предпочитает спокойные занятия",
        interests: ["Конструкторы", "Творчество"],
        skills: ["Логика", "Воображение", "Творчество"],
        subscription: "base",
      },
    ],
    deliveryAddress: "г. Москва, ул. Тверская, д. 1, кв. 10",
    deliveryDate: "24.04",
    deliveryTime: "14-18",
    subscriptionStatus: "active",
    nextSetStatus: "not_determined",
  },

  // 4. Next set determined (original state)
  nextSetDetermined: {
    name: "Елена",
    phone: "+7 (999) 123-45-67",
    children: [
      {
        id: "1",
        name: "Алина",
        birthDate: "2016-03-15",
        gender: "female",
        limitations: "has_limitations",
        comment: "Очень активная, любит подвижные игры и творчество",
        interests: ["Конструкторы", "Творчество"],
        skills: ["Логика", "Воображение", "Творчество"],
        subscription: "base",
      },
    ],
    deliveryAddress: "г. Москва, ул. Тверская, д. 1, кв. 10",
    deliveryDate: "24.04",
    deliveryTime: "14-18",
    subscriptionStatus: "active",
    nextSetStatus: "determined",
  },

  // 5. Multiple children scenario
  multipleChildren: {
    name: "Елена",
    phone: "+7 (999) 123-45-67",
    children: [
      {
        id: "1",
        name: "Алина",
        birthDate: "2016-03-15",
        gender: "female",
        limitations: "has_limitations",
        comment: "Очень активная, любит подвижные игры и творчество",
        interests: ["Конструкторы", "Творчество"],
        skills: ["Логика", "Воображение", "Творчество"],
        subscription: "base",
      },
      {
        id: "2",
        name: "Максим",
        birthDate: "2018-07-22",
        gender: "male",
        limitations: "has_limitations",
        comment:
          "Спокойный ребенок, любит книги и пазлы. Не переносит слишком яркий свет",
        interests: ["Чтение", "Пазлы"],
        skills: ["Внимание", "Память"],
        subscription: "premium",
      },
      {
        id: "3",
        name: "София",
        birthDate: "2020-01-10",
        gender: "female",
        limitations: "none",
        comment: "",
        interests: ["Музыка", "Танцы"],
        skills: ["Координация", "Ритм"],
        subscription: "base",
      },
    ],
    deliveryAddress: "г. Москва, ул. Тверская, д. 1, кв. 10",
    deliveryDate: "24.04",
    deliveryTime: "14-18",
    subscriptionStatus: "active",
    nextSetStatus: "determined",
  },
};

// Demo page component
function DemoPage() {
  const navigate = useNavigate();

  const handleTestDemo = (scenario: string) => {
    navigate(`/demo/${scenario}`);
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
              {Object.entries(scenarioConfigs).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleTestDemo(key)}
                  className={`w-full bg-${config.color}-100 text-${config.color}-800 py-3 px-4 rounded-lg text-left font-medium hover:bg-${config.color}-200 transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{config.title}</div>
                      <div className="text-sm opacity-75">
                        {config.description}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">→ /demo/{key}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg text-left font-medium hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Перейти к логину</div>
                  <div className="text-sm opacity-75">
                    Обычный вход в приложение
                  </div>
                </div>
                <div className="text-sm text-gray-500">→ /login</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo state component
function DemoState() {
  const { currentScenario, navigateToDemo } = useScenarioNavigation();

  const initialUserData =
    currentScenario && testUserDataScenarios[currentScenario]
      ? testUserDataScenarios[currentScenario]
      : testUserDataScenarios.nextSetDetermined;

  const [userData, setUserData] = React.useState(initialUserData);

  // Обновляем данные при смене сценария
  React.useEffect(() => {
    const newUserData =
      currentScenario && testUserDataScenarios[currentScenario]
        ? testUserDataScenarios[currentScenario]
        : testUserDataScenarios.nextSetDetermined;
    setUserData(newUserData);
  }, [currentScenario]);

  const handleUpdateUserData = (updatedData: UserData) => {
    console.log("Updated user data:", updatedData);
    setUserData(updatedData);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <button
          onClick={navigateToDemo}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          ← Назад к демо
        </button>
      </div>

      <div className="pt-16">
        <KidsAppInterface
          userData={userData}
          onUpdateUserData={handleUpdateUserData}
        />
      </div>
    </div>
  );
}

// Login page wrapper
function LoginPageWrapper() {
  const handleNavigateToKidsPage = (data: UserData) => {
    // В реальном приложении здесь была бы логика аутентификации
    // Для демо просто переходим к состоянию по умолчанию
    window.location.href = "/demo/nextSetDetermined";
  };

  return <LoginPage onNavigateToKidsPage={handleNavigateToKidsPage} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPageWrapper />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/demo/:scenario" element={<DemoState />} />
        <Route path="/demo" element={<DemoPage />} />
        {/* Fallback для неизвестных маршрутов */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
