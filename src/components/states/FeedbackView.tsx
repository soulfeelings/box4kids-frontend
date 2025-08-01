import React from "react";
import { Star, X } from "lucide-react";
import { BottomNavigation } from "../../features/BottomNavigation";
import { useAddBoxReviewToyBoxesBoxIdReviewPost } from "../../api-client";
import type { ToyBoxReviewRequest } from "../../api-client/model";
import { notifications } from "../../utils/notifications";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const addReviewMutation = useAddBoxReviewToyBoxesBoxIdReviewPost();

  // Get feedback text based on rating
  const getFeedbackText = (rating: number) => {
    switch (rating) {
      case 1:
        return { title: t('terrible'), subtitle: t('what_can_be_improved') };
      case 2:
        return { title: t('bad'), subtitle: t('what_can_be_improved') };
      case 3:
        return { title: t('so_so'), subtitle: t('what_can_be_improved') };
      case 4:
        return {
          title: t('good'),
          subtitle: t('thanks_for_rating_what_liked'),
        };
      case 5:
        return {
          title: t('excellent'),
          subtitle: t('thanks_for_rating_what_liked'),
        };
      default:
        return { title: '', subtitle: '' };
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

      console.log('Feedback submitted successfully');
      notifications.reviewSubmitted();
      setShowFeedback(false);
      setFeedbackComment('');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      notifications.error(t('failed_to_send_feedback'));
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
  };

  const feedbackText = getFeedbackText(rating);

  return (
    <div
      className="w-full bg-white min-h-screen"
      style={{ fontFamily: 'Nunito, sans-serif' }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">
          {t('how_do_you_like_the_toy_set')}
        </h1>
        <button
          onClick={handleCloseFeedback}
          disabled={addReviewMutation.isPending}
          className={`p-1 ${addReviewMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              className={`focus:outline-none ${addReviewMutation.isPending ? 'cursor-not-allowed opacity-50' : ''}`}
              aria-label={t('set_rating', { rating: starRating })}
            >
              <Star
                size={40}
                className={
                  starRating <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
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
            placeholder={t('leave_comment_here')}
            disabled={addReviewMutation.isPending}
            className={`w-full h-32 p-3 bg-gray-100 rounded-xl resize-none text-sm text-gray-700 placeholder-gray-500 border-none outline-none ${addReviewMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmitFeedback}
          disabled={addReviewMutation.isPending}
          className={`w-full py-4 rounded-xl text-sm font-medium ${addReviewMutation.isPending ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          {addReviewMutation.isPending ? t('sending') : t('send')}
        </button>
      </div>
      <BottomNavigation
        onHomeClick={() => {
          navigate(ROUTES.APP.ROOT);
        }}
        onChildrenClick={() => {
          navigate(ROUTES.APP.CHILDREN);
        }}
        onProfileClick={() => {
          navigate(ROUTES.APP.PROFILE);
        }}
      />
    </div>
  );
};
