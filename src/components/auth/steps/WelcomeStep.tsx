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

export const WelcomeStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
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
      {/* Header with company name and close button */}
      <div className="flex justify-center items-center px-4 py-4 relative z-10">
        <h1
          className="text-white font-semibold text-base"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          BOX4BABY
        </h1>
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
