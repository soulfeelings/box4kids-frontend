import React, { useEffect, useState } from "react";

const welcomeScreens = [
  {
    img: "/illustrations/welcome1.png",
    title: "Игрушки, которые радуют!",
    desc: "Настройте персональную коробку с игрушками для вашего ребенка.",
  },
  {
    img: "/illustrations/welcome2.png",
    title: "Чисто и безопасно!",
    desc: "Каждая игрушка проходит полную дезинфекцию перед доставкой. Всё безопасно даже для малышей.",
  },
  {
    img: "/illustrations/welcome3.png",
    title: "Всё просто и без стресса!",
    desc: "Новый набор — каждые 2 недели. Любимые игрушки можно оставить.",
  },
];

export const WelcomeStep: React.FC<{
  onNext: () => void;
}> = ({ onNext }) => {
  const [welcomeIndex, setWelcomeIndex] = useState(0);

  const w = welcomeScreens[welcomeIndex];

  const handleNext = () => {
    if (welcomeIndex < welcomeScreens.length - 1) {
      setWelcomeIndex(welcomeIndex + 1);
    } else {
      onNext();
    }
  };

  // const handleClose = () => {
  //   onClose();
  // };

  useEffect(() => {
    localStorage.setItem("hasSeenWelcome", "true");
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full flex flex-col"
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
        {/* <button
          onClick={handleClose}
          className="absolute right-4 w-6 h-6 rounded-lg bg-white flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
          style={{ color: "#6667C4" }}
        >
          ×
        </button> */}
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
          {w.title}
        </h2>
        <p
          className="text-base text-white/90 text-center mb-6 max-w-sm mx-auto"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          {w.desc}
        </p>

        <div className="px-4">
          <button
            onClick={handleNext}
            className="w-full bg-white text-[#747EEC] py-4 rounded-[32px] font-semibold text-base"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            {welcomeIndex < welcomeScreens.length - 1 ? "Далее" : "Начать"}
          </button>
        </div>
      </div>
    </div>
  );
};
