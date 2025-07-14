import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneStep } from "./PhoneStep";
import { CodeStep } from "./CodeStep";
import { ROUTES } from "../../constants/routes";

type OtpStepType = "phone" | "code";

export const OtpStep: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OtpStepType>("phone");
  const navigate = useNavigate();

  const handlePhoneStepSuccess = () => {
    setCurrentStep("code");
  };

  const handleCodeStepBack = () => {
    setCurrentStep("phone");
  };

  const handleCodeStepSuccess = () => {
    setTimeout(() => {
      navigate(ROUTES.HOME);
    }, 100);
  };

  return (
    <div>
      {currentStep === "phone" && (
        <PhoneStep onSuccess={handlePhoneStepSuccess} />
      )}
      {currentStep === "code" && (
        <CodeStep
          onBack={handleCodeStepBack}
          onSuccess={handleCodeStepSuccess}
        />
      )}
    </div>
  );
};
