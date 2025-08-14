import { useTranslation } from 'react-i18next';

export const NoSubscribtionsView = ({
  onClickButton,
  textButton,
  text,
}: {
  onClickButton: () => void;
  textButton: string;
  text?: string;
}) => {
  const { t } = useTranslation();
  return (
    <div
      className="relative flex flex-col rounded-3xl overflow-hidden"
      style={{
        backgroundColor: "#747EEC",
        height: "50vh",
        minHeight: "400px",
      }}
    >
      {/* Illustration area - takes remaining space above bottom container */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{ height: "calc(50vh - 140px)" }}
      >
        <img
          src="/illustrations/continue.svg"
          alt="Girl with toy box"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      {/* Bottom container with text and button */}
      <div className="px-6 py-4 flex flex-col justify-center">
        <p
          className="text-sm text-white/90 text-center mb-4"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          {text ||
            t('complete_subscription_to_get_toy_box')}
        </p>

        <button
          onClick={onClickButton}
          className="w-full bg-white text-[#30313D] py-3 rounded-3xl font-semibold text-sm"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          {textButton}
        </button>
      </div>
    </div>
  );
};
