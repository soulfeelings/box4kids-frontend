import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistrationStore } from "../../store/registrationStore";
import {
  useCreateBatchPaymentPaymentsCreateBatchPost,
  useGetAllSubscriptionPlansSubscriptionPlansGet,
  useGetChildChildrenChildIdGet,
} from "../../api-client";
import { ROUTES } from "../../constants/routes";
import { useChildIdLocation } from "./useChildIdLocation";

export const PaymentStep: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptionData, deliveryData, isLoading, setPaymentData } =
    useRegistrationStore();

  const childId = useChildIdLocation();
  const getChildMutation = useGetChildChildrenChildIdGet(childId as number, {
    query: {
      enabled: !!childId,
    },
  });
  const child = getChildMutation.data;

  const { data: plansData } = useGetAllSubscriptionPlansSubscriptionPlansGet();
  const createBatchPaymentMutation =
    useCreateBatchPaymentPaymentsCreateBatchPost();

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const availablePlans = plansData?.plans || [];

  const handleBack = () => {
    navigate(ROUTES.AUTH.DELIVERY);
  };

  const handleClose = () => {
    navigate(ROUTES.DEMO);
  };

  const handlePaymentSubmit = async () => {
    if (!subscriptionData.subscriptionId) return;

    setPaymentProcessing(true);
    try {
      // Создаем платеж
      const paymentResponse = await createBatchPaymentMutation.mutateAsync({
        data: {
          subscription_ids: [subscriptionData.subscriptionId],
        },
      });

      // Сохраняем данные платежа в store
      setPaymentData({
        paymentId: paymentResponse.payment_id,
        status: "created",
      });

      // Переходим к успешному завершению или обработке платежа
      navigate(ROUTES.APP.ROOT); // или другой маршрут для завершения
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Маппинг названия плана к типу
  const mapPlanNameToType = (planName: string): "base" | "premium" => {
    return planName.toLowerCase().includes("базовый") ? "base" : "premium";
  };

  // Получение реальной цены из загруженных планов
  const getSubscriptionPrice = (): number => {
    if (!subscriptionData.plan || availablePlans.length === 0) {
      return 0;
    }

    const selectedPlan = availablePlans.find(
      (plan) => mapPlanNameToType(plan.name) === subscriptionData.plan
    );

    return selectedPlan?.price_monthly || 0;
  };

  // Получение количества игрушек из плана
  const getToyCount = (): number => {
    if (!subscriptionData.plan || availablePlans.length === 0) {
      return 0;
    }

    const selectedPlan = availablePlans.find(
      (plan) => mapPlanNameToType(plan.name) === subscriptionData.plan
    );

    return selectedPlan?.toy_count || 0;
  };

  const price = getSubscriptionPrice();
  const toyCount = getToyCount();

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
          {/* Набор для ребенка */}
          <div className="bg-gray-100 rounded-xl p-4">
            <h2
              className="text-lg font-semibold text-gray-900 mb-3"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Набор для {child?.name}
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className="text-gray-700"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Тариф
                </span>
                <span
                  className="text-gray-900 font-medium"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {subscriptionData.plan === "premium" ? "Премиум" : "Базовый"}
                </span>
              </div>
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
                  {toyCount} шт
                </span>
              </div>
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
                  ${price} / мес.
                </span>
              </div>
            </div>
          </div>

          {/* Адрес доставки */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3
              className="text-sm font-medium text-gray-600 mb-2"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Адрес доставки
            </h3>
            <p
              className="text-gray-900"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              {deliveryData.address}
            </p>
            <p
              className="text-gray-600 text-sm mt-1"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              {deliveryData.date} в {deliveryData.time}
            </p>
          </div>

          {/* Общая сумма */}
          <div className="mb-6">
            <div className="flex justify-between items-center py-2">
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
                ${price} / мес.
              </span>
            </div>
          </div>

          {/* Информация об отмене */}
          <div className="mb-8">
            <p
              className="text-gray-500 text-sm leading-relaxed"
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
          disabled={isLoading || paymentProcessing || !price}
          style={{
            fontFamily: "Nunito, sans-serif",
            backgroundColor:
              isLoading || paymentProcessing || !price ? "#9ca3af" : "#30313D",
          }}
        >
          {isLoading
            ? "Создаем платеж..."
            : paymentProcessing
            ? "Обрабатываем платеж..."
            : !price
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

      {/* Синий элемент справа */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-1 h-24 bg-indigo-400 rounded-l-full"></div>
    </div>
  );
};
