import React, { useState, useEffect } from "react";
import { useStore } from "../../store/store";
import {
  useVerifyOtpAuthVerifyOtpPost,
  useSendOtpAuthSendOtpPost,
  useDevGetCodeAuthDevGetCodePost,
} from "../../api-client";

interface CodeStepProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CodeStep: React.FC<CodeStepProps> = ({ onBack, onSuccess }) => {
  const { phoneData, setPhoneData, setError, error } = useStore();
  const [resendTimer, setResendTimer] = useState(60);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const verifyOtpMutation = useVerifyOtpAuthVerifyOtpPost();
  const sendOtpMutation = useSendOtpAuthSendOtpPost();
  const devGetCodeMutation = useDevGetCodeAuthDevGetCodePost();

  // Функция для получения dev кода
  const getDevCode = async (phoneNumber: string): Promise<string | null> => {
    try {
      const response = await devGetCodeMutation.mutateAsync({
        data: { phone_number: phoneNumber },
      });
      return response.code || null;
    } catch (error) {
      console.error("Dev code error:", error);
      return null;
    }
  };

  // Таймер для повторной отправки
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // DEV MODE: Автоматически получаем код при монтировании компонента
  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (phoneData.phone && !phoneData.code) {
      setIsAutoFilling(true);
      id = setTimeout(async () => {
        try {
          const devCode = await getDevCode(phoneData.phone);
          if (devCode) {
            setPhoneData({ code: devCode });
          }
        } catch (error) {
          console.error("Dev code auto-fill failed:", error);
        } finally {
          setIsAutoFilling(false);
        }
      }, 2000);
    }

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [phoneData.phone, phoneData.code, setPhoneData]);

  const handleCheckCode = async () => {
    if (!phoneData.code || phoneData.code.length !== 4) {
      setError("Введите 4-значный код");
      return;
    }

    setError(null);

    try {
      const response = await verifyOtpMutation.mutateAsync({
        data: {
          phone_number: phoneData.phone,
          code: phoneData.code,
        },
      });

      // Сохраняем токены в localStorage
      localStorage.setItem("access_token", response.access_token);
      if (response.refresh_token) {
        localStorage.setItem("refresh_token", response.refresh_token);
      }

      console.log("✅ Аутентификация успешна:", response.user);

      onSuccess();
    } catch (error) {
      setError("Неверный код подтверждения");
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      await sendOtpMutation.mutateAsync({
        data: { phone_number: phoneData.phone },
      });

      setResendTimer(60);
      setError(null);

      // DEV MODE: Автоматически получаем код после повторной отправки
      setIsAutoFilling(true);
      setTimeout(async () => {
        try {
          const devCode = await getDevCode(phoneData.phone);
          if (devCode) {
            setPhoneData({ code: devCode });
          }
        } catch (error) {
          console.error("Dev code auto-fill failed:", error);
        } finally {
          setIsAutoFilling(false);
        }
      }, 2000);
    } catch (error) {
      setError("Не удалось отправить код повторно");
    }
  };

  const handleBack = () => {
    onBack();
  };

  const isCodeValid = phoneData.code.length === 4;
  const isLoading = verifyOtpMutation.isPending;

  return (
    <div
      className="flex flex-col gap-4"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Title and Description */}
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-xl font-medium text-gray-900">Подтвердите номер</h1>
        <p className="text-base font-medium text-gray-500">
          Мы отправили код подтверждения на номер {phoneData.phone}
        </p>
        <button
          onClick={handleBack}
          disabled={isLoading}
          className={`text-base font-medium transition-colors ${
            isLoading
              ? "text-gray-400 cursor-not-allowed"
              : "text-indigo-600 hover:text-indigo-700"
          }`}
        >
          Изменить номер
        </button>
      </div>

      {/* Spacer */}
      <div className="h-4"></div>

      {/* Dev Mode Auto-fill Indicator */}
      {isAutoFilling && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
            <p
              className="text-sm font-medium text-yellow-700"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              🛠️ DEV MODE: Получаем код автоматически...
            </p>
          </div>
        </div>
      )}

      {/* Code Input */}
      <div className="flex flex-col gap-1">
        <div
          className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
            error
              ? "border-red-400"
              : phoneData.code
              ? "border-[#7782F5]"
              : "border-gray-200 focus-within:border-[#7782F5]"
          }`}
        >
          <input
            type="text"
            className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 text-center tracking-widest"
            placeholder="••••"
            value={phoneData.code}
            onChange={(e) => {
              setError(null);
              setPhoneData({
                code: e.target.value.replace(/\D/g, "").slice(0, 4),
              });
            }}
            maxLength={4}
            inputMode="numeric"
            autoFocus
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </div>
        {error && (
          <p
            className="text-red-500 text-sm font-medium px-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleCheckCode}
        disabled={!isCodeValid || isLoading || isAutoFilling}
        className={`w-full py-4 rounded-full font-medium text-base transition-all ${
          isCodeValid && !isLoading && !isAutoFilling
            ? "text-white hover:opacity-80"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
        style={{
          fontFamily: "Nunito, sans-serif",
          backgroundColor:
            isCodeValid && !isLoading && !isAutoFilling ? "#747EEC" : undefined,
        }}
      >
        {isLoading
          ? "Проверяем..."
          : isAutoFilling
          ? "Получаем код..."
          : "Подтвердить"}
      </button>

      {/* Resend Timer */}
      <button
        onClick={resendTimer > 0 ? undefined : handleResendCode}
        disabled={resendTimer > 0 || isLoading || isAutoFilling}
        className={`w-full py-4 font-medium text-base transition-all ${
          resendTimer > 0 || isLoading || isAutoFilling
            ? "text-gray-500 cursor-not-allowed bg-transparent"
            : "text-indigo-600 hover:text-indigo-700 bg-transparent"
        }`}
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        {isLoading
          ? "Отправляем..."
          : isAutoFilling
          ? "Получаем код..."
          : resendTimer > 0
          ? `Получить новый код через ${resendTimer} ${
              resendTimer === 1
                ? "секунду"
                : resendTimer < 5
                ? "секунды"
                : "секунд"
            }`
          : "Отправить код повторно"}
      </button>
    </div>
  );
};
