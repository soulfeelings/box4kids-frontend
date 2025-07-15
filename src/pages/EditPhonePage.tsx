import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { BottomNavigation } from "../features/BottomNavigation";
import { DevModeBanner } from "../features/DevModeBanner";
import {
  useSendOtpAuthSendOtpPost,
  useVerifyOtpAuthVerifyOtpPost,
  useDevGetCodeAuthDevGetCodePost,
  useInitiatePhoneChangeAuthChangePhoneInitiatePost,
  useConfirmPhoneChangeAuthChangePhoneConfirmPost,
} from "../api-client";
import { SECONDS_TO_RESEND_CODE, PHONE_MIN_LENGTH } from "../constants/phone";
import { notifications } from "../utils/notifications";
import { useStore } from "../store/store";

interface EditPhonePageProps {
  currentPhone: string;
  onClose: () => void;
  onSave: (newPhone: string) => void;
}

// Step enums for clarity
enum Step {
  CurrentPhoneConfirm = 0,
  CurrentPhoneCode = 1,
  NewPhoneCode = 2,
}

export const EditPhonePage: React.FC<EditPhonePageProps> = ({
  currentPhone,
  onClose,
  onSave,
}) => {
  const { setUserPhone } = useStore();
  const [step, setStep] = useState<Step>(Step.CurrentPhoneConfirm);
  const [currentCode, setCurrentCode] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCode, setNewCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // API мутации
  const sendOtpMutation = useSendOtpAuthSendOtpPost();
  const verifyOtpMutation = useVerifyOtpAuthVerifyOtpPost();
  const devGetCodeMutation = useDevGetCodeAuthDevGetCodePost();
  const initiatePhoneChangeMutation =
    useInitiatePhoneChangeAuthChangePhoneInitiatePost();
  const confirmPhoneChangeMutation =
    useConfirmPhoneChangeAuthChangePhoneConfirmPost();

  // Состояния загрузки
  const [isAutoFillingCurrent, setIsAutoFillingCurrent] = useState(false);
  const [isAutoFillingNew, setIsAutoFillingNew] = useState(false);

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

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle sending code to current phone
  const handleSendCodeToCurrent = async () => {
    setError(null);

    try {
      await sendOtpMutation.mutateAsync({
        data: { phone_number: currentPhone },
      });

      setStep(Step.CurrentPhoneCode);
      setResendTimer(SECONDS_TO_RESEND_CODE);
      notifications.success("Код отправлен на текущий номер");

      // DEV MODE: Автоматически получаем код
      setIsAutoFillingCurrent(true);
      setTimeout(async () => {
        try {
          const devCode = await getDevCode(currentPhone);
          if (devCode) {
            setCurrentCode(devCode);
          }
        } catch (error) {
          console.error("Dev code auto-fill failed:", error);
        } finally {
          setIsAutoFillingCurrent(false);
        }
      }, 2000);
    } catch (error) {
      setError("Не удалось отправить код на текущий номер");
      notifications.error("Не удалось отправить код");
    }
  };

  // Handle verifying current phone code
  const handleVerifyCurrentCode = async () => {
    if (currentCode.length !== 4) {
      setError("Введите 4-значный код");
      return;
    }

    setError(null);

    try {
      // Проверяем код текущего номера и инициируем смену
      await initiatePhoneChangeMutation.mutateAsync({
        data: {
          current_phone_code: currentCode,
          new_phone: newPhone,
        },
      });

      console.log("✅ Подтверждение текущего номера успешно");
      notifications.success("Код отправлен на новый номер.");
      setStep(Step.NewPhoneCode);
      setResendTimer(SECONDS_TO_RESEND_CODE);

      // DEV MODE: Автоматически получаем код для нового номера
      setIsAutoFillingNew(true);
      setTimeout(async () => {
        try {
          const devCode = await getDevCode(newPhone);
          if (devCode) {
            setNewCode(devCode);
          }
        } catch (error) {
          console.error("Dev code auto-fill failed:", error);
        } finally {
          setIsAutoFillingNew(false);
        }
      }, 2000);
    } catch (error) {
      setError("Неверный код подтверждения");
      notifications.error("Неверный код подтверждения");
    }
  };

  // Handle sending code to new phone (теперь код отправляется автоматически при инициации)
  const handleSendCodeToNew = async () => {
    if (newPhone.length < PHONE_MIN_LENGTH) {
      setError("Введите корректный номер телефона");
      return;
    }

    setError(null);
    setStep(Step.CurrentPhoneCode);
  };

  // Handle verifying new phone code
  const handleVerifyNewCode = async () => {
    if (newCode.length !== 4) {
      setError("Введите 4-значный код");
      return;
    }

    setError(null);

    try {
      const response = await confirmPhoneChangeMutation.mutateAsync({
        data: {
          new_phone: newPhone,
          new_phone_code: newCode,
        },
      });

      // Сохраняем новые токены в localStorage
      localStorage.setItem("access_token", response.access_token);
      if (response.refresh_token) {
        localStorage.setItem("refresh_token", response.refresh_token);
      }

      console.log("✅ Смена номера телефона успешна:", response.user);
      notifications.success("Номер телефона успешно изменен!");

      // Обновляем номер телефона в store
      setUserPhone(newPhone);

      onSave(newPhone);
      onClose();
    } catch (error) {
      setError("Неверный код подтверждения");
      notifications.error("Неверный код подтверждения");
    }
  };

  // Handle resending code
  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    if (step === Step.CurrentPhoneCode) {
      // Повторная отправка кода на текущий номер
      try {
        await sendOtpMutation.mutateAsync({
          data: { phone_number: currentPhone },
        });

        setResendTimer(SECONDS_TO_RESEND_CODE);
        setError(null);
        notifications.success("Код отправлен повторно");

        // DEV MODE: Автоматически получаем код
        setIsAutoFillingCurrent(true);
        setTimeout(async () => {
          try {
            const devCode = await getDevCode(currentPhone);
            if (devCode) {
              setCurrentCode(devCode);
            }
          } catch (error) {
            console.error("Dev code auto-fill failed:", error);
          } finally {
            setIsAutoFillingCurrent(false);
          }
        }, 2000);
      } catch (error) {
        setError("Не удалось отправить код повторно");
        notifications.error("Не удалось отправить код повторно");
      }
    } else if (step === Step.NewPhoneCode) {
      // Повторная отправка кода на новый номер
      try {
        await initiatePhoneChangeMutation.mutateAsync({
          data: {
            current_phone_code: currentCode,
            new_phone: newPhone,
          },
        });

        setResendTimer(SECONDS_TO_RESEND_CODE);
        setError(null);
        notifications.success("Код отправлен повторно");

        // DEV MODE: Автоматически получаем код
        setIsAutoFillingNew(true);
        setTimeout(async () => {
          try {
            const devCode = await getDevCode(newPhone);
            if (devCode) {
              setNewCode(devCode);
            }
          } catch (error) {
            console.error("Dev code auto-fill failed:", error);
          } finally {
            setIsAutoFillingNew(false);
          }
        }, 2000);
      } catch (error) {
        setError("Не удалось отправить код повторно");
        notifications.error("Не удалось отправить код повторно");
      }
    }
  };

  // Handle back navigation
  const handleBack = () => {
    switch (step) {
      case Step.CurrentPhoneCode:
        setStep(Step.CurrentPhoneConfirm);
        break;
      case Step.NewPhoneCode:
        setStep(Step.CurrentPhoneCode);
        break;
      default:
        onClose();
    }
  };

  const renderStep = () => {
    const isNewPhoneValid = newPhone.length >= PHONE_MIN_LENGTH;

    switch (step) {
      case Step.CurrentPhoneConfirm:
        return (
          <div
            className="flex flex-col gap-6 flex-1 justify-between"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            <div className="flex-1 flex flex-col gap-6">
              {/* Warning Notice */}
              <div className="bg-orange-100 rounded-lg p-4 border border-orange-200">
                <p className="text-sm font-medium text-orange-800 text-center">
                  После изменения номера телефона изменится номер для входа в
                  сервис.
                </p>
              </div>

              {/* Instructions */}
              <div className="text-center">
                <p className="text-base font-medium text-gray-700">
                  Мы отправим код подтверждения на ваш текущий номер{" "}
                  {currentPhone}
                </p>
              </div>
            </div>

            {/* Send Code Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSendCodeToCurrent}
                disabled={sendOtpMutation.isPending}
                className={`w-full py-4 rounded-full font-medium text-base transition-all ${
                  sendOtpMutation.isPending
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "text-white hover:opacity-80"
                }`}
                style={{
                  fontFamily: "Nunito, sans-serif",
                  backgroundColor: sendOtpMutation.isPending
                    ? undefined
                    : "#30313D",
                }}
              >
                {sendOtpMutation.isPending ? "Отправляем..." : "Получить код"}
              </button>
            </div>
          </div>
        );

      case Step.CurrentPhoneCode:
        const isCurrentCodeValid = currentCode.length === 4;
        return (
          <div
            className="flex flex-col gap-6 justify-between"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            <div>
              {/* Warning Notice */}
              <div className="bg-orange-100 rounded-lg p-4 border border-orange-200 mb-6">
                <p className="text-sm font-medium text-orange-800 text-center">
                  После изменения номера телефона изменится номер для входа в
                  сервис.
                </p>
              </div>

              {/* Instructions */}
              <div className="text-center mb-6">
                <p className="text-base font-medium text-gray-700">
                  Введите код подтверждения для текущего номера {currentPhone}
                </p>
              </div>

              {/* New Phone Input */}
              <div className="flex flex-col gap-1 mb-6">
                <label className="text-sm font-medium text-gray-700 px-3">
                  Новый номер телефона
                </label>
                <div
                  className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                    newPhone
                      ? "border-[#7782F5]"
                      : "border-gray-200 focus-within:border-[#7782F5]"
                  }`}
                >
                  <input
                    type="tel"
                    className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
                    placeholder="+998"
                    value={newPhone}
                    onChange={(e) =>
                      setNewPhone(e.target.value.replace(/[^\d+]/g, ""))
                    }
                    maxLength={17}
                    inputMode="tel"
                    autoFocus
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  />
                </div>
              </div>

              {/* Dev Mode Auto-fill Indicator */}
              {isAutoFillingCurrent && <DevModeBanner />}

              {/* Code Input */}
              <div className="flex flex-col gap-1 mb-6">
                <label className="text-sm font-medium text-gray-700 px-3">
                  Код подтверждения
                </label>
                <div
                  className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                    error
                      ? "border-red-400"
                      : currentCode
                      ? "border-[#7782F5]"
                      : "border-gray-200 focus-within:border-[#7782F5]"
                  }`}
                >
                  <input
                    type="text"
                    className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 text-center tracking-widest"
                    placeholder="••••"
                    value={currentCode}
                    onChange={(e) => {
                      setError(null);
                      setCurrentCode(
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      );
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

              {/* Resend Timer */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Получить новый код через {resendTimer} секунд
                    {resendTimer === 1 ? "у" : resendTimer < 5 ? "ы" : ""}
                  </p>
                ) : (
                  <button
                    onClick={handleResendCode}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Получить новый код
                  </button>
                )}
              </div>
            </div>

            {/* Verify Button */}
            <div className="mt-4">
              <button
                onClick={handleVerifyCurrentCode}
                disabled={
                  !isCurrentCodeValid ||
                  !isNewPhoneValid ||
                  initiatePhoneChangeMutation.isPending ||
                  isAutoFillingCurrent
                }
                className={`w-full py-4 rounded-full font-medium text-base transition-all ${
                  isCurrentCodeValid &&
                  isNewPhoneValid &&
                  !initiatePhoneChangeMutation.isPending &&
                  !isAutoFillingCurrent
                    ? "text-white hover:opacity-80"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                style={{
                  fontFamily: "Nunito, sans-serif",
                  backgroundColor:
                    isCurrentCodeValid &&
                    isNewPhoneValid &&
                    !initiatePhoneChangeMutation.isPending &&
                    !isAutoFillingCurrent
                      ? "#30313D"
                      : undefined,
                }}
              >
                {initiatePhoneChangeMutation.isPending
                  ? "Проверяем..."
                  : isAutoFillingCurrent
                  ? "Получаем код..."
                  : "Подтвердить"}
              </button>
            </div>
          </div>
        );

      case Step.NewPhoneCode:
        const isNewCodeValid = newCode.length === 4;
        return (
          <div
            className="flex flex-col flex-1 gap-6 justify-between"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            <div>
              {/* Instructions */}
              <div className="text-center mb-6">
                <p className="text-base font-medium text-gray-700">
                  Мы отправили код подтверждения на номер {newPhone}
                </p>
                <button
                  onClick={handleBack}
                  className="text-base font-medium text-indigo-600 hover:text-indigo-700 transition-colors mt-2"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Изменить номер
                </button>
              </div>

              {/* Dev Mode Auto-fill Indicator */}
              {isAutoFillingNew && <DevModeBanner />}

              {/* Code Input */}
              <div className="flex flex-col gap-1 mb-6">
                <div
                  className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
                    error
                      ? "border-red-400"
                      : newCode
                      ? "border-[#7782F5]"
                      : "border-gray-200 focus-within:border-[#7782F5]"
                  }`}
                >
                  <input
                    type="text"
                    className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 text-center tracking-widest"
                    placeholder="••••"
                    value={newCode}
                    onChange={(e) => {
                      setError(null);
                      setNewCode(e.target.value.replace(/\D/g, "").slice(0, 4));
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

              {/* Resend Timer */}
              <div className="text-center mb-6">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Получить новый код через {resendTimer} секунд
                    {resendTimer === 1 ? "у" : resendTimer < 5 ? "ы" : ""}
                  </p>
                ) : (
                  <button
                    onClick={handleResendCode}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Получить новый код
                  </button>
                )}
              </div>
            </div>
            {/* Verify Button */}
            <div className="mt-4">
              <button
                onClick={handleVerifyNewCode}
                disabled={
                  !isNewCodeValid ||
                  confirmPhoneChangeMutation.isPending ||
                  isAutoFillingNew
                }
                className={`w-full py-4 rounded-full font-medium text-base transition-all ${
                  isNewCodeValid &&
                  !confirmPhoneChangeMutation.isPending &&
                  !isAutoFillingNew
                    ? "text-white hover:opacity-80"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                style={{
                  fontFamily: "Nunito, sans-serif",
                  backgroundColor:
                    isNewCodeValid &&
                    !confirmPhoneChangeMutation.isPending &&
                    !isAutoFillingNew
                      ? "#30313D"
                      : undefined,
                }}
              >
                {confirmPhoneChangeMutation.isPending
                  ? "Проверяем..."
                  : isAutoFillingNew
                  ? "Получаем код..."
                  : "Подтвердить"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FFFFFF] pb-20"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-center relative">
          <h1 className="text-[20px] font-semibold text-gray-900 text-center">
            Изменить номер
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
      <div className="px-4 py-6 flex-1 flex flex-col">{renderStep()}</div>

      <BottomNavigation />
    </div>
  );
};
