import React, { useEffect, useState } from "react";
import { useStore } from "../../../store/store";
import { useSubscriptionPlan } from "../../../store/hooks";
import { useCreateSubscriptionOrderSubscriptionsPost } from "../../../api-client/";
import { UserChildData } from "../../../types";
import { AddNewChildBanner } from "../../../features/AddNewChildBanner";
import { SingleChildSubscriptionView } from "./subscription-step-components/SingleChildSubscriptionView";
import { notifications } from "../../../utils/notifications";
import { StepIndicator } from "../../ui/StepIndicator";

export const SubscriptionStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  currentChildToUpdate: UserChildData | null;
  onAddNewChild?: () => void;
}> = ({ onBack, onNext, onClose, currentChildToUpdate, onAddNewChild }) => {
  const [subscriptionId, setSubscriptionId] = useState<number | null>(
    currentChildToUpdate?.subscriptions[0]?.plan_id || null
  );

  useEffect(() => {
    if (currentChildToUpdate?.subscriptions[0]?.plan_id) {
      setSubscriptionId(currentChildToUpdate?.subscriptions[0]?.plan_id);
    }
  }, [currentChildToUpdate]);

  const { isLoading, setError, updateChild, subscriptionPlans } = useStore();

  const createSubscriptionMutation =
    useCreateSubscriptionOrderSubscriptionsPost();

  const handleClose = () => {
    onClose();
  };

  const subscriptionPlan = useSubscriptionPlan(subscriptionId);

  const handleSubscriptionSubmit = async () => {
    const targetChild = currentChildToUpdate;

    if (!targetChild?.id) {
      setError("Не выбран ребенок");
      return;
    }

    if (!subscriptionId) {
      setError("Не выбран план подписки");
      return;
    }

    if (!subscriptionPlan) {
      setError("Не загрузились планы подписки");
      return;
    }

    try {
      const subscription = await createSubscriptionMutation.mutateAsync({
        data: {
          child_id: targetChild.id,
          plan_id: subscriptionPlan.id,
        },
      });

      // Обновляем данные подписки в store
      // не должно быть больше одной подписки на ребенка
      updateChild(targetChild.id, {
        subscriptions: [subscription],
      });

      notifications.subscriptionCreated();

      // Если мы были в режиме редактирования, выходим из него
      // Переходим к следующему шагу
      onNext();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Неизвестная ошибка");
      }
      notifications.error("Не удалось создать подписку");
      console.error("Failed to create subscription:", error);
    }
  };

  const isSubscriptionValid = subscriptionId !== null;

  const isButtonEnabled = () => {
    return isSubscriptionValid && !isLoading;
  };

  const handleAddNewChild = () => {
    if (onAddNewChild) {
      onAddNewChild();
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "white" }}
    >
      {/* Header with step indicator */}
      <div className="flex items-center justify-between px-4 py-2 h-16 bg-white">
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

        <StepIndicator currentStep={4} />

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
            Какой набор подойдёт для ребенка {currentChildToUpdate?.name}?
          </h1>
        </div>

        <div className="space-y-4">
          {/* Info Alert */}
          <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
            <p
              className="text-sm font-medium text-indigo-700 text-center"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Мы подбираем игрушки вручную, с учётом интересов. Хотите поменять
              состав набора? Просто обновите интересы ребёнка
            </p>
          </div>

          <SingleChildSubscriptionView
            subscriptionPlans={subscriptionPlans}
            selectedSubscriptionId={subscriptionId}
            onSelectSubscription={setSubscriptionId}
            isLoading={isLoading}
          />

          {onAddNewChild && <AddNewChildBanner onClick={handleAddNewChild} />}
        </div>
      </div>

      {/* Bottom action button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 max-w-[800px] mx-auto">
        <button
          className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
            isButtonEnabled()
              ? "text-white shadow-sm"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          style={{
            fontFamily: "Nunito, sans-serif",
            backgroundColor: isButtonEnabled() ? "#30313D" : undefined,
          }}
          disabled={!isButtonEnabled()}
          onClick={handleSubscriptionSubmit}
        >
          {isLoading ? "Создаем подписку..." : "Перейти к оформлению"}
        </button>
      </div>
    </div>
  );
};
