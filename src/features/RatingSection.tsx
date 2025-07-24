import React from "react";
import { Star } from "lucide-react";
import { useGetBoxReviewsToyBoxesBoxIdReviewsGet } from "../api-client";
import { UserData } from "../types";

interface BoxesState {
  child: UserData["children"][0];
  currentBox: any;
  nextBox: any;
}

interface RatingSectionProps {
  box: BoxesState;
  rating: number;
  setCurrentBox: (box: BoxesState["currentBox"]) => void;
  handleStarClick: (starIndex: number) => void;
  userId: number;
}

export const RatingSection: React.FC<RatingSectionProps> = ({
  box,
  rating,
  setCurrentBox,
  handleStarClick,
  userId,
}) => {
  const { data: reviewsData } = useGetBoxReviewsToyBoxesBoxIdReviewsGet(
    box.currentBox.id
  );

  // Находим отзыв текущего пользователя
  const userReview = reviewsData?.reviews.find(
    (review) => review.user_id === userId
  );

  if (userReview) {
    // Показываем существующий отзыв
    return (
      <div
        className="p-4 mb-6"
        style={{ backgroundColor: "#747EEC", borderRadius: "24px" }}
      >
        <h3 className="text-white text-center md:text-left font-medium mb-3">
          Ваш отзыв о наборе для {box.child.name}
        </h3>
        <div className="flex justify-center md:justify-start space-x-2 mb-3">
          {[1, 2, 3, 4, 5].map((starRating) => (
            <Star
              key={starRating}
              size={32}
              className={`${
                starRating <= userReview.rating
                  ? "fill-[#FFDB28] text-[#FFDB28]"
                  : "fill-[#BABFF6] text-[#BABFF6]"
              }`}
            />
          ))}
        </div>
        {userReview.comment && (
          <div className="text-center md:text-left">
            <p className="text-white text-sm italic">"{userReview.comment}"</p>
          </div>
        )}
      </div>
    );
  }

  // Показываем форму для заполнения отзыва
  return (
    <div
      className="p-4 mb-6"
      style={{ backgroundColor: "#747EEC", borderRadius: "24px" }}
    >
      <h3 className="text-white font-medium mb-3">
        Как вам текущий набор для {box.child.name}?
      </h3>
      <div className="flex justify-center space-x-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentBox(box.currentBox);
              handleStarClick(index);
            }}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={32}
              className={`${
                index < rating
                  ? "fill-[#FFDB28] text-[#FFDB28]"
                  : "fill-[#BABFF6] text-[#BABFF6]"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
