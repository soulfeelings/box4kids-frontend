import React from "react";
import { useTranslation } from "react-i18next";

interface DevModeBannerProps {
  message?: string;
}

export const DevModeBanner: React.FC<DevModeBannerProps> = () => {
  const { t } = useTranslation();
  return (
    <div className="fixed top-0 left-0 w-full bg-yellow-400 text-black text-center py-2 z-50">
      <strong>{t("dev_mode")}</strong> — {t("dev_mode_warning")}
    </div>
  );
};
