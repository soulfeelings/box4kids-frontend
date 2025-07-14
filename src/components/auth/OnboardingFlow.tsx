import React from "react";
import { useOnboardingFlow } from "./hooks/useOnboardingFlow";
import { AUTH_STEPS } from "../../constants/auth";

// Импортируем все step-компоненты
import { RegisterStep } from "./steps/RegisterStep";
import { ChildStep } from "./steps/ChildStep";
import { CategoriesStep } from "./steps/CategoriesStep";
import { SubscriptionStep } from "./steps/SubscriptionStep";
import { DeliveryStep } from "./steps/DeliveryStep";
import { PaymentStep } from "./steps/PaymentStep";

interface OnboardingFlowProps {
  className?: string;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ className }) => {
  const { currentStep } = useOnboardingFlow();

  // Рендерим соответствующий step-компонент на основе currentStep
  const renderCurrentStep = () => {
    switch (currentStep) {
      case AUTH_STEPS.REGISTER:
        return <RegisterStep />;

      case AUTH_STEPS.CHILD:
        return <ChildStep />;

      case AUTH_STEPS.CATEGORIES:
        return <CategoriesStep />;

      case AUTH_STEPS.SUBSCRIPTION:
        return <SubscriptionStep />;

      case AUTH_STEPS.DELIVERY:
        return <DeliveryStep />;

      case AUTH_STEPS.PAYMENT:
        return <PaymentStep />;

      default:
        // Fallback на первый шаг если неизвестный step
        return <RegisterStep />;
    }
  };

  return (
    <div className={`onboarding-flow ${className || ""}`}>
      {renderCurrentStep()}
    </div>
  );
};

export default OnboardingFlow;
