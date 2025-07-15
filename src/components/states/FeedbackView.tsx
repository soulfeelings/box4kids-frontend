import React from "react";
import { Star, X } from "lucide-react";
import { BottomNavigation } from "../../features/BottomNavigation";

interface FeedbackViewProps {
  rating: number;
  feedbackComment: string;
  setFeedbackComment: (comment: string) => void;
  setShowFeedback: (show: boolean) => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  rating,
  feedbackComment,
  setFeedbackComment,
  setShowFeedback,
}) => {
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

  const handleSubmitFeedback = () => {
    // Here you would typically send the feedback to your backend
    console.log("Feedback submitted:", { rating, comment: feedbackComment });
    setShowFeedback(false);
    setFeedbackComment("");
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
        <button onClick={handleCloseFeedback} className="p-1">
          <X size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Stars */}
        <div className="flex justify-center space-x-1 mb-4">
          {[0, 1, 2, 3, 4].map((index) => (
            <Star
              key={index}
              size={40}
              className={`${
                index < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
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
            className="w-full h-32 p-3 bg-gray-100 rounded-xl resize-none text-sm text-gray-700 placeholder-gray-500 border-none outline-none"
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmitFeedback}
          className="w-full bg-gray-800 text-white py-4 rounded-xl text-sm font-medium"
        >
          Отправить
        </button>
      </div>
      <BottomNavigation
        currentScreen="home"
        onHomeClick={() => {}}
        onChildrenClick={() => {}}
        onProfileClick={() => {}}
      />
    </div>
  );
};
