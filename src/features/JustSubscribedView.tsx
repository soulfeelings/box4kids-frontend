import { useTranslation } from 'react-i18next';

interface JustSubscribedViewProps {
  onGoToProfile: () => void;
}

export const JustSubscribedView = ({
  onGoToProfile,
}: JustSubscribedViewProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <img src="/illustrations/ok.svg" alt="Subscribed" className="w-32 mb-6" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t('congratulations_on_subscription')}</h2>
      <p className="text-gray-600 mb-6">{t('your_subscription_is_active')}</p>
      <button
        className="bg-[#7782F5] text-white px-6 py-2 rounded-2xl font-medium text-sm shadow-md hover:bg-[#5a63c7] transition"
        onClick={onGoToProfile}
      >
        {t('go_to_profile')}
      </button>
    </div>
  );
}; 