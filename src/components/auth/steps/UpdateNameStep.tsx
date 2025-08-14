import React, { useState } from "react";
import { useStore } from "../../../store/store";
import { useUpdateUserProfileUsersProfilePut } from "../../../api-client";
import { StepIndicator } from "../../ui/StepIndicator";
import { BackButton } from "../../ui";
import { useTranslation } from 'react-i18next';

export const UpdateNameStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  userName?: string;
}> = ({ onBack, onNext, onClose: _onClose, userName }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(userName ?? "");
  const { setUserName } = useStore();

  const updateUserMutation = useUpdateUserProfileUsersProfilePut();


  const handleUpdateUser = async (name: string) => {
    try {
      if (userName === name) {
        onNext();
        return;
      }

      const userUpdated = await updateUserMutation.mutateAsync({
        data: { name },
      });

      setUserName(userUpdated.name);

      onNext();
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with step indicator */}
      <div className="flex items-center justify-between px-4 py-2 h-16">
        <BackButton onClick={onBack} />

        <StepIndicator currentStep={1} />
        <div style={{ width: 40 }} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-4">
        {/* Title */}
        <div className="text-center mt-4 mb-6">
          <h1
            className="text-xl font-medium text-gray-900 mb-0"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {t('lets_get_acquainted')}
          </h1>
        </div>

        {/* Input section */}
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium text-gray-600 px-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {t('how_should_we_address_you')}
          </label>
          <div
            className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
              name
                ? "border-[#7782F5]"
                : "border-gray-200 focus-within:border-[#7782F5]"
            }`}
          >
            <input
              className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
              placeholder=""
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={64}
              autoFocus
              style={{ fontFamily: "Nunito, sans-serif" }}
            />
          </div>
        </div>

        <div className="flex-1"></div>
      </div>

      {/* Bottom action button */}
      <div
        className="px-4 pb-6 pb-safe transition-all duration-300"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}
      >
        <button
          className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
            name.trim()
              ? "bg-[#30313D] text-white shadow-sm"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!name.trim()}
          onClick={() => handleUpdateUser(name)}
          style={{
            fontFamily: "Nunito, sans-serif",
          }}
        >
          {t('continue')}
        </button>
      </div>
    </div>
  );
};
