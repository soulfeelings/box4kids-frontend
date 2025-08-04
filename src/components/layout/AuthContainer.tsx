import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { ROUTES } from "../../constants/routes";
import { useTranslation } from 'react-i18next';

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="flex items-center justify-center px-4 py-3 h-16 relative">
      {/* Language Switcher */}
              <div className="absolute left-4">
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => handleLanguageChange('ru')}
              className={`px-2 py-1 text-xs font-medium transition-all duration-200 ${
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
              className={`px-2 py-1 text-xs font-medium transition-all duration-200 ${
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

      <span className="font-bold text-lg text-gray-800">BOX4BABY</span>
      
      <button
        className="absolute right-4 bg-gray-100 rounded-lg p-1"
        onClick={() => navigate(ROUTES.DEMO)}
      >
        <span className="sr-only">{t('close')}</span>
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="#30313D"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 6l12 12M6 18L18 6" />
        </svg>
      </button>
    </div>
  );
};

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  const { error } = useStore();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AuthHeader />
      <div className="flex flex-col flex-1 px-4 py-8 gap-4 max-w-md w-full mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm mb-2 text-center">
            {error}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
