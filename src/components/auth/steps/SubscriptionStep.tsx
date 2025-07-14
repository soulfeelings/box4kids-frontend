import React, { useEffect, useState } from "react";
import { useStore } from "../../../store/store";
import { useCreateSubscriptionOrderSubscriptionsPost } from "../../../api-client/";
import { UserChildData } from "../../../types";
import { AddNewChildBanner } from "../../../features/AddNewChildBanner";

// Tag component for interests and skills
const Tag: React.FC<{ children: React.ReactNode; selected?: boolean }> = ({
  children,
  selected = false,
}) => (
  <span
    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
      selected ? "text-gray-700" : "bg-gray-100 text-gray-700"
    }`}
    style={{
      fontFamily: "Nunito, sans-serif",
      backgroundColor: selected ? "#F2F2F2" : undefined,
    }}
  >
    {children}
  </span>
);

export const SubscriptionStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  currentChildToUpdate?: UserChildData;
  onAddNewChild?: () => void;
}> = ({ onBack, onNext, onClose, currentChildToUpdate, onAddNewChild }) => {
  const [subscriptionId, setSubscriptionId] = useState<number | null>(
    currentChildToUpdate?.subscriptions[0].plan_id || null
  );

  useEffect(() => {
    if (currentChildToUpdate?.subscriptions[0].plan_id) {
      setSubscriptionId(currentChildToUpdate?.subscriptions[0].plan_id);
    }
  }, [currentChildToUpdate]);

  const {
    isLoading,
    setError,
    getSubscriptionPlan,
    updateChild,
    subscriptionPlans,
  } = useStore();

  const createSubscriptionMutation =
    useCreateSubscriptionOrderSubscriptionsPost();

  const handleBack = () => {
    onBack();
  };

  const handleClose = () => {
    onClose();
  };

  // Маппинг названия плана к типу
  const mapPlanNameToType = (planName: string): "base" | "premium" => {
    return planName.toLowerCase().includes("базовый") ? "base" : "premium";
  };

  const handleSubscriptionSubmit = async () => {
    if (!currentChildToUpdate?.id) {
      setError("Не выбран ребенок");
      return;
    }

    if (!subscriptionId) {
      setError("Не выбран план подписки");
      return;
    }

    const subscriptionPlan = getSubscriptionPlan(subscriptionId);
    if (!subscriptionPlan) {
      setError("Не загрузились планы подписки");
      return;
    }

    try {
      await createSubscriptionMutation.mutateAsync({
        data: {
          child_id: currentChildToUpdate?.id,
          plan_id: subscriptionPlan.id,
        },
      });

      // Обновляем данные подписки в store
      updateChild(currentChildToUpdate?.id, {
        subscriptions: [
          {
            id: subscriptionId,
            plan_id: subscriptionPlan.id,
            child_id: currentChildToUpdate?.id,
            delivery_info_id: null,
            status: currentChildToUpdate.subscriptions[0].status,
            discount_percent:
              currentChildToUpdate.subscriptions[0].discount_percent,
            created_at: currentChildToUpdate.subscriptions[0].created_at,
            expires_at: currentChildToUpdate.subscriptions[0].expires_at,
          },
        ],
      });

      // Переходим к следующему шагу
      onNext();
    } catch (error) {
      console.error("Failed to create subscription:", error);
    }
  };

  const isSubscriptionValid = subscriptionId !== null;

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
          className="text-sm font-medium text-gray-600"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Шаг 4/6
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
            Какой набор подойдёт {currentChildToUpdate?.name}?
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

          {/* Subscription plans */}
          {subscriptionPlans.map((plan) => {
            const planType = mapPlanNameToType(plan.name);
            const isSelected = subscriptionId === plan.id;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 shadow-sm border transition-all cursor-pointer ${
                  isSelected
                    ? "border-indigo-400"
                    : "border-gray-100 hover:border-gray-300"
                }`}
                style={{
                  backgroundColor: "#F2F2F2",
                }}
                onClick={() => setSubscriptionId(plan.id)}
              >
                <div className="flex items-center gap-2 mb-4">
                  <h3
                    className="text-lg font-semibold text-gray-900"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {plan.name}
                  </h3>
                  <span className="text-gray-500">•</span>
                  <span
                    className="text-gray-700"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {plan.toy_count} игрушек
                  </span>
                  <span className="text-gray-500">•</span>
                  <div className="text-right">
                    <span
                      className="text-gray-700"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      ${plan.price_monthly}/мес.
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <p
                    className="text-gray-600 text-sm mb-3"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Состав набора игрушек
                  </p>
                  <div className="space-y-3">
                    {plan.toy_configurations?.map((config) => (
                      <div key={config.id} className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                          style={{ backgroundColor: "#A4B9ED" }}
                        >
                          {config.icon || "🎯"}
                        </div>
                        <span
                          className="text-gray-700 font-medium"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          x{config.quantity}
                        </span>
                        <span
                          className="text-gray-800"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          {config.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    isSelected
                      ? "bg-indigo-400 text-white"
                      : "text-gray-700 hover:opacity-80"
                  }`}
                  style={{
                    fontFamily: "Nunito, sans-serif",
                    backgroundColor: isSelected ? undefined : "#E3E3E3",
                  }}
                  disabled={isLoading}
                >
                  {isSelected ? "Выбрано" : "Выбрать"}
                </button>
              </div>
            );
          })}

          {onAddNewChild && (
            <AddNewChildBanner
              onClick={() => {
                onAddNewChild();
              }}
            />
          )}
        </div>
      </div>

      {/* Bottom action button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
        <button
          className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
            isSubscriptionValid && !isLoading
              ? "text-white shadow-sm"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          style={{
            fontFamily: "Nunito, sans-serif",
            backgroundColor:
              isSubscriptionValid && !isLoading ? "#30313D" : undefined,
          }}
          disabled={!isSubscriptionValid || isLoading}
          onClick={handleSubscriptionSubmit}
        >
          {isLoading ? "Создаем подписку..." : "Перейти к оформлению"}
        </button>
      </div>
    </div>
  );
};
