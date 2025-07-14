import React, { useMemo, useState } from "react";
import { useStore } from "../../../store/store";
import { useCreateBatchPaymentPaymentsCreateBatchPost } from "../../../api-client/";
import { SubscriptionStatus } from "../../../api-client/model/subscriptionStatus";
import { SubscriptionPlanResponse } from "../../../api-client/model/subscriptionPlanResponse";
import { ToyCategoryConfigResponse } from "../../../api-client/model/toyCategoryConfigResponse";

export const PaymentStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}> = ({ onBack, onNext, onClose }) => {
  const {
    getSelectedDeliveryAddressId,
    isLoading,
    setPaymentData,
    user,
    setError,
    subscriptionPlans,
  } = useStore();

  const createBatchPaymentMutation =
    useCreateBatchPaymentPaymentsCreateBatchPost();

  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const allChildrenSubscriptionsIds = user?.children.flatMap((child) =>
    child.subscriptions.map((subscription) => subscription.id)
  );
  console.log(allChildrenSubscriptionsIds);

  const handleBack = () => {
    onBack();
  };

  const handlePaymentSubmit = async () => {
    if (!allChildrenSubscriptionsIds?.length) {
      setError("Нет доступных подписок");
      return;
    }

    setPaymentProcessing(true);
    try {
      // Создаем платеж
      const paymentResponse = await createBatchPaymentMutation.mutateAsync({
        data: {
          subscription_ids: allChildrenSubscriptionsIds,
        },
      });

      // Сохраняем данные платежа в store
      setPaymentData({
        paymentId: paymentResponse.payment_id,
        status: "created",
      });

      // Переходим к успешному завершению или обработке платежа
      onNext(); // или другой маршрут для завершения
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Получение плана по ID
  const getPlanById = (planId: number): SubscriptionPlanResponse | null => {
    return subscriptionPlans.find((plan) => plan.id === planId) || null;
  };

  // Получение элементов плана
  const getPlanItems = (plan: SubscriptionPlanResponse | null) => {
    if (!plan) return [];

    return (
      plan?.toy_configurations?.map((config: ToyCategoryConfigResponse) => ({
        icon: config.icon || "🎯",
        count: config.quantity,
        name: config.name,
        color: "#A4B9ED",
      })) || []
    );
  };

  // Получение детей из store
  const children = user?.children || [];

  // Подсчет общей цены с учетом скидок
  const totalPrice = useMemo(
    () =>
      children.reduce((sum, child) => {
        const pendingSubscription = child.subscriptions.filter(
          (subscription) =>
            subscription.status === SubscriptionStatus.pending_payment
        );
        if (pendingSubscription.length > 0) {
          let price = 0;

          for (const subscription of pendingSubscription) {
            const plan = getPlanById(subscription.plan_id);
            price += plan?.price_monthly || 0;
          }

          // Округляем цену
          price = Math.round(price);

          return sum + price;
        }

        return sum;
      }, 0),
    [children]
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with step indicator */}
      <div className="flex items-center justify-between px-4 py-2 h-16 bg-white">
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
          Шаг 6/6
        </span>

        <button
          onClick={onClose}
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
      <div className="flex-1 flex flex-col px-6 pb-24 overflow-y-auto">
        {/* Title */}
        <div className="pt-6 pb-8">
          <h1
            className="text-xl font-semibold text-gray-900"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Подтвердите и оплатите подписку
          </h1>
        </div>

        <div className="space-y-6">
          {/* Наборы для детей */}
          {children.map((child, index) => {
            const subscription = child.subscriptions.filter(
              (sub) => sub.status === SubscriptionStatus.pending_payment
            );

            if (subscription.length === 0) {
              setError("Нет доступных подписок");
              return null;
            }

            if (subscription.length > 1) {
              setError(
                "У ребенка не может быть несколько подписок, обратитесь к администратору"
              );
              return null;
            }

            const plan = getPlanById(subscription[0].plan_id);
            if (!plan) {
              setError(
                "Не удалось получить план подписки, обратитесь к администратору"
              );
              return null;
            }

            const planItems = getPlanItems(plan);

            return (
              <div key={child.id} className="bg-gray-100 rounded-xl p-4">
                <h2
                  className="text-lg font-semibold text-gray-900 mb-3"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Набор для {child.name}
                </h2>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span
                      className="text-gray-700"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      Игрушек в наборе
                    </span>
                    <span
                      className="text-gray-900 font-medium"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {planItems.reduce(
                        (sum: number, item: any) => sum + item.count,
                        0
                      )}{" "}
                      шт
                    </span>
                  </div>
                  {/* Скидка (если есть) */}
                  {/* {subscription?.discount_percent &&
                    subscription.discount_percent > 0 && (
                      <div className="flex justify-between items-center">
                        <span
                          className="text-gray-700"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          Скидка
                        </span>
                        <span
                          className="text-red-500 font-medium"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          -{subscription.discount_percent}%
                        </span>
                      </div>
                    )} */}
                  <div className="flex justify-between items-center">
                    <span
                      className="text-gray-700"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      Стоимость
                    </span>
                    <span
                      className="text-gray-900 font-medium"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      ${plan.price_monthly} / мес.
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Общая сумма */}
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span
                className="text-xl font-semibold text-gray-900"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Общая сумма
              </span>
              <span
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                ${totalPrice} / мес.
              </span>
            </div>
          </div>

          {/* Информация об отмене */}
          <div className="mb-8">
            <p
              className="text-gray-500 text-sm text-center leading-relaxed"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Можно отменить или поставить подписку на паузу в любое время через
              приложение
            </p>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-6">
        <button
          className="w-full py-4 text-white rounded-full font-medium text-lg hover:opacity-80 transition-all mb-3"
          onClick={handlePaymentSubmit}
          disabled={isLoading || paymentProcessing || !totalPrice}
          style={{
            fontFamily: "Nunito, sans-serif",
            backgroundColor:
              isLoading || paymentProcessing || !totalPrice
                ? "#9ca3af"
                : "#30313D",
          }}
        >
          {isLoading
            ? "Создаем платеж..."
            : paymentProcessing
            ? "Обрабатываем платеж..."
            : !totalPrice
            ? "Загружаем данные..."
            : "Оплатить и активировать"}
        </button>

        {/* Payment processing indicator */}
        {paymentProcessing && (
          <div className="text-center mt-3">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span
                className="text-sm text-gray-600"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Обработка может занять до 15 секунд...
              </span>
            </div>
          </div>
        )}

        <p
          className="text-center text-gray-500 text-xs leading-relaxed"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Вы будете перенаправлены в платёжный сервис для безопасной оплаты
        </p>
      </div>
    </div>
  );
};
