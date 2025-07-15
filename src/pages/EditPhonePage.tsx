import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { BottomNavigation } from "../features/BottomNavigation";

interface EditPhonePageProps {
  currentPhone: string;
  onClose: () => void;
  onSave: (newPhone: string) => void;
}

// Step enums for clarity
enum Step {
  CurrentPhoneConfirm = 0,
  CurrentPhoneCode = 1,
  NewPhoneInput = 2,
  NewPhoneCode = 3,
}

export const EditPhonePage: React.FC<EditPhonePageProps> = ({
  currentPhone,
  onClose,
  onSave,
}) => {
  const [step, setStep] = useState<Step>(Step.CurrentPhoneConfirm);
  const [currentCode, setCurrentCode] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCode, setNewCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

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
  const handleSendCodeToCurrent = () => {
    // Simulate sending code
    console.log("Sending code to current phone:", currentPhone);
    setStep(Step.CurrentPhoneCode);
    setResendTimer(60);
  };

  // Handle verifying current phone code
  const handleVerifyCurrentCode = () => {
    if (currentCode.length !== 4) {
      setError("Введите 4-значный код");
      return;
    }

    // Simulate code verification
    if (currentCode === "1234") {
      setError(null);
      setStep(Step.NewPhoneInput);
    } else {
      setError("Неверный код");
    }
  };

  // Handle sending code to new phone
  const handleSendCodeToNew = () => {
    if (newPhone.length < 10) {
      setError("Введите корректный номер телефона");
      return;
    }

    // Simulate sending code
    console.log("Sending code to new phone:", newPhone);
    setError(null);
    setStep(Step.NewPhoneCode);
    setResendTimer(60);
  };

  // Handle verifying new phone code
  const handleVerifyNewCode = () => {
    if (newCode.length !== 4) {
      setError("Введите 4-значный код");
      return;
    }

    // Simulate code verification
    if (newCode === "1234") {
      setError(null);
      onSave(newPhone);
      onClose();
    } else {
      setError("Неверный код");
    }
  };

  // Handle resending code
  const handleResendCode = () => {
    setResendTimer(60);
    setError(null);
    // Simulate resending code
    console.log("Resending code");
  };

  // Handle back navigation
  const handleBack = () => {
    switch (step) {
      case Step.CurrentPhoneCode:
        setStep(Step.CurrentPhoneConfirm);
        break;
      case Step.NewPhoneInput:
        setStep(Step.CurrentPhoneCode);
        break;
      case Step.NewPhoneCode:
        setStep(Step.NewPhoneInput);
        break;
      default:
        onClose();
    }
  };

  const renderStep = () => {
    switch (step) {
      case Step.CurrentPhoneConfirm:
        return (
          <div
            className="flex flex-col gap-6"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
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

            {/* Send Code Button */}
            <div className="mt-8">
              <button
                onClick={handleSendCodeToCurrent}
                className="w-full py-4 rounded-full font-medium text-base text-white transition-all"
                style={{
                  fontFamily: "Nunito, sans-serif",
                  backgroundColor: "#30313D",
                }}
              >
                Получить код
              </button>
            </div>
          </div>
        );

      case Step.CurrentPhoneCode:
        const isCurrentCodeValid = currentCode.length === 4;
        return (
          <div
            className="flex flex-col gap-6"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {/* Instructions */}
            <div className="text-center">
              <p className="text-base font-medium text-gray-700">
                Мы отправили код подтверждения на номер {currentPhone}
              </p>
            </div>

            {/* Code Input */}
            <div className="flex flex-col gap-1">
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

            {/* Verify Button */}
            {isCurrentCodeValid && (
              <div className="mt-4">
                <button
                  onClick={handleVerifyCurrentCode}
                  className="w-full py-4 rounded-full font-medium text-base text-white transition-all"
                  style={{
                    fontFamily: "Nunito, sans-serif",
                    backgroundColor: "#30313D",
                  }}
                >
                  Подтвердить
                </button>
              </div>
            )}
          </div>
        );

      case Step.NewPhoneInput:
        const isNewPhoneValid = newPhone.length >= 10;
        return (
          <div
            className="flex flex-col gap-6"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
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
                Введите новый номер телефона и мы отправим код подтверждения
              </p>
            </div>

            {/* Phone Input */}
            <div className="flex flex-col gap-1">
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
              {error && (
                <p
                  className="text-red-500 text-sm font-medium px-3"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {error}
                </p>
              )}
            </div>

            {/* Send Code Button */}
            <div className="mt-8">
              <button
                onClick={handleSendCodeToNew}
                disabled={!isNewPhoneValid}
                className={`w-full py-4 rounded-full font-medium text-base transition-all ${
                  isNewPhoneValid
                    ? "text-white hover:opacity-80"
                    : "bg-gray-200 text-gray-500"
                }`}
                style={{
                  fontFamily: "Nunito, sans-serif",
                  backgroundColor: isNewPhoneValid ? "#30313D" : undefined,
                }}
              >
                Получить код
              </button>
            </div>
          </div>
        );

      case Step.NewPhoneCode:
        const isNewCodeValid = newCode.length === 4;
        return (
          <div
            className="flex flex-col gap-6"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {/* Instructions */}
            <div className="text-center">
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

            {/* Code Input */}
            <div className="flex flex-col gap-1">
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

            {/* Verify Button */}
            {isNewCodeValid && (
              <div className="mt-4">
                <button
                  onClick={handleVerifyNewCode}
                  className="w-full py-4 rounded-full font-medium text-base text-white transition-all"
                  style={{
                    fontFamily: "Nunito, sans-serif",
                    backgroundColor: "#30313D",
                  }}
                >
                  Подтвердить
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
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
      <div className="px-4 py-6">{renderStep()}</div>

      <BottomNavigation />
    </div>
  );
};
