import React, { useState } from "react";
import { X } from "lucide-react";
import { BottomNavigation } from "../features/BottomNavigation";
import { useStore } from "../store/store";
import { useUpdateUserProfileUsersProfilePut } from "../api-client";
import { notifications } from "../utils/notifications";
import { useTranslation } from 'react-i18next';

interface EditNamePageProps {
  currentName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
}

export const EditNamePage: React.FC<EditNamePageProps> = ({
  currentName,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(currentName);
  const { setUserName } = useStore();
  const updateUserMutation = useUpdateUserProfileUsersProfilePut();

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      // Если имя не изменилось, просто закрываем
      if (currentName === name.trim()) {
        onClose();
        return;
      }

      // Обновляем имя через API
      const userUpdated = await updateUserMutation.mutateAsync({
        data: { name: name.trim() },
      });

      // Обновляем в store
      setUserName(userUpdated.name);

      // Вызываем callback и закрываем
      onSave(userUpdated.name);
      onClose();

      notifications.success(t('name_updated_successfully'));
    } catch (error) {
      console.error("Update name error:", error);
      notifications.error(t('error_updating_name'));
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
            {t('edit_name')}
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
        {/* Name Input */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium text-gray-600 mb-2 px-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {t('name')}
          </label>
          <div
            className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
              name
                ? "border-[#7782F5]"
                : "border-gray-200 focus-within:border-[#7782F5]"
            }`}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
              placeholder={t('enter_name')}
              maxLength={32}
              autoFocus
              style={{ fontFamily: "Nunito, sans-serif" }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-24 left-4 right-4">
        <button
          onClick={handleSave}
          disabled={!name.trim() || updateUserMutation.isPending}
          className={`w-full py-3 px-4 rounded-[32px] font-medium text-base transition-colors ${
            name.trim() && !updateUserMutation.isPending
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {updateUserMutation.isPending ? t('saving') : t('save')}
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};
