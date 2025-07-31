import React from "react";
import { useTranslation } from 'react-i18next';

export interface ErrorComponentProps {
  errorMessage?: string | null;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
}

export const ErrorComponent: React.FC<ErrorComponentProps> = ({
  errorMessage,
  onBack,
  onRetry,
  onSupport,
}) => {
  const { t } = useTranslation();
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleSupport = () => {
    if (onSupport) {
      onSupport();
    } else {
      window.open("mailto:support@box4baby.com", "_blank");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-11/12 max-w-sm text-center relative">
        <div className="mb-8">
          <h2 className="text-gray-800 text-lg font-semibold tracking-wide">
            BOX4BABY
          </h2>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-8">
            <div className="w-30 h-30 rounded-full bg-red-100 flex justify-center items-center">
              <div className="w-15 h-15 rounded-full bg-red-500 flex justify-center items-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h3 className="text-gray-800 text-2xl font-semibold mb-4">
            {t('error_loading_data')}
          </h3>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <p className="text-gray-600 text-base leading-relaxed max-w-xs mb-8">
            {t('try_reload_or_support')}
          </p>

          <div className="w-full space-y-3">
            {onBack && (
              <button
                onClick={handleBack}
                className="w-full bg-gray-800 text-white py-3 px-6 rounded-full font-medium hover:bg-gray-700 transition-colors"
              >
                {t('back')}
              </button>
            )}
            <button
              onClick={handleRetry}
              className="w-full bg-gray-800 text-white py-3 px-6 rounded-full font-medium hover:bg-gray-700 transition-colors"
            >
              {t('reload')}
            </button>

            <button
              onClick={handleSupport}
              className="w-full bg-transparent text-gray-600 py-3 px-6 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {t('contact_support')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
