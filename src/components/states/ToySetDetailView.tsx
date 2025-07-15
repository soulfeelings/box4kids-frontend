import React from "react";
import { ArrowLeft } from "lucide-react";
import { BottomNavigation } from "../../features/BottomNavigation";
import { ToyBoxResponse } from "../../api-client/model/toyBoxResponse";
import { useGetAllToyCategoriesToyCategoriesGet } from "../../api-client";
import { formatFullDeliveryDateTime } from "../../utils/date/dateFormatter";

interface ToySetDetailViewProps {
  currentBox: ToyBoxResponse;
  close: () => void;
}

export const ToySetDetailView: React.FC<ToySetDetailViewProps> = ({
  currentBox,
  close,
}) => {
  const { data: categories } = useGetAllToyCategoriesToyCategoriesGet();

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
          Текущий набор для {currentBox.child_id}
        </h1>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Delivery and Return Info */}
        <div className="bg-gray-200 rounded-xl p-4 mb-4">
          <div className="mb-2">
            <p className="text-gray-600 text-sm">Доставлено</p>
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
          <p className="text-blue-600 text-sm leading-relaxed">
            Если вы хотите оставить какую-то игрушку — сообщите об этом курьеру
            при возврате и менеджер свяжется с вами для выкупа
          </p>
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
