import React from "react";
import { useGetAllToyCategoriesToyCategoriesGet } from "../../api-client";
import { dateManager } from "../../utils/date/DateManager";
import { SuccessfulBoxesState } from "../../pages/AppInterface";
import { SubscriptionStatus } from "../../api-client/model";
import { useSubscriptionPlan } from "../../store/hooks/useSubscription";
import { useNavigateToEditChild } from "../../hooks/useNavigateHooks";

interface NextToyBoxCardProps {
  box: SuccessfulBoxesState;
}

export const NextToyBoxCard: React.FC<NextToyBoxCardProps> = ({ box }) => {
  const { data: categories } = useGetAllToyCategoriesToyCategoriesGet();
  const navigateToEditChild = useNavigateToEditChild();

  // Получаем активную подписку ребенка
  const activeSubscription = box.child.subscriptions.find(
    (sub) => sub.status === SubscriptionStatus.active
  );

  // Получаем план подписки
  const subscriptionPlan = useSubscriptionPlan(activeSubscription?.plan_id);

  return (
    <div
      className="p-4 flex-1"
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "24px",
        marginTop: "16px",
        marginLeft: "16px",
        marginRight: "16px",
      }}
    >
      <div className="mb-4">
        <h3 className="text-gray-800 font-medium">
          Следующий набор для {box.child.name}
        </h3>
        {subscriptionPlan && (
          <p className="text-gray-600 text-sm">{subscriptionPlan.name}</p>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {box.nextBox.items?.map((item, index: number) => {
          const category = categories?.categories.find(
            (category) => category.id === item.category_id
          );
          return (
            <div key={index} className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs">
                {category?.icon}
              </div>
              <span className="text-sm">
                x{item.quantity} {category?.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Delivery Info */}
      <div
        className="p-4 mb-4"
        style={{ backgroundColor: "#F2F2F2", borderRadius: "16px" }}
      >
        <div>
          <p className="text-gray-600 text-sm mb-1">Доставка</p>
          <p className="text-gray-800 font-medium">
            {dateManager.formatFullDeliveryDateTime(
              box.nextBox.delivery_date ?? "",
              box.nextBox.delivery_time ?? ""
            )}
          </p>
        </div>
      </div>

      {/* Change Interests Button */}
      <button
        onClick={() => navigateToEditChild({ childId: box.child.id })}
        className="w-full text-gray-600 py-3 text-sm font-medium mb-8"
        style={{ backgroundColor: "#E3E3E3", borderRadius: "32px" }}
      >
        Изменить интересы ребенка
      </button>
    </div>
  );
};
