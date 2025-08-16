import { useEffect, useState } from "react";

export const useLandingBreakpoints = () => {
  const [screen, setScreen] = useState<"m" | "t" | "d">("m");

  useEffect(() => {
    if (window.innerWidth >= 1280) {
      setScreen("d");
    } else if (window.innerWidth > 800) {
      setScreen("t");
    } else {
      setScreen("m");
    }
  }, []);

  return {
    isDesktop: screen === "d",
    isMobile: screen === "m",
    isTablet: screen === "t",
  };
};
