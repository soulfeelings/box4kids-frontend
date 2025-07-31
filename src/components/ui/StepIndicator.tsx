import { useTranslation } from 'react-i18next';

interface StepIndicatorProps {
  currentStep: number;
  className?: string;
}

const TOTAL_STEPS = 7;

export const StepIndicator = ({
  currentStep,
  className = "",
}: StepIndicatorProps) => {
  const { t } = useTranslation();
  
  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      {t('step', { current: currentStep, total: TOTAL_STEPS })}
    </div>
  );
};
