import React, { useEffect, useState } from "react";
import { Gender } from "../api-client/model/gender";
import { formatDateInput } from "../utils/date/format";
import { validateBirthDate } from "../utils/date/validate";
import { UserChildData } from "../types";

interface ChildData {
  name: string;
  date_of_birth: string;
  gender: Gender;
  limitations: boolean;
  comment?: string | null;
}

interface ChildEditFormProps {
  child?: UserChildData;
  onDataChange: (data: ChildData) => void;
  isDisabled?: boolean;
}

export const ChildEditForm: React.FC<ChildEditFormProps> = ({
  child,
  onDataChange,
  isDisabled = false,
}) => {
  const [childData, setChildData] = useState<ChildData>({
    name: "",
    date_of_birth: "",
    gender: "male",
    limitations: false,
    comment: "",
  });

  // Инициализация данных при загрузке
  useEffect(() => {
    if (child) {
      setChildData({
        name: child.name,
        date_of_birth: child.date_of_birth,
        gender: child.gender,
        limitations: child.limitations,
        comment: child.comment,
      });
    }
  }, [child]);

  // Уведомляем родительский компонент об изменениях
  useEffect(() => {
    onDataChange(childData);
  }, [childData, onDataChange]);

  const birthDateValidation = validateBirthDate(childData.date_of_birth);

  return (
    <div className="space-y-6">
      {/* Child Name */}
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-gray-600 px-3"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Имя ребенка
        </label>
        <div
          className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
            childData.name
              ? "border-[#7782F5]"
              : "border-gray-200 focus-within:border-[#7782F5]"
          }`}
        >
          <input
            className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
            placeholder=""
            value={childData.name}
            onChange={(e) => {
              setChildData({ ...childData, name: e.target.value });
            }}
            maxLength={32}
            disabled={isDisabled}
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </div>
      </div>

      {/* Birth Date */}
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-gray-600 px-3"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Дата рождения
        </label>
        <div
          className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
            childData.date_of_birth && birthDateValidation.isValid
              ? "border-[#7782F5]"
              : "border-gray-200 focus-within:border-[#7782F5]"
          }`}
        >
          <input
            type="text"
            className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
            placeholder=""
            value={childData.date_of_birth}
            onChange={(e) => {
              const formatted = formatDateInput(e.target.value);
              setChildData({ ...childData, date_of_birth: formatted });
            }}
            maxLength={10}
            disabled={isDisabled}
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </div>
        {childData.date_of_birth && !birthDateValidation.isValid && (
          <p
            className="text-sm text-red-400 px-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {birthDateValidation.error}
          </p>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-4">
        <h3
          className="text-lg font-semibold text-gray-900"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Пол ребенка
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => setChildData({ ...childData, gender: "male" })}
            disabled={isDisabled}
            className={`px-4 py-3 rounded-xl font-medium transition-all ${
              childData.gender === "male"
                ? "bg-indigo-400 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Мужской
          </button>
          <button
            onClick={() => setChildData({ ...childData, gender: "female" })}
            disabled={isDisabled}
            className={`px-4 py-3 rounded-xl font-medium transition-all ${
              childData.gender === "female"
                ? "bg-indigo-400 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Женский
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h3
          className="text-lg font-semibold text-gray-900"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Особенности
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => setChildData({ ...childData, limitations: false })}
            disabled={isDisabled}
            className={`px-4 py-3 rounded-xl font-medium transition-all ${
              childData.limitations === false
                ? "bg-indigo-400 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Нет
          </button>
          <button
            onClick={() => setChildData({ ...childData, limitations: true })}
            disabled={isDisabled}
            className={`px-4 py-3 rounded-xl font-medium transition-all ${
              childData.limitations === true
                ? "bg-indigo-400 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Есть ограничения
          </button>
        </div>
      </div>

      {/* Comment */}
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-gray-600 px-3"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Комментарий
        </label>
        <div
          className={`w-full border-2 rounded-2xl px-3 py-3 bg-gray-50 focus-within:ring-0 transition-all ${
            childData.limitations === true && !childData.comment?.trim()
              ? "border-red-400"
              : childData.comment
              ? "border-[#7782F5]"
              : "border-gray-200 focus-within:border-[#7782F5]"
          }`}
        >
          <textarea
            className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 resize-none"
            placeholder={
              childData.limitations
                ? "Опишите ограничения ребенка..."
                : "Дополнительная информация о ребенке..."
            }
            value={childData.comment || ""}
            onChange={(e) =>
              setChildData({ ...childData, comment: e.target.value })
            }
            rows={3}
            maxLength={200}
            disabled={isDisabled}
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </div>
        {childData.limitations && !childData.comment?.trim() && (
          <p
            className="text-sm text-red-400 px-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Напишите ограничения ребенка
          </p>
        )}
      </div>
    </div>
  );
};
