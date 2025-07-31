import React from "react";
import { X } from "lucide-react";
import { BottomNavigation } from "../features/BottomNavigation";
import { useTranslation } from 'react-i18next';

interface PaymentDataPageProps {
  onClose: () => void;
}

export const PaymentDataPage: React.FC<PaymentDataPageProps> = ({
  onClose,
}) => {
  const { t } = useTranslation();
  
  return (
    <div
      className="min-h-screen bg-[#FFFFFF] pb-20"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-center relative">
          <h1 className="text-[20px] font-semibold text-gray-900 text-center">
            {t('payment_data')}
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
      <div className="px-4 py-6">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              {t('payment_data')}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t('payment_data_description')}
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};
