import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useStore } from "../../../store/store";
import { useSendOtpAuthSendOtpPost } from "../../../api-client";
import { PHONE_MIN_LENGTH } from "../../../constants/phone";
import { useTranslation } from 'react-i18next';

interface PhoneStepProps {
  onSuccess: () => void;
}

// Маска: 00 000 00 00
function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(0, 9);
  let formatted = "";
  if (digits.length > 0) formatted += digits.slice(0, 2);
  if (digits.length > 2) formatted += " " + digits.slice(2, 5);
  if (digits.length > 5) formatted += " " + digits.slice(5, 7);
  if (digits.length > 7) formatted += " " + digits.slice(7, 9);
  return formatted;
}

const PhoneStepComponent: React.FC<PhoneStepProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { phoneData, setPhoneData, setError } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const sendOtpMutation = useSendOtpAuthSendOtpPost();

  const fullPhoneNumber = useMemo(() => `+998${phoneData.phone}`, [phoneData.phone]);

  const handleSendCode = useCallback(async () => {
    setError(null);

    if (phoneData.phone.length < PHONE_MIN_LENGTH) {
      setError(t('enter_valid_phone_number'));
      return;
    }

    try {
      await sendOtpMutation.mutateAsync({
        data: { phone_number: fullPhoneNumber },
      });

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : t('failed_to_send_code')
      );
    }
  }, [fullPhoneNumber, phoneData.phone, sendOtpMutation, setError, onSuccess, t]);

  // Обработка ввода
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 9); // только цифры, максимум 9
    setPhoneData({ phone: value });
    setError(null);
  }, [setPhoneData, setError]);

  // Валидация: 9 цифр
  const isPhoneValid = useMemo(() => phoneData.phone.length === 9, [phoneData.phone]);
  const isLoading = useMemo(() => sendOtpMutation.isPending, [sendOtpMutation.isPending]);

  const formattedPhone = useMemo(() => formatPhone(phoneData.phone), [phoneData.phone]);

  // Фокус при маунте
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Ошибка при невалидном номере
  useEffect(() => {
    if (phoneData.phone.length > 0 && !isPhoneValid) {
      setError(t('enter_valid_phone_number'));
    } else {
      setError(null);
    }
  }, [phoneData.phone, isPhoneValid, setError, t]);

  useEffect(() => {
    return () => {
      setPhoneData({ code: "" });
    };
  }, [setPhoneData]);

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
          <div className="flex items-center gap-2">
            <span className="text-base font-medium select-none">+998</span>
            <input
              ref={inputRef}
              type="tel"
              className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
              placeholder="00 000 00 00"
              value={formattedPhone}
              onChange={handleInputChange}
              maxLength={12} // 9 цифр + пробелы
              inputMode="tel"
              autoFocus
              style={{ fontFamily: "Nunito, sans-serif" }}
            />
          </div>
        </div>
        {(!!phoneData.phone && !isPhoneValid) && (
          <p
            className="text-red-500 text-sm font-medium px-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {t('enter_valid_phone_number')}
          </p>
        )}
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

export const PhoneStep = React.memo(PhoneStepComponent);
