import React, { useCallback, useMemo, useState } from "react";
import { useStore } from "../../../store/store";
import { useChildrenWithSubscriptionByStatus } from "../../../store/hooks";
import { useProcessSubscriptionsPaymentsProcessSubscriptionsPost } from "../../../api-client/";
import { SubscriptionStatus } from "../../../api-client/model/subscriptionStatus";
import { SubscriptionPlanResponse } from "../../../api-client/model/subscriptionPlanResponse";
import { ToyCategoryConfigResponse } from "../../../api-client/model/toyCategoryConfigResponse";
import { PaymentStatusEnum } from "../../../api-client/model/paymentStatusEnum";
import { notifications } from "../../../utils/notifications";
import { StepIndicator } from "../../ui/StepIndicator";
import { BackButton } from "../../ui";
import { useTranslation } from "react-i18next";

export const PaymentStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}> = ({ onBack, onNext, onClose }) => {
  const { t } = useTranslation();
  const isLoading = useStore((state) => state.isLoading);
  const setError = useStore((state) => state.setError);
  const subscriptionPlans = useStore((state) => state.subscriptionPlans);

  const processSubscriptionsMutation =
    useProcessSubscriptionsPaymentsProcessSubscriptionsPost();

  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Получение детей из store
  const children = useChildrenWithSubscriptionByStatus([
    SubscriptionStatus.pending_payment,
  ]);

  const subscriptionsIds = useMemo(
    () =>
      children.flatMap((child) =>
        child.subscriptions.map((subscription) => subscription.id)
      ),
    [children]
  );

  const handleBack = () => {
    onBack();
  };

  const handleClose = () => {
    onClose();
  };

  const handlePaymentSubmit = useCallback(async () => {
    if (!subscriptionsIds?.length) {
      setError(t("no_available_subscriptions"));
      return;
    }

    setPaymentProcessing(true);
    try {
      // Используем новый объединенный endpoint
      const result = await processSubscriptionsMutation.mutateAsync({
        data: {
          subscription_ids: subscriptionsIds,
        },
      });

      // Проверяем результат обработки платежа
      if (result.status === PaymentStatusEnum.success) {
        notifications.paymentSuccess();
        onNext(); // Переходим к успешному завершению
      } else {
        notifications.paymentError();
        setError(t("payment_failed_try_again"));
      }
    } catch (error) {
      console.error("Payment error:", error);
      notifications.paymentError();
      setError(t("payment_processing_error"));
    } finally {
      setPaymentProcessing(false);
    }
  }, [subscriptionsIds, processSubscriptionsMutation, onNext, setError, t]);

  // Получение плана по ID
  const getPlanById = useCallback(
    (planId: number): SubscriptionPlanResponse | null => {
      return subscriptionPlans.find((plan) => plan.id === planId) || null;
    },
    [subscriptionPlans]
  );

  // Получение элементов плана
  const getPlanItems = useCallback((plan: SubscriptionPlanResponse | null) => {
    if (!plan) return [];

    return (
      plan?.toy_configurations?.map((config: ToyCategoryConfigResponse) => ({
        icon: config.icon || "🎯",
        count: config.quantity,
        name: config.name,
        color: "#A4B9ED",
      })) || []
    );
  }, []);

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
            // Используем final_price из API, если доступно, иначе рассчитываем
            const plan = getPlanById(subscription.plan_id);
            const basePrice = plan?.price_monthly || 0;
            const finalPrice =
              (subscription as any).final_price ||
              basePrice * (1 - (subscription.discount_percent || 0) / 100);
            price += finalPrice;
          }

          // Округляем цену
          price = Math.round(price);

          return sum + price;
        }

        return sum;
      }, 0),
    [children, getPlanById]
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with step indicator */}
      <div className="flex items-center justify-between px-4 py-2 h-16 bg-white">
        <BackButton onClick={handleBack} />

        <StepIndicator currentStep={7} />

        <button
          onClick={handleClose}
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
          style={{ backgroundColor: '#F2F2F2' }}
          aria-label="Закрыть"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="black"
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
            {t("confirm_and_pay_subscription")}
          </h1>
        </div>

        <div className="space-y-6">
          {/* Наборы для детей */}
          {children.map((child) => {
            const subscription = child.subscriptions.filter(
              (sub) => sub.status === SubscriptionStatus.pending_payment
            );

            if (subscription.length === 0) {
              return null;
            }

            if (subscription.length > 1) {
              return null;
            }

            const plan = getPlanById(subscription[0].plan_id);
            if (!plan) {
              return null;
            }

            const planItems = getPlanItems(plan);

            return (
              <div key={child.id} className="bg-gray-100 rounded-xl p-4">
                <h2
                  className="text-lg font-semibold text-gray-900 mb-3"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {t("set_for_child", { name: child.name })}
                </h2>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span
                      className="text-gray-700"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {t("toys_in_set")}
                    </span>
                    <span
                      className="text-gray-900 font-medium"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {planItems.reduce(
                        (sum: number, item: any) => sum + item.count,
                        0
                      )}{" "}
                      {t("pcs")}
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
                  {/* Показываем базовую цену и скидку только если есть скидка */}
                  {subscription[0]?.discount_percent &&
                  subscription[0].discount_percent > 0 ? (
                    <>
                      {/* Скидка */}
                      <div className="flex justify-between items-center">
                        <span
                          className="text-gray-700"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          {t("discount")}
                        </span>
                        <span
                          className="text-green-600 font-medium"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          -{subscription[0].discount_percent}%
                        </span>
                      </div>

                      {/* Базовая цена */}
                      <div className="flex justify-between items-center">
                        <span
                          className="text-gray-700"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          {t("base_cost")}
                        </span>
                        <span
                          className="text-gray-900 font-medium"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          ${plan.price_monthly} {t("per_month")}
                        </span>
                      </div>

                      {/* Финальная цена */}
                      <div className="flex justify-between items-center border-t pt-2">
                        <span
                          className="text-gray-900 font-semibold"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          {t("total")}
                        </span>
                        <span
                          className="text-gray-900 font-bold text-lg"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          $
                          {Math.round(
                            (subscription[0] as any).final_price ||
                              plan.price_monthly *
                                (1 -
                                  (subscription[0]?.discount_percent || 0) /
                                    100)
                          )}{" "}
                          {t("per_month")}
                        </span>
                      </div>
                    </>
                  ) : (
                    /* Если скидки нет, показываем только стоимость */
                    <div className="flex justify-between items-center">
                      <span
                        className="text-gray-700"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        {t("cost")}
                      </span>
                      <span
                        className="text-gray-900 font-medium"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        ${plan.price_monthly} {t("per_month")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Общая сумма */}
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <div className="space-y-2">
              {/* Подсчет базовой суммы */}
              {(() => {
                const discountTotal = children.reduce((sum, child) => {
                  const pendingSubscription = child.subscriptions.filter(
                    (subscription) =>
                      subscription.status === SubscriptionStatus.pending_payment
                  );
                  if (pendingSubscription.length > 0) {
                    for (const subscription of pendingSubscription) {
                      const plan = getPlanById(subscription.plan_id);
                      const basePrice = plan?.price_monthly || 0;
                      sum +=
                        basePrice *
                        ((subscription.discount_percent || 0) / 100);
                    }
                  }
                  return sum;
                }, 0);

                return (
                  <>
                    {discountTotal > 0 ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span
                            className="text-gray-700"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            {t("discount")}
                          </span>
                          <span
                            className="text-green-600 font-medium"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            -${Math.round(discountTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-2">
                          <span
                            className="text-xl font-semibold text-gray-900"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            {t("total_amount")}
                          </span>
                          <span
                            className="text-xl font-bold text-gray-900"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            ${totalPrice} {t("per_month")}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span
                          className="text-xl font-semibold text-gray-900"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          {t("total_amount")}
                        </span>
                        <span
                          className="text-xl font-bold text-gray-900"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          ${totalPrice} {t("per_month")}
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Информация об отмене */}
          <div className="mb-8">
            <p
              className="text-gray-500 text-sm text-center leading-relaxed"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              {t("subscription_cancellation_info")}
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
            ? t("preparing_payment")
            : paymentProcessing
            ? t("processing_payment")
            : !totalPrice
            ? t("loading_data")
            : t("pay_and_activate")}
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
                {t("processing_may_take_up_to_15_seconds")}
              </span>
            </div>
          </div>
        )}

        <p
          className="text-center text-gray-500 text-xs leading-relaxed"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {t("you_will_be_redirected_to_payment_service")}
        </p>
      </div>
    </div>
  );
};
