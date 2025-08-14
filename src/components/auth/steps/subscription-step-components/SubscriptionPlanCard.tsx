import { colorManager } from "../../../../utils/ColorManager";
import { useTranslation } from 'react-i18next';

// Subscription plan card component
export const SubscriptionPlanCard: React.FC<{
  plan: any;
  isSelected: boolean;
  onSelect: (planId: number) => void;
  isLoading: boolean;
}> = ({ plan, isSelected, onSelect, isLoading }) => {
  const { t } = useTranslation();
  
  return (
    <div
      className={`rounded-3xl p-6 shadow-sm transition-all cursor-pointer ${
        isSelected
          ? "border-2 border-indigo-400"
          : "border border-gray-100 hover:border-gray-300"
      }`}
      style={{
        backgroundColor: isSelected ? "#FFFFFF" : "#F2F2F2",
      }}
      onClick={() => onSelect(plan.id)}
    >
      <div className="flex items-center gap-2 mb-4">
        <h3
          className="text-lg font-semibold text-gray-900"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {plan.name}
        </h3>
        <span className="text-gray-500">•</span>
        <span
          className="text-gray-700"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {plan.toy_count} {t('toys')}
        </span>
        <span className="text-gray-500">•</span>
        <div className="text-right">
          <span
            className="text-gray-700"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            ${plan.price_monthly}{t('per_month')}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p
          className="text-gray-600 text-sm mb-3"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {t('toy_set_composition')}
        </p>
        <div className="space-y-3">
          {plan.toy_configurations?.map((config: any) => (
            <div key={config.id} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{
                  backgroundColor: colorManager.getHexColor(config.id),
                }}
              >
                {config.icon || "🎯"}
              </div>
              <span
                className="text-gray-700 font-medium"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                x{config.quantity}
              </span>
              <span
                className="text-gray-800"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                {config.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        className={`w-full py-3 rounded-[32px] font-medium transition-colors ${
          isSelected
            ? "bg-indigo-400 text-white"
            : "text-gray-700 hover:opacity-80"
        }`}
        style={{
          fontFamily: "Nunito, sans-serif",
          backgroundColor: isSelected ? undefined : "#E3E3E3",
        }}
        disabled={isLoading}
      >
        {isSelected ? t('selected') : t('select')}
      </button>
    </div>
  );
};
