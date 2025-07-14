import React, { useState } from "react";
import { AUTH_STEPS, AuthStep } from "../../constants/auth";

// Импортируем все step-компоненты
import { RegisterStep } from "./steps/RegisterStep";
import { ChildStep } from "./steps/ChildStep";
import { CategoriesStep } from "./steps/CategoriesStep";
import { SubscriptionStep } from "./steps/SubscriptionStep";
import { DeliveryStep } from "./steps/DeliveryStep";
import { PaymentStep } from "./steps/PaymentStep";
import { useStore } from "../../store/store";
import { WelcomeStep } from "./WelcomeStep";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";

interface OnboardingFlowProps {
  className?: string;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  className,
}) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>(AUTH_STEPS.WELCOME);
  const { user } = useStore();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(ROUTES.APP.ROOT);
  };

  // Рендерим соответствующий step-компонент на основе currentStep
  const renderCurrentStep = () => {
    switch (currentStep) {
      case AUTH_STEPS.WELCOME:
        return (
          <WelcomeStep
            onNext={() => setCurrentStep(AUTH_STEPS.REGISTER)}
            onClose={handleClose}
          />
        );

      case AUTH_STEPS.REGISTER:
        return (
          <RegisterStep
            onBack={() => setCurrentStep(AUTH_STEPS.WELCOME)}
            onNext={() => setCurrentStep(AUTH_STEPS.CHILD)}
            onClose={handleClose}
          />
        );

      case AUTH_STEPS.CHILD:
        return (
          <ChildStep
            onBack={() => setCurrentStep(AUTH_STEPS.REGISTER)}
            onNext={() => setCurrentStep(AUTH_STEPS.CATEGORIES)}
            onClose={handleClose}
          />
        );

      case AUTH_STEPS.CATEGORIES:
        return (
          <CategoriesStep
            onBack={() => setCurrentStep(AUTH_STEPS.CHILD)}
            onNext={() => setCurrentStep(AUTH_STEPS.SUBSCRIPTION)}
            onClose={handleClose}
          />
        );

      case AUTH_STEPS.SUBSCRIPTION:
        return (
          <SubscriptionStep
            onBack={() => setCurrentStep(AUTH_STEPS.CATEGORIES)}
            onNext={() => setCurrentStep(AUTH_STEPS.DELIVERY)}
            onClose={handleClose}
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
            onNext={() => navigate(ROUTES.APP.ROOT)}
            onClose={handleClose}
          />
        );

      default:
        // Fallback на первый шаг если неизвестный step
        return (
          <WelcomeStep
            onNext={() => setCurrentStep(AUTH_STEPS.REGISTER)}
            onClose={handleClose}
          />
        );
    }
  };

  return (
    <div className={`onboarding-flow ${className || ""}`}>
      {renderCurrentStep()}
    </div>
  );
};
