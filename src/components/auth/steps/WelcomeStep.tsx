import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const welcomeScreens = [
  {
    img: "/illustrations/welcome1.png",
    titleKey: 'welcome_title_1',
    descKey: 'welcome_desc_1',
  },
  {
    img: "/illustrations/welcome2.png",
    titleKey: 'welcome_title_2',
    descKey: 'welcome_desc_2',
  },
  {
    img: "/illustrations/welcome3.png",
    titleKey: 'welcome_title_3',
    descKey: 'welcome_desc_3',
  },
];

export const WelcomeStep: React.FC<{ onNext: () => void; onClose?: () => void }> = ({ onNext, onClose }) => {
  const { t } = useTranslation();
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const w = welcomeScreens[welcomeIndex];
  const handleNext = () => {
    if (welcomeIndex < welcomeScreens.length - 1) {
      setWelcomeIndex(welcomeIndex + 1);
    } else {
      onNext();
    }
  };
  const handleBack = () => {
    if (welcomeIndex > 0) setWelcomeIndex(welcomeIndex - 1);
  };
  useEffect(() => {
    localStorage.setItem("hasSeenWelcome", "true");
  }, []);
  return (
    <div
      className="fixed inset-0 w-full h-full flex flex-col "
      style={{
        background: "linear-gradient(180deg, #747EEC 0%, #9098F0 100%)",
      }}
    >
      {/* Header with company name, back and close button */}
      <div className="flex justify-between items-center px-4 py-4 relative z-10">
        {/* Back button (only for 2 and 3 screens) */}
        {welcomeIndex > 0 ? (
          <button
            onClick={handleBack}
            className="flex items-center justify-center"
            style={{ minWidth: 40, minHeight: 40 }}
            aria-label="Назад"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7H1M1 7L7 13M1 7L7 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : <div style={{ width: 40 }} />}
        <h1
          className="text-white font-semibold text-base"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          BOX4BABY
        </h1>
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
          style={{ backgroundColor: '#F2F2F2' }}
          aria-label="Закрыть"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#747EEC"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Illustration area - takes remaining space above bottom container */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{ height: "calc(100vh - 33.33vh - 4rem)" }}
      >
        <img
          src={w.img}
          alt="welcome"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
      {/* Bottom container with text and button - fixed at 1/3 of screen */}
      <div
        className="bg-[#747EEC] px-4 py-6 flex flex-col justify-center"
        style={{ height: "33.33vh", minHeight: "280px" }}
      >
        <h2
          className="font-bold text-2xl mb-4 text-white text-center"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          {t(w.titleKey)}
        </h2>
        <p
          className="text-base text-white/90 text-center mb-6 max-w-sm mx-auto"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          {t(w.descKey)}
        </p>
        <div className="px-4">
          <button
            onClick={handleNext}
            className="w-full bg-white text-[#747EEC] py-4 rounded-[32px] font-semibold text-base"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            {welcomeIndex < welcomeScreens.length - 1 ? t('next') : t('start')}
          </button>
        </div>
      </div>
    </div>
  );
};
