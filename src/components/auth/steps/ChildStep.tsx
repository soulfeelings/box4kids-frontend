import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  useCreateChildChildrenPost,
  useUpdateChildChildrenChildIdPut,
} from "../../../api-client/";
import { Gender } from "../../../api-client/model/gender";
import { dateManager } from "../../../utils/date/DateManager";
import { useStore } from "../../../store";
import {
  useChildrenWithoutSubscriptionByStatus,
  useUserWithFilteredChildren,
} from "../../../store/hooks";
import { UserChildData } from "../../../types";
import { ChoseChildCards } from "../../../features/ChoseChildCards";
import { notifications } from "../../../utils/notifications";
import { SubscriptionStatus } from "../../../api-client/model/subscriptionStatus";

interface ChildData {
  name: string;
  date_of_birth: string;
  gender: Gender;
  limitations: boolean;
  comment?: string | null;
}

export const ChildStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  currentChildToUpdate: UserChildData | null;
}> = ({ onBack, onNext, onClose, currentChildToUpdate }) => {
  const { setCurrentChildIdToUpdate, addChild, updateChild, setError } =
    useStore();
  const createChildMutation = useCreateChildChildrenPost();
  const updateChildMutation = useUpdateChildChildrenChildIdPut();

  // Используем хуки для получения отфильтрованных данных
  const childrenWithoutActiveSubscription =
    useChildrenWithoutSubscriptionByStatus([
      SubscriptionStatus.active,
      SubscriptionStatus.paused,
    ]);

  // Мемоизируем объект пользователя с отфильтрованными детьми
  const userWithFilteredChildren = useUserWithFilteredChildren(
    childrenWithoutActiveSubscription
  );

  const [childData, setChildData] = useState<ChildData>({
    name: currentChildToUpdate?.name || "",
    date_of_birth: currentChildToUpdate?.date_of_birth || "",
    gender: currentChildToUpdate?.gender || "male",
    limitations: currentChildToUpdate?.limitations || false,
    comment: currentChildToUpdate?.comment || "",
  });

  useEffect(() => {
    if (currentChildToUpdate) {
      setChildData({
        name: currentChildToUpdate?.name || "",
        date_of_birth: currentChildToUpdate?.date_of_birth || "",
        gender: currentChildToUpdate?.gender || "male",
        limitations: currentChildToUpdate?.limitations || false,
        comment: currentChildToUpdate?.comment || "",
      });
    } else {
      setChildData({
        name: "",
        date_of_birth: "",
        gender: "male",
        limitations: false,
        comment: "",
      });
    }
  }, [currentChildToUpdate]);

  // Мемоизируем функции-обработчики
  const handleChildSelect = useCallback(
    (childId: number) => {
      setCurrentChildIdToUpdate(childId);
    },
    [setCurrentChildIdToUpdate]
  );

  const handleAddNewChild = useCallback(() => {
    setCurrentChildIdToUpdate(null);
  }, [setCurrentChildIdToUpdate]);

  const birthDateValidation = dateManager.validateBirthDate(
    childData.date_of_birth
  );
  const isFormValid =
    childData.name.trim() &&
    birthDateValidation.isValid &&
    childData.gender &&
    (childData.limitations === false ||
      (childData.limitations === true && childData.comment?.trim()));

  // Оптимизируем зависимости useMemo
  const isFormChanged = useMemo(() => {
    if (!currentChildToUpdate) return true; // Если создаем нового ребенка, форма всегда изменена

    return (
      childData.name !== currentChildToUpdate.name ||
      childData.date_of_birth !== currentChildToUpdate.date_of_birth ||
      childData.gender !== currentChildToUpdate.gender ||
      childData.limitations !== currentChildToUpdate.limitations ||
      childData.comment !== currentChildToUpdate.comment
    );
  }, [
    childData.name,
    childData.date_of_birth,
    childData.gender,
    childData.limitations,
    childData.comment,
    currentChildToUpdate,
  ]);

  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleChildSubmit = useCallback(async () => {
    if (!isFormValid) return;

    if (!isFormChanged) {
      console.log("isFormChanged: false");
      onNext();
      return;
    }

    try {
      if (currentChildToUpdate) {
        const updatedChild = await updateChildMutation.mutateAsync({
          childId: currentChildToUpdate.id,
          data: {
            name: childData.name,
            date_of_birth: dateManager.toISO(childData.date_of_birth),
            gender: childData.gender as Gender,
            has_limitations: childData.limitations,
            comment: childData.comment,
          },
        });

        updateChild(updatedChild.id, {
          name: updatedChild.name,
          date_of_birth: dateManager.toDisplay(updatedChild.date_of_birth),
          gender: updatedChild.gender,
          limitations: updatedChild.has_limitations,
          comment: updatedChild.comment,
        });

        notifications.childUpdated();
      } else {
        const newChild = await createChildMutation.mutateAsync({
          data: {
            name: childData.name,
            date_of_birth: dateManager.toISO(childData.date_of_birth),
            gender: childData.gender as Gender,
            has_limitations: childData.limitations,
            comment: childData.comment,
          },
        });

        // add child to store
        addChild({
          id: newChild.id,
          name: newChild.name,
          date_of_birth: dateManager.toDisplay(newChild.date_of_birth),
          gender: newChild.gender,
          limitations: newChild.has_limitations,
          comment: newChild.comment || "",
          interests: newChild.interests.map((interest) => interest.id),
          skills: newChild.skills.map((skill) => skill.id),
          subscriptions: newChild.subscriptions,
        });
        setCurrentChildIdToUpdate(newChild.id);
        notifications.childAdded();
      }
      // Переходим на следующий шаг
      onNext();
    } catch (error) {
      console.error("Failed to update child:", error);
      setError("Не удалось обновить ребёнка");
      notifications.error("Не удалось сохранить данные ребенка");
    }
  }, [
    isFormValid,
    isFormChanged,
    currentChildToUpdate,
    childData,
    updateChildMutation,
    createChildMutation,
    updateChild,
    addChild,
    setCurrentChildIdToUpdate,
    setError,
    onNext,
  ]);

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
          <p
            className="text-sm text-gray-600 mt-2"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Показаны только дети без активной подписки
          </p>
        </div>

        {/* Children Cards */}
        {userWithFilteredChildren && (
          <ChoseChildCards
            user={userWithFilteredChildren}
            handleChildSelect={handleChildSelect}
            selectedChildId={currentChildToUpdate?.id || null}
            handleAddNewChild={handleAddNewChild}
            isCreatingNew={!currentChildToUpdate}
          />
        )}

        {/* Form - only show if creating new or editing existing */}
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
                onChange={useCallback(
                  (e: React.ChangeEvent<HTMLInputElement>) => {
                    setChildData((prev) => ({ ...prev, name: e.target.value }));
                  },
                  []
                )}
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
                onChange={useCallback(
                  (e: React.ChangeEvent<HTMLInputElement>) => {
                    const formatted = dateManager.formatDateInput(
                      e.target.value
                    );
                    setChildData((prev) => ({
                      ...prev,
                      date_of_birth: formatted,
                    }));
                  },
                  []
                )}
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
                onClick={useCallback(
                  () => setChildData((prev) => ({ ...prev, gender: "male" })),
                  []
                )}
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
                onClick={useCallback(
                  () => setChildData((prev) => ({ ...prev, gender: "female" })),
                  []
                )}
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
                onClick={useCallback(
                  () =>
                    setChildData((prev) => ({ ...prev, limitations: false })),
                  []
                )}
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
                onClick={useCallback(
                  () =>
                    setChildData((prev) => ({ ...prev, limitations: true })),
                  []
                )}
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
                onChange={useCallback(
                  (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setChildData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    })),
                  []
                )}
                rows={3}
                maxLength={200}
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

ChildStep.whyDidYouRender = true;
