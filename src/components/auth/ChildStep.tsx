import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistrationStore } from "../../store/registrationStore";
import { ROUTES } from "../../constants/routes";
import { useCreateChildChildrenPost } from "../../api-client";
import { Gender } from "../../api-client/model/gender";

export const ChildStep: React.FC = () => {
  const navigate = useNavigate();
  const {
    userId,
    addChild,
    editingChild,
    updateEditingChild,
    resetEditingChild,
  } = useRegistrationStore();
  const createChildMutation = useCreateChildChildrenPost();

  // Инициализируем editingChild при загрузке компонента
  useEffect(() => {
    if (!editingChild) {
      resetEditingChild();
    }
  }, [editingChild, resetEditingChild]);

  // Если editingChild еще не инициализирован, показываем заглушку
  if (!editingChild) {
    return <div>Загрузка...</div>;
  }

  const handleBack = () => {
    navigate(ROUTES.AUTH.REGISTER);
  };

  const handleClose = () => {
    navigate(ROUTES.DEMO);
  };

  // Функция форматирования даты
  const formatDateInput = (value: string, isFullDate: boolean): string => {
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length <= 4) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2)}`;
    } else {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(
        2,
        4
      )}.${numericValue.slice(4, 8)}`;
    }
  };

  // Функция валидации даты
  const validateBirthDate = (
    dateString: string
  ): { isValid: boolean; error: string } => {
    if (!dateString) return { isValid: false, error: "" };

    const parts = dateString.split(".");
    if (parts.length !== 3) {
      return { isValid: false, error: "Неверный формат даты" };
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return { isValid: false, error: "Неверный формат даты" };
    }

    if (day < 1 || day > 31) {
      return { isValid: false, error: "Неверный день" };
    }

    if (month < 1 || month > 12) {
      return { isValid: false, error: "Неверный месяц" };
    }

    if (year < 1900 || year > new Date().getFullYear()) {
      return { isValid: false, error: "Неверный год" };
    }

    // Проверка на валидную дату
    const date = new Date(year, month - 1, day);
    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      return { isValid: false, error: "Такой даты не существует" };
    }

    // Проверка, что дата не в будущем
    if (date > new Date()) {
      return { isValid: false, error: "Дата не может быть в будущем" };
    }

    return { isValid: true, error: "" };
  };

  const handleChildSubmit = async () => {
    if (!isFormValid) return;

    try {
      const response = await createChildMutation.mutateAsync({
        data: {
          name: editingChild.name,
          date_of_birth: editingChild.birthDate,
          gender: editingChild.gender as Gender,
          has_limitations: editingChild.limitations === "has_limitations",
          comment: editingChild.comment,
        },
        params: {
          parent_id: userId!,
        },
      });

      // Добавляем созданного ребенка в store
      addChild({
        id: response.id,
        name: response.name,
        birthDate: response.date_of_birth,
        gender: response.gender,
        limitations: response.has_limitations ? "has_limitations" : "none",
        comment: response.comment || "",
      });

      // Обновляем editingChild с ID созданного ребенка
      updateEditingChild({ id: response.id });

      // Переходим на следующий шаг
      navigate(ROUTES.AUTH.CATEGORIES);
    } catch (error) {
      console.error("Ошибка при создании ребенка:", error);
    }
  };

  const birthDateValidation = validateBirthDate(editingChild.birthDate);
  const isFormValid =
    editingChild.name.trim() &&
    birthDateValidation.isValid &&
    editingChild.gender &&
    editingChild.limitations &&
    (editingChild.limitations === "none" ||
      (editingChild.limitations === "has_limitations" &&
        editingChild.comment.trim()));

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
                editingChild.name
                  ? "border-[#7782F5]"
                  : "border-gray-200 focus-within:border-[#7782F5]"
              }`}
            >
              <input
                className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
                placeholder=""
                value={editingChild.name}
                onChange={(e) => {
                  updateEditingChild({ name: e.target.value });
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
                editingChild.birthDate && !birthDateValidation.isValid
                  ? "border-red-400"
                  : editingChild.birthDate && birthDateValidation.isValid
                  ? "border-green-400"
                  : editingChild.birthDate
                  ? "border-[#7782F5]"
                  : "border-gray-200 focus-within:border-[#7782F5]"
              }`}
            >
              <input
                type="text"
                className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0"
                placeholder=""
                value={editingChild.birthDate}
                onChange={(e) => {
                  const formatted = formatDateInput(e.target.value, true);
                  updateEditingChild({ birthDate: formatted });
                }}
                maxLength={10}
                style={{ fontFamily: "Nunito, sans-serif" }}
              />
            </div>
            {editingChild.birthDate && !birthDateValidation.isValid && (
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
                onClick={() => updateEditingChild({ gender: "male" })}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  editingChild.gender === "male"
                    ? "bg-indigo-400 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Мужской
              </button>
              <button
                onClick={() => updateEditingChild({ gender: "female" })}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  editingChild.gender === "female"
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
                onClick={() => updateEditingChild({ limitations: "none" })}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  editingChild.limitations === "none"
                    ? "bg-indigo-400 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Нет
              </button>
              <button
                onClick={() =>
                  updateEditingChild({ limitations: "has_limitations" })
                }
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  editingChild.limitations === "has_limitations"
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
                editingChild.limitations === "has_limitations" &&
                !editingChild.comment.trim()
                  ? "border-red-400"
                  : editingChild.comment
                  ? "border-[#7782F5]"
                  : "border-gray-200 focus-within:border-[#7782F5]"
              }`}
            >
              <textarea
                className="w-full text-base font-medium bg-transparent border-0 outline-none focus:ring-0 resize-none"
                placeholder={
                  editingChild.limitations === "has_limitations"
                    ? "Опишите ограничения ребенка..."
                    : "Дополнительная информация о ребенке..."
                }
                value={editingChild.comment}
                onChange={(e) =>
                  updateEditingChild({ comment: e.target.value })
                }
                rows={3}
                maxLength={200}
                style={{ fontFamily: "Nunito, sans-serif" }}
              />
            </div>
            {editingChild.limitations === "has_limitations" &&
              !editingChild.comment.trim() && (
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
