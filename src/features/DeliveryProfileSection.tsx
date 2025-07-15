import React, { useCallback } from "react";

interface DeliveryAddress {
  id: number;
  address: string;
  date: string;
  time: string;
  // Информация о связанных объектах
  subscriptionInfo?: {
    id: number;
    childName: string;
    planName: string;
    status: string;
  };
  boxInfo?: {
    id: number;
    childName: string;
    status: string;
    deliveryDate: string;
  };
}

interface DeliveryProfileSectionProps {
  deliveryAddresses?: DeliveryAddress[];
  onEditDelivery?: () => void;
}

export const DeliveryProfileSection: React.FC<DeliveryProfileSectionProps> = ({
  deliveryAddresses = [],
  onEditDelivery,
}) => {
  const formatDeliveryDate = useCallback((date: string) => {
    if (!date) return "";
    if (date.includes(".")) {
      const [day, month] = date.split(".");
      const monthNames = [
        "янв",
        "фев",
        "мар",
        "апр",
        "мая",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
      ];
      const monthIndex = parseInt(month) - 1;
      const monthName = monthNames[monthIndex] || month;
      return `${day} ${monthName}`;
    }
    return date;
  }, []);

  const formatDeliveryTime = useCallback((time: string) => {
    if (!time) return "";
    if (time.includes("-")) {
      const [start, end] = time.split("-");
      return `${start}:00 – ${end}:00`;
    }
    return time;
  }, []);

  const primaryAddress = deliveryAddresses[0];
  if (!primaryAddress) {
    return null;
  }

  return (
    <div className="bg-[#F2F2F2] rounded-[24px] px-4 py-3 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1">Доставка</div>
          <div className="mt-2">
            <div className="flex items-center text-base text-black mb-1">
              <div className="bg-[#F9F9F9] rounded-full w-6 h-6 flex items-center justify-center mr-2">
                <span className="text-xs">📍</span>
              </div>
              {primaryAddress.address}
            </div>
            <div className="flex items-center text-base text-black">
              <div className="bg-[#F9F9F9] rounded-full w-6 h-6 flex items-center justify-center mr-2">
                <span className="text-xs">🗓</span>
              </div>
              {formatDeliveryDate(primaryAddress.date)},{" "}
              {formatDeliveryTime(primaryAddress.time)}
            </div>

            {/* Информация о подписке */}
            {primaryAddress.subscriptionInfo && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center text-sm text-blue-700 mb-1">
                  <div className="bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center mr-2">
                    <span className="text-xs">📦</span>
                  </div>
                  Подписка: {primaryAddress.subscriptionInfo.childName} •{" "}
                  {primaryAddress.subscriptionInfo.planName}
                </div>
                <div className="text-xs text-blue-600">
                  Статус: {primaryAddress.subscriptionInfo.status}
                </div>
              </div>
            )}

            {/* Информация о боксе */}
            {primaryAddress.boxInfo && (
              <div className="mt-2 p-2 bg-green-50 rounded-lg">
                <div className="flex items-center text-sm text-green-700 mb-1">
                  <div className="bg-green-100 rounded-full w-4 h-4 flex items-center justify-center mr-2">
                    <span className="text-xs">🎁</span>
                  </div>
                  Бокс: {primaryAddress.boxInfo.childName} •{" "}
                  {primaryAddress.boxInfo.status}
                </div>
                <div className="text-xs text-green-600">
                  Доставка:{" "}
                  {formatDeliveryDate(primaryAddress.boxInfo.deliveryDate)}
                </div>
              </div>
            )}

            <div className="mt-3">
              <button
                onClick={onEditDelivery}
                className="w-full bg-[#E3E3E3] text-sm text-black py-2 px-4 rounded-[32px] text-center hover:bg-gray-300 transition-colors"
              >
                Изменить адрес или дату доставки
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
