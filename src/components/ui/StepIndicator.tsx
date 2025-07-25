interface StepIndicatorProps {
  currentStep: number;
  className?: string;
}

const TOTAL_STEPS = 7;

export const StepIndicator = ({
  currentStep,
  className = "",
}: StepIndicatorProps) => {
  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      Шаг {currentStep}/{TOTAL_STEPS}
    </div>
  );
};
