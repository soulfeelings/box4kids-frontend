import React, { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { BottomNavigation } from "../../features/BottomNavigation";
import { ToyBoxResponse } from "../../api-client/model/toyBoxResponse";
import { useGetAllToyCategoriesToyCategoriesGet } from "../../api-client";
import { formatFullDeliveryDateTime } from "../../utils/date/dateFormatter";
import { UserData } from "../../types";
import { useStore } from "../../store";
import { selectChildById } from "../../store/selectors";

interface ToySetDetailViewProps {
  userData: UserData;
  currentBox: ToyBoxResponse;
  close: () => void;
}

export const ToySetDetailView: React.FC<ToySetDetailViewProps> = ({
  userData,
  currentBox,
  close,
}) => {
  const { data: categories } = useGetAllToyCategoriesToyCategoriesGet();

  const deliveryLabel = useMemo(() => {
    switch (currentBox.status) {
      case "planned":
        return "Запланирован";
      case "assembled":
        return "Собран";
      case "shipped":
        return "В пути";
      case "delivered":
        return "Доставлено";
      case "returned":
        return "Возвращен";
      default:
        return "Неизвестный статус";
    }
  }, [currentBox.status]);

  const child = useStore(selectChildById(currentBox.child_id));

  return (
    <div
      className="w-full bg-gray-100 min-h-screen"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white p-4 flex items-center">
        <button onClick={() => close()} className="mr-3 p-1">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">
          Текущий набор для {child?.name}
        </h1>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Delivery and Return Info */}
        <div className="bg-gray-200 rounded-xl p-4 mb-4">
          <div className="mb-2">
            <p className="text-gray-600 text-sm">{deliveryLabel}</p>
            <p className="text-gray-800 font-medium">
              {formatFullDeliveryDateTime(
                currentBox.delivery_date,
                currentBox.delivery_time ?? undefined
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Возврат</p>
            <p className="text-gray-800 font-medium">
              {formatFullDeliveryDateTime(
                currentBox.return_date,
                currentBox.return_time ?? undefined
              )}
            </p>
          </div>
        </div>

        {/* Toys List */}
        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="space-y-4">
            {currentBox.items?.map((item, index) => {
              const category = categories?.categories?.find(
                (category) => category.id === item.toy_category_id
              );

              return (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center text-lg`}
                  >
                    {category?.icon}
                  </div>
                  <span className="text-gray-800 font-medium">
                    x{item.quantity} {category?.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Text */}
        <div className="px-2">
          <div
            className="bg-blue-100 rounded-xl p-3"
            style={{ borderRadius: "12px" }}
          >
            <p
              className="text-center text-sm leading-5 font-medium text-[#5052CB]"
              style={{
                fontFamily: "Nunito, sans-serif",
              }}
            >
              Если вы хотите оставить какую-то игрушку — сообщите об этом
              курьеру при возврате и менеджер свяжется с вами для выкупа
            </p>
          </div>
        </div>
      </div>
      <BottomNavigation
        onHomeClick={() => {}}
        onChildrenClick={() => {}}
        onProfileClick={() => {}}
      />
    </div>
  );
};
