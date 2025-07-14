import React from "react";
import { useOnboardingFlow } from "./hooks/useOnboardingFlow";
import { AUTH_STEPS } from "../../constants/auth";

interface OnboardingNavigationProps {
  className?: string;
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  className,
}) => {
  const { currentStep, goToNextStep, goToPrevStep, canGoBack, canGoForward } =
    useOnboardingFlow();

  // Определяем все шаги для прогресса
  const steps = [
    { key: AUTH_STEPS.REGISTER, label: "Регистрация" },
    { key: AUTH_STEPS.CHILD, label: "Ребенок" },
    { key: AUTH_STEPS.CATEGORIES, label: "Категории" },
    { key: AUTH_STEPS.SUBSCRIPTION, label: "Подписка" },
    { key: AUTH_STEPS.DELIVERY, label: "Доставка" },
    { key: AUTH_STEPS.PAYMENT, label: "Оплата" },
  ];

  // Получаем индекс текущего шага
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  // Вычисляем прогресс в процентах
  const progress =
    currentStepIndex >= 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <div className={`onboarding-navigation ${className || ""}`}>
      {/* Индикатор прогресса */}
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-text">
          Шаг {currentStepIndex + 1} из {steps.length}
        </div>
      </div>

      {/* Список шагов */}
      <div className="steps-list">
        {steps.map((step, index) => (
          <div
            key={step.key}
            className={`step-item ${
              index === currentStepIndex ? "active" : ""
            } ${index < currentStepIndex ? "completed" : ""}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>

      {/* Кнопки навигации */}
      <div className="navigation-buttons">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={goToPrevStep}
          disabled={!canGoBack()}
        >
          ← Назад
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={goToNextStep}
          disabled={!canGoForward()}
        >
          Далее →
        </button>
      </div>
    </div>
  );
};

export default OnboardingNavigation;
