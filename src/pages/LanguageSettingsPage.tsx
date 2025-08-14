import React from "react";
import { X } from "lucide-react";
import { BottomNavigation } from "../features/BottomNavigation";
import { useTranslation } from "react-i18next";

interface LanguageSettingsPageProps {
  onClose: () => void;
}

export const LanguageSettingsPage: React.FC<LanguageSettingsPageProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      window.location.reload();
    });
  };

  return (
    <div
      className="min-h-screen bg-[#FFFFFF] pb-20"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-center relative">
          <h1 className="text-[20px] font-semibold text-gray-900 text-center">
            {t('language_change')}
          </h1>
          <button
            onClick={onClose}
            className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-2">
        <button
          onClick={() => handleChange('ru')}
          className="w-full bg-[#FFFFFF] rounded-lg px-4 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <div className="bg-[#F2F2F2] rounded-[12px] w-10 h-10 flex items-center justify-center mr-3 text-sm font-medium">RU</div>
            <span className="text-base text-gray-900 font-medium">Русский</span>
          </div>
          {currentLanguage === 'ru' && (
            <span className="text-xs text-white bg-[#747EEC] rounded-full px-2 py-1">{t('selected')}</span>
          )}
        </button>

        <button
          onClick={() => handleChange('uz')}
          className="w-full bg-[#FFFFFF] rounded-lg px-4 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <div className="bg-[#F2F2F2] rounded-[12px] w-10 h-10 flex items-center justify-center mr-3 text-sm font-medium">UZ</div>
            <span className="text-base text-gray-900 font-medium">Oʻzbekcha</span>
          </div>
          {currentLanguage === 'uz' && (
            <span className="text-xs text-white bg-[#747EEC] rounded-full px-2 py-1">{t('selected')}</span>
          )}
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};


