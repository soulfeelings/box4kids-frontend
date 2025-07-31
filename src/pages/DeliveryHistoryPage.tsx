import React from "react";
import { X } from "lucide-react";
import { BottomNavigation } from "../features/BottomNavigation";
import { useGetBoxHistoryToyBoxesHistoryGet } from "../api-client";
import { ToyBoxStatus } from "../api-client/model/toyBoxStatus";
import { DateManager } from "../utils/date/DateManager";
import { LoadingComponent } from "../components/common/LoadingComponent";
import { ErrorComponent } from "../components/common/ErrorComponent";
import { useTranslation } from 'react-i18next';

const dateManager = new DateManager();

interface DeliveryHistoryPageProps {
  onClose?: () => void;
}

export const DeliveryHistoryPage: React.FC<DeliveryHistoryPageProps> = ({
  onClose,
}) => {
  const { t } = useTranslation();
  // Получаем историю наборов, фильтруем только доставленные и возвращенные
  const {
    data: historyData,
    isLoading,
    error,
  } = useGetBoxHistoryToyBoxesHistoryGet({
    limit: 50,
    status: [ToyBoxStatus.delivered, ToyBoxStatus.returned],
  });

  const deliveries = historyData?.boxes || [];

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent errorMessage={t('error_loading_history')} />;
  }

  return (
    <div
      className="min-h-screen bg-[#FFFFFF] pb-20"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Title */}
      <div className="px-4 py-6 relative flex items-center">
        <div className="flex justify-between items-center" />
        <h1 className="flex-1 text-[20px] font-semibold text-gray-900 text-center">
          {t('delivery_history')}
        </h1>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Table Header */}
      <div className="mx-4 px-4 py-3 mb-2">
        <div className="flex justify-between items-center">
          <div className="text-base font-medium text-black flex-1">{t('set')}</div>
          <div className="text-base font-medium text-black flex-1 text-right">
            {t('delivery_date')}
          </div>
        </div>
      </div>

      {/* Delivery List */}
      <div className="mx-4 space-y-2">
        {deliveries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('delivery_history_empty')}
          </div>
        ) : (
          deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-[#F2F2F2] rounded-[8px] px-4 py-4 hover:bg-gray-300 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div className="text-base text-gray-900 flex-1">
                  {t('set_number', { id: delivery.id })}
                  {delivery.status === "returned" && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({t('returned')})
                    </span>
                  )}
                </div>
                <div className="text-base text-gray-900 flex-1 text-right">
                  {delivery.delivery_date
                    ? dateManager.formatDeliveryDate(delivery.delivery_date)
                    : t('date_not_specified')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};
