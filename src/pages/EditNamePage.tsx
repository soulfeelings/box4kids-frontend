import React, { useState } from "react";
import { X } from "lucide-react";
import { BottomNavigation } from "../features/BottomNavigation";

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
  const [name, setName] = useState(currentName);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
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
            Изменить имя
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
            Имя
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
              placeholder="Введите имя"
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
          disabled={!name.trim()}
          className={`w-full py-3 px-4 rounded-[32px] font-medium text-base transition-colors ${
            name.trim()
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Сохранить
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};
