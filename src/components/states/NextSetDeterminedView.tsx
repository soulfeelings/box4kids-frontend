import React from "react";
import { BottomNavigation } from "../../features/BottomNavigation";
import { RatingSection } from "../../features/RatingSection";
import { useGetAllToyCategoriesToyCategoriesGet } from "../../api-client";
import { UserData } from "../../types";
import { formatFullDeliveryDateTime } from "../../utils/date/dateFormatter";
import { SuccessfulBoxesState } from "../../pages/AppInterface";

interface NextSetDeterminedViewProps {
  userData: UserData;
  boxes: SuccessfulBoxesState[];
  rating: number;
  setCurrentBox: (box: SuccessfulBoxesState["currentBox"]) => void;
  handleStarClick: (starIndex: number) => void;
  getCurrentDate: () => string;
  formatDeliveryDate: (dateString: string) => string;
  formatDeliveryTime: (timeString: string) => string;
}

export const NextSetDeterminedView: React.FC<NextSetDeterminedViewProps> = ({
  userData,
  boxes,
  rating,
  setCurrentBox,
  handleStarClick,
}) => {
  const { data: categories } = useGetAllToyCategoriesToyCategoriesGet();

  return (
    <div
      className="w-full min-h-screen pb-24"
      style={{ fontFamily: "Nunito, sans-serif", backgroundColor: "#F2F2F2" }}
    >
      <div
        className="p-4"
        style={{
          backgroundColor: "#FFE8C8",
          opacity: 1,
          borderRadius: "0 0 24px 24px",
          aspectRatio: "46%",
        }}
      >
        <h1 className="text-xl text-center font-semibold text-gray-800 mb-6">
          Привет, {userData.name}! 🦋
        </h1>

        {boxes.map((box) => (
          <React.Fragment key={box.child.id}>
            {/* Current Set Card */}
            <div
              className="p-4 mb-4"
              style={{ backgroundColor: "#F0955E", borderRadius: "24px" }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-3">
                <h2 className="text-white font-medium">
                  Текущий набор для {box.child.name}
                </h2>
                <span className="text-white text-sm">
                  {formatFullDeliveryDateTime(
                    box.currentBox.delivery_date ?? "",
                    box.currentBox.delivery_time ?? ""
                  )}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {box.currentBox.items
                  ?.slice(0, 2)
                  .map((item: any, index: number) => {
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
                userId={userData.id}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {boxes.map((box) => (
        <React.Fragment key={box.child.id}>
          {/* Next Set Section */}
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
            <h3 className="text-gray-800 font-medium mb-4">
              Следующий набор для {box.child.name}
            </h3>

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
                  {formatFullDeliveryDateTime(
                    box.nextBox.delivery_date ?? "",
                    box.nextBox.delivery_time ?? ""
                  )}
                </p>
              </div>
            </div>

            {/* Change Interests Button */}
            <button
              className="w-full text-gray-600 py-3 text-sm font-medium mb-8"
              style={{ backgroundColor: "#E3E3E3", borderRadius: "32px" }}
            >
              Изменить интересы ребенка
            </button>
          </div>
        </React.Fragment>
      ))}

      <BottomNavigation
        onHomeClick={() => {}}
        onChildrenClick={() => {}}
        onProfileClick={() => {}}
      />
    </div>
  );
};
