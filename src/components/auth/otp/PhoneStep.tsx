import React, { useCallback, useEffect } from "react";
import { useStore } from "../../../store/store";
import { useSendOtpAuthSendOtpPost } from "../../../api-client";
import { PHONE_MIN_LENGTH } from "../../../constants/phone";
import { useTranslation } from 'react-i18next';

interface PhoneStepProps {
  onSuccess: () => void;
}

export const PhoneStep: React.FC<PhoneStepProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { phoneData, setPhoneData, setError } = useStore();

  const sendOtpMutation = useSendOtpAuthSendOtpPost();

  const handleSendCode = useCallback(async () => {
    setError(null);

    if (phoneData.phone.length < PHONE_MIN_LENGTH) {
      setError(t('enter_valid_phone_number'));
      return;
    }

    try {
      await sendOtpMutation.mutateAsync({
        data: { phone_number: phoneData.phone },
      });

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : t('failed_to_send_code')
      );
    }
  }, [phoneData.phone, sendOtpMutation, setError, onSuccess, t]);

  useEffect(() => {
    return () => {
      setPhoneData({ code: "" });
    };
  }, [setPhoneData]);

  const isPhoneValid = phoneData.phone.length >= PHONE_MIN_LENGTH;
  const isLoading = sendOtpMutation.isPending;

  return (
    <div
      className="flex flex-col gap-4"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Title and Description */}
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-xl font-medium text-gray-900">
          {t('login_or_register')}
        </h1>
        <p className="text-base font-medium text-gray-600">
          {t('enter_phone_number_and_we_will_send_code')}
        </p>
      </div>

      {/* Spacer */}
      <div className="h-4"></div>

      {/* Phone Input */}
      <div className="flex flex-col gap-1">
        <div
          className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
            phoneData.phone
              ? "border-[#7782F5]"
              : "border-gray-200 focus-within:border-[#7782F5]"
          }`}
        >
          <input
            type="tel"
            className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
            placeholder="+998"
            value={phoneData.phone}
            onChange={(e) =>
              setPhoneData({ phone: e.target.value.replace(/[^\d+]/g, "") })
            }
            maxLength={17}
            inputMode="tel"
            autoFocus
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </div>
        {sendOtpMutation.error && (
          <p
            className="text-red-500 text-sm font-medium px-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {sendOtpMutation.error.detail?.[0]?.msg || t('code_sending_error')}
          </p>
        )}
      </div>

      {/* Send Code Button */}
      <button
        onClick={handleSendCode}
        disabled={!isPhoneValid || isLoading}
        className={`w-full py-4 rounded-full font-medium text-base transition-all ${
          isPhoneValid && !isLoading
            ? "text-white hover:opacity-80"
            : "bg-gray-200 text-gray-500"
        }`}
        style={{
          fontFamily: "Nunito, sans-serif",
          backgroundColor: isPhoneValid && !isLoading ? "#747EEC" : undefined,
        }}
      >
        {isLoading ? t('sending') : t('get_code')}
      </button>

      {/* Spacer */}
      <div className="h-8"></div>

      {/* Legal Text */}
      <p className="text-sm font-medium text-gray-500 text-center leading-relaxed">
        {t('legal_agreement_text')}
      </p>
    </div>
  );
};
