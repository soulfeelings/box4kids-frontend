import React, { useEffect, useMemo, useState } from "react";
import { AUTH_STEPS, AuthStep, isCorrectStep } from "../constants/auth";

// Импортируем все step-компоненты
import { UpdateNameStep } from "../components/auth/steps/UpdateNameStep";
import { ChildStep } from "../components/auth/steps/ChildStep";
import { CategoriesStep } from "../components/auth/steps/CategoriesStep";
import { SubscriptionStep } from "../components/auth/steps/SubscriptionStep";
import { DeliveryStep } from "../components/auth/steps/DeliveryStep";
import { PaymentStep } from "../components/auth/steps/PaymentStep";
import { useStore } from "../store/store";
import { WelcomeStep } from "../components/auth/steps/WelcomeStep";
import { ROUTES } from "../constants/routes";
import { useLocation, useNavigate } from "react-router-dom";
import { ValidateSubscriptionsStep } from "../components/auth/steps/ValidateSubscriptions";

interface OnboardingPageProps {
  className?: string;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  className,
}) => {
  const { state } = useLocation();
  const { step } = state || {};
  const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");

  const [currentStep, setCurrentStep] = useState<AuthStep>(
    step && isCorrectStep(step)
      ? step
      : hasSeenWelcome
      ? AUTH_STEPS.UPDATE_NAME
      : AUTH_STEPS.WELCOME
  );

  const {
    user,
    currentChildIdToUpdate,
    error,
    setError,
    setCurrentChildIdToUpdate,
    resetTemporaryState,
    getChildById,
  } = useStore();

  const currentChildToUpdate = useMemo(
    () =>
      currentChildIdToUpdate ? getChildById(currentChildIdToUpdate) : null,
    [currentChildIdToUpdate, getChildById]
  );

  const navigate = useNavigate();

  const handleClose = () => {
    resetTemporaryState(); // Сбрасываем временные значения
    navigate(ROUTES.APP.ROOT);
  };

  useEffect(() => {
    setError(null);
  }, [currentStep, setError]);

  // Проверяем, нужно ли показывать ошибку для текущего шага
  const shouldShowError = currentStep !== AUTH_STEPS.WELCOME;

  // Рендерим соответствующий step-компонент на основе currentStep
  const renderCurrentStep = () => {
    switch (currentStep) {
      case AUTH_STEPS.WELCOME:
        return (
          <WelcomeStep
            onNext={() => setCurrentStep(AUTH_STEPS.UPDATE_NAME)}
            onClose={handleClose}
          />
        );

      case AUTH_STEPS.UPDATE_NAME:
        return (
          <UpdateNameStep
            userName={user?.name}
            onBack={() => setCurrentStep(AUTH_STEPS.WELCOME)}
            onNext={() => setCurrentStep(AUTH_STEPS.CHILD)}
            onClose={handleClose}
          />
        );

      case AUTH_STEPS.CHILD:
        return (
          <ChildStep
            onBack={() => setCurrentStep(AUTH_STEPS.UPDATE_NAME)}
            onNext={() => setCurrentStep(AUTH_STEPS.CATEGORIES)}
            onClose={handleClose}
            currentChildToUpdate={currentChildToUpdate}
          />
        );

      case AUTH_STEPS.CATEGORIES:
        return (
          <CategoriesStep
            onBack={() => setCurrentStep(AUTH_STEPS.CHILD)}
            onNext={() => setCurrentStep(AUTH_STEPS.SUBSCRIPTION)}
            onClose={handleClose}
            currentChildToUpdate={currentChildToUpdate}
          />
        );

      case AUTH_STEPS.SUBSCRIPTION:
        return (
          <SubscriptionStep
            onBack={() => setCurrentStep(AUTH_STEPS.CATEGORIES)}
            onNext={() => setCurrentStep(AUTH_STEPS.VALIDATE_SUBSCRIPTIONS)}
            onClose={handleClose}
            currentChildToUpdate={currentChildToUpdate}
            onAddNewChild={() => {
              resetTemporaryState(); // Сбрасываем временные значения
              setCurrentChildIdToUpdate(null);
              setCurrentStep(AUTH_STEPS.CHILD);
            }}
          />
        );

      case AUTH_STEPS.VALIDATE_SUBSCRIPTIONS:
        return (
          <ValidateSubscriptionsStep
            onBack={() => setCurrentStep(AUTH_STEPS.SUBSCRIPTION)}
            onNext={() => setCurrentStep(AUTH_STEPS.DELIVERY)}
            onClose={handleClose}
            onAddNewChild={() => {
              resetTemporaryState(); // Сбрасываем временные значения
              setCurrentChildIdToUpdate(null);
              setCurrentStep(AUTH_STEPS.CHILD);
            }}
            onEditChildSubscription={(childId) => {
              setCurrentChildIdToUpdate(childId);
              setCurrentStep(AUTH_STEPS.SUBSCRIPTION);
            }}
            onEditChildData={(childId) => {
              setCurrentChildIdToUpdate(childId);
              setCurrentStep(AUTH_STEPS.CHILD);
            }}
          />
        );

      case AUTH_STEPS.DELIVERY:
        return (
          <DeliveryStep
            onBack={() => setCurrentStep(AUTH_STEPS.SUBSCRIPTION)}
            onNext={() => setCurrentStep(AUTH_STEPS.PAYMENT)}
            onClose={handleClose}
          />
        );

      case AUTH_STEPS.PAYMENT:
        return (
          <PaymentStep
            onBack={() => setCurrentStep(AUTH_STEPS.DELIVERY)}
            onNext={() => {
              resetTemporaryState(); // Сбрасываем временные значения при успешном завершении
              navigate(ROUTES.AUTH.SUCCESS);
            }}
            onClose={handleClose}
          />
        );

      default:
        // Fallback на первый шаг если неизвестный step
        return (
          <WelcomeStep
            onNext={() => setCurrentStep(AUTH_STEPS.UPDATE_NAME)}
            onClose={handleClose}
          />
        );
    }
  };

  return (
    <div className={`onboarding-flow ${className || ""}`}>
      {/* Показываем ошибку только для шагов кроме WELCOME */}
      {shouldShowError && error && (
        <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm mb-2 text-center mx-4 mt-4">
          {error}
        </div>
      )}
      {renderCurrentStep()}
    </div>
  );
};
