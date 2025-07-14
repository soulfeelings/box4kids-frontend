import React, { useEffect, useState } from "react";
import {
  useCreateChildChildrenPost,
  useGetChildChildrenChildIdGet,
  useUpdateChildChildrenChildIdPut,
} from "../../../api-client/";
import { Gender } from "../../../api-client/model/gender";
import {
  convertDateToISO,
  convertDateFromISO,
} from "../../../utils/date/convert";
import { formatDateInput } from "../../../utils/date/format";
import { validateBirthDate } from "../../../utils/date/validate";
import { useChildIdLocation } from "../useChildIdLocation";

interface ChildData {
  name: string;
  date_of_birth: string;
  gender: Gender;
  has_limitations: boolean;
  comment?: string | null;
}

export const ChildStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}> = ({ onBack, onNext, onClose }) => {
  const childId = useChildIdLocation();
  const createChildMutation = useCreateChildChildrenPost();
  const updateChildMutation = useUpdateChildChildrenChildIdPut();
  const getChildMutation = useGetChildChildrenChildIdGet(childId as number, {
    query: {
      enabled: !!childId,
    },
  });

  const child = getChildMutation.data;

  const [childData, setChildData] = useState<ChildData>({
    name: "",
    date_of_birth: "",
    gender: "male",
    has_limitations: false,
    comment: "",
  });

  const birthDateValidation = validateBirthDate(childData.date_of_birth);
  const isFormValid =
    childData.name.trim() &&
    birthDateValidation.isValid &&
    childData.gender &&
    (childData.has_limitations === false ||
      (childData.has_limitations === true && childData.comment?.trim()));

  useEffect(() => {
    if (child) {
      setChildData({
        name: child.name,
        date_of_birth: child.date_of_birth,
        gender: child.gender,
        has_limitations: child.has_limitations,
        comment: child.comment,
      });
    }
  }, [child]);

  const handleBack = () => {
    onBack();
  };

  const handleClose = () => {
    onClose();
  };

  const handleChildSubmit = async () => {
    if (!isFormValid) return;

    if (childId && child) {
      await updateChildMutation.mutateAsync({
        childId,
        data: {
          name: childData.name,
          date_of_birth: convertDateToISO(childData.date_of_birth),
          gender: childData.gender as Gender,
          has_limitations: childData.has_limitations,
          comment: childData.comment,
        },
      });
    } else {
      await createChildMutation.mutateAsync({
        data: {
          name: childData.name,
          date_of_birth: convertDateToISO(childData.date_of_birth),
          gender: childData.gender as Gender,
          has_limitations: childData.has_limitations,
          comment: childData.comment,
        },
      });
    }
    // Переходим на следующий шаг
    onNext();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with step indicator */}
      <div className="flex items-center justify-between px-4 py-2 h-16">
        <button
          onClick={handleBack}
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

        <span
          className="text-gray-700 font-semibold text-base"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Шаг 2/6
        </span>

        <button
          onClick={handleClose}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
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
      <div className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
        {/* Title */}
        <div className="text-center mt-4 mb-6">
          <h1
            className="text-xl font-medium text-gray-900"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Кому собираем набор?
          </h1>
        </div>

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
                childData.date_of_birth && !birthDateValidation.isValid
                  ? "border-red-400"
                  : childData.date_of_birth && birthDateValidation.isValid
                  ? "border-green-400"
                  : childData.date_of_birth
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
                onClick={() =>
                  setChildData({ ...childData, has_limitations: false })
                }
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  childData.has_limitations === false
                    ? "bg-indigo-400 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Нет
              </button>
              <button
                onClick={() =>
                  setChildData({ ...childData, has_limitations: true })
                }
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  childData.has_limitations === true
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
                childData.has_limitations === true && !childData.comment?.trim()
                  ? "border-red-400"
                  : childData.comment
                  ? "border-[#7782F5]"
                  : "border-gray-200 focus-within:border-[#7782F5]"
              }`}
            >
              <textarea
                className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 resize-none"
                placeholder={
                  childData.has_limitations
                    ? "Опишите ограничения ребенка..."
                    : "Дополнительная информация о ребенке..."
                }
                value={childData.comment || ""}
                onChange={(e) =>
                  setChildData({ ...childData, comment: e.target.value })
                }
                rows={3}
                maxLength={200}
                style={{ fontFamily: "Nunito, sans-serif" }}
              />
            </div>
            {childData.has_limitations && !childData.comment?.trim() && (
              <p
                className="text-sm text-red-400 px-3"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Напишите ограничения ребенка
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom action button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
        <button
          className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
            isFormValid && !createChildMutation.isPending
              ? "text-white shadow-sm"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isFormValid || createChildMutation.isPending}
          onClick={handleChildSubmit}
          style={{
            fontFamily: "Nunito, sans-serif",
            backgroundColor:
              isFormValid && !createChildMutation.isPending
                ? "#30313D"
                : undefined,
          }}
        >
          {createChildMutation.isPending ? "Сохраняем..." : "Продолжить"}
        </button>
      </div>
    </div>
  );
};
