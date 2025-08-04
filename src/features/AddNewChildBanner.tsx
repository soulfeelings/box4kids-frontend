import { useTranslation } from 'react-i18next';

export const AddNewChildBanner = ({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-2xl p-4 text-center ${className}`}
      style={{ backgroundColor: "#747EEC" }}
      onClick={onClick}
    >
      <p className="text-white font-medium mb-2">{t('add_another_child')}</p>
      <p className="text-white text-sm mb-3">
        {t('get_20_percent_discount_next_box')}
      </p>
      <button className="bg-white/30 text-white w-full px-6 py-1 rounded-2xl font-medium text-sm">
        {t('add_child')}
      </button>
    </div>
  );
};
