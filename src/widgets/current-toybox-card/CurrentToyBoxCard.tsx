import React from "react";
import { RatingSection } from "../../features/RatingSection";
import { useGetAllToyCategoriesToyCategoriesGet } from "../../api-client";
import { dateManager } from "../../utils/date/DateManager";
import { SuccessfulBoxesState } from "../../pages/AppInterface";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const { data: categories } = useGetAllToyCategoriesToyCategoriesGet();


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
              {t('current_set_for_child', { name: box.child.name })}
            </h2>
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
          {t('show_all_toys')}
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
