import React, { useState } from "react";
import { useStore } from "../../../store/store";
import { useUpdateUserProfileUsersProfilePut } from "../../../api-client";
import { StepIndicator } from "../../ui/StepIndicator";

export const UpdateNameStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  userName?: string;
}> = ({ onBack, onNext, onClose, userName }) => {
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

  const isLoading = updateUserMutation.isPending;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with step indicator */}
      <div className="flex items-center justify-between px-4 py-2 h-16">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <StepIndicator currentStep={1} />

        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          style={{
            // To make flow simple, we hide this button, but we save it for html markdown
            visibility: "hidden",
          }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-4">
        {/* Title */}
        <div className="text-center mt-4 mb-6">
          <h1
            className="text-xl font-medium text-gray-900 mb-0"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Давайте познакомимся!
          </h1>
        </div>

        {/* Input section */}
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium text-gray-600 px-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Как к вам обращаться?
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
      <div className="px-4 pb-6">
        <button
          className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
            name.trim() && !isLoading
              ? "text-white shadow-sm"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!name.trim() || isLoading}
          onClick={() => handleUpdateUser(name)}
          style={{
            fontFamily: "Nunito, sans-serif",
            backgroundColor: name.trim() && !isLoading ? "#30313D" : undefined,
          }}
        >
          {isLoading ? "Сохраняем..." : "Продолжить"}
        </button>
      </div>
    </div>
  );
};
