import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => handleLanguageChange('ru')}
          className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
            currentLanguage === 'ru'
              ? 'text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          style={{ 
            fontFamily: 'Nunito, sans-serif',
            backgroundColor: currentLanguage === 'ru' ? '#747EEC' : undefined
          }}
        >
          RU
        </button>
        <div className="w-px bg-gray-200"></div>
        <button
          onClick={() => handleLanguageChange('uz')}
          className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
            currentLanguage === 'uz'
              ? 'text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          style={{ 
            fontFamily: 'Nunito, sans-serif',
            backgroundColor: currentLanguage === 'uz' ? '#747EEC' : undefined
          }}
        >
          UZ
        </button>
      </div>
    </div>
  );
}; 