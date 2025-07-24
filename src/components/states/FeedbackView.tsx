import React from "react";
import { Star, X } from "lucide-react";
import { BottomNavigation } from "../../features/BottomNavigation";
import { useAddBoxReviewToyBoxesBoxIdReviewPost } from "../../api-client";
import type { ToyBoxReviewRequest } from "../../api-client/model";
import { notifications } from "../../utils/notifications";

interface FeedbackViewProps {
  rating: number;
  feedbackComment: string;
  setFeedbackComment: (comment: string) => void;
  setShowFeedback: (show: boolean) => void;
  setRating: (rating: number) => void;
  boxId: number;
  userId: number;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  rating,
  feedbackComment,
  setFeedbackComment,
  setShowFeedback,
  setRating,
  boxId,
  userId,
}) => {
  const addReviewMutation = useAddBoxReviewToyBoxesBoxIdReviewPost();

  // Get feedback text based on rating
  const getFeedbackText = (rating: number) => {
    switch (rating) {
      case 1:
        return { title: "Ужасно", subtitle: "Что можно улучшить?" };
      case 2:
        return { title: "Плохо", subtitle: "Что можно улучшить?" };
      case 3:
        return { title: "Так себе", subtitle: "Что можно улучшить?" };
      case 4:
        return {
          title: "Хорошо",
          subtitle: "Спасибо за оценку!\nЧто вам особенно понравилось?",
        };
      case 5:
        return {
          title: "Отлично",
          subtitle: "Спасибо за оценку!\nЧто вам особенно понравилось?",
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const reviewData: ToyBoxReviewRequest = {
        user_id: userId,
        rating: rating,
        comment: feedbackComment.trim() || null,
      };

      await addReviewMutation.mutateAsync({
        boxId: boxId,
        data: reviewData,
      });

      console.log("Feedback submitted successfully");
      notifications.reviewSubmitted();
      setShowFeedback(false);
      setFeedbackComment("");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      notifications.error("Не удалось отправить отзыв");
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
  };

  const feedbackText = getFeedbackText(rating);

  return (
    <div
      className="w-full bg-white min-h-screen"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">
          Как вам набор игрушек?
        </h1>
        <button
          onClick={handleCloseFeedback}
          disabled={addReviewMutation.isPending}
          className={`p-1 ${
            addReviewMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Stars */}
        <div className="flex justify-center space-x-1 mb-4">
          {[1, 2, 3, 4, 5].map((starRating) => (
            <button
              key={starRating}
              onClick={() => setRating(starRating)}
              disabled={addReviewMutation.isPending}
              className={`focus:outline-none ${
                addReviewMutation.isPending
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              <Star
                size={40}
                className={`${
                  starRating <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Rating text */}
        <div className="text-center mb-2">
          <p className="text-lg font-medium text-gray-800">
            {feedbackText.title}
          </p>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {feedbackText.subtitle}
          </p>
        </div>

        {/* Comment textarea */}
        <div className="mb-8">
          <textarea
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            placeholder="Здесь можно оставить комментарий"
            disabled={addReviewMutation.isPending}
            className={`w-full h-32 p-3 bg-gray-100 rounded-xl resize-none text-sm text-gray-700 placeholder-gray-500 border-none outline-none ${
              addReviewMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmitFeedback}
          disabled={addReviewMutation.isPending}
          className={`w-full py-4 rounded-xl text-sm font-medium ${
            addReviewMutation.isPending
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {addReviewMutation.isPending ? "Отправка..." : "Отправить"}
        </button>
      </div>
      <BottomNavigation
        onHomeClick={() => {}}
        onChildrenClick={() => {}}
        onProfileClick={() => {}}
      />
    </div>
  );
};
