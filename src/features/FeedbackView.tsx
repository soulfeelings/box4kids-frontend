import { useTranslation } from 'react-i18next';

interface FeedbackViewProps {
  onSubmit: () => void;
  isLoading: boolean;
  feedback: string;
  setFeedback: (value: string) => void;
  isSubmitted: boolean;
}

export const FeedbackView = ({
  onSubmit,
  isLoading,
  feedback,
  setFeedback,
  isSubmitted,
}: FeedbackViewProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t('feedback')}</h2>
      <textarea
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        placeholder={t('your_message')}
        disabled={isLoading || isSubmitted}
      />
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          className="bg-[#7782F5] text-white px-6 py-2 rounded-2xl font-medium text-sm shadow-md hover:bg-[#5a63c7] transition"
          onClick={onSubmit}
          disabled={isLoading || isSubmitted}
        >
          {isSubmitted ? t('thank_you_for_feedback') : t('send')}
        </button>
      </div>
    </div>
  );
}; 