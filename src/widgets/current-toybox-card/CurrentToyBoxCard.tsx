import React from "react";
import { RatingSection } from "../../features/RatingSection";
import { useGetAllToyCategoriesToyCategoriesGet } from "../../api-client";
import { dateManager } from "../../utils/date/DateManager";
import { SuccessfulBoxesState } from "../../pages/AppInterface";
import { SubscriptionStatus } from "../../api-client/model";
import { useSubscriptionPlan } from "../../store/hooks/useSubscription";

interface CurrentToyBoxCardProps {
  box: SuccessfulBoxesState;
  rating: number;
  setCurrentBox: (box: SuccessfulBoxesState["currentBox"]) => void;
  handleStarClick: (starIndex: number) => void;
  userId: number;
}

export const CurrentToyBoxCard: React.FC<CurrentToyBoxCardProps> = ({
  box,
  rating,
  setCurrentBox,
  handleStarClick,
  userId,
}) => {
  const { data: categories } = useGetAllToyCategoriesToyCategoriesGet();

  // Получаем активную подписку ребенка
  const activeSubscription = box.child.subscriptions.find(
    (sub) => sub.status === SubscriptionStatus.active
  );

  // Получаем план подписки
  const subscriptionPlan = useSubscriptionPlan(activeSubscription?.plan_id);

  return (
    <React.Fragment>
      {/* Current ToyBox Card */}
      <div
        className="p-4 mb-4"
        style={{ backgroundColor: "#F0955E", borderRadius: "24px" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-3">
          <div>
            <h2 className="text-white font-medium">
              Текущий набор для {box.child.name}
            </h2>
            {subscriptionPlan && (
              <p className="text-white text-center md:text-left text-sm opacity-90">
                {subscriptionPlan.name}
              </p>
            )}
          </div>
          <span className="text-white text-sm">
            {dateManager.formatFullDeliveryDateTime(
              box.currentBox.delivery_date ?? "",
              box.currentBox.delivery_time ?? ""
            )}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {box.currentBox.items?.slice(0, 2).map((item: any, index: number) => {
            const category = categories?.categories.find(
              (category) => category.id === item.toy_category_id
            );
            return (
              <div key={index} className="flex items-center text-white">
                <div className="w-6 h-6 rounded-full bg-white/50 mr-3 flex items-center justify-center text-xs">
                  {category?.icon}
                </div>
                <span className="text-sm">
                  x{item.quantity} {category?.name}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setCurrentBox(box.currentBox)}
          className="w-full text-white py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: "#F4B58E" }}
        >
          Показать все игрушки
        </button>
      </div>

      {/* Rating Section */}
      {box.currentBox.status === "delivered" && (
        <RatingSection
          box={box}
          rating={rating}
          setCurrentBox={setCurrentBox}
          handleStarClick={handleStarClick}
          userId={userId}
        />
      )}
    </React.Fragment>
  );
};
