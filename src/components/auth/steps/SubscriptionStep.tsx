import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistrationStore } from "../../../store/registrationStore";
import {
  useGetAllSubscriptionPlansSubscriptionPlansGet,
  useCreateSubscriptionOrderSubscriptionsPost,
  useGetAllInterestsInterestsGet,
  useGetAllSkillsSkillsGet,
  useGetChildChildrenChildIdGet,
} from "../../../api-client/";
import { ROUTES } from "../../../constants/routes";
import { useChildIdLocation } from "../useChildIdLocation";

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

export const SubscriptionStep: React.FC = () => {
  const navigate = useNavigate();
  const childId = useChildIdLocation();
  const { subscriptionData, setSubscriptionData, isLoading } =
    useRegistrationStore();

  const { data: plansData, isLoading: isLoadingPlans } =
    useGetAllSubscriptionPlansSubscriptionPlansGet();
  const createSubscriptionMutation =
    useCreateSubscriptionOrderSubscriptionsPost();
  const { data: interestsData } = useGetAllInterestsInterestsGet();
  const { data: skillsData } = useGetAllSkillsSkillsGet();
  const getChildMutation = useGetChildChildrenChildIdGet(childId as number, {
    query: {
      enabled: !!childId,
    },
  });

  const child = getChildMutation.data;

  const availablePlans = plansData?.plans || [];

  // Функции для получения названий по ID
  const getInterestName = (id: number) => {
    const interest = interestsData?.interests.find((i) => i.id === id);
    return interest?.name || `Интерес ${id}`;
  };

  const getSkillName = (id: number) => {
    const skill = skillsData?.skills.find((s) => s.id === id);
    return skill?.name || `Навык ${id}`;
  };

  const handleBack = () => {
    navigate(ROUTES.AUTH.CATEGORIES);
  };

  const handleClose = () => {
    navigate(ROUTES.DEMO);
  };

  // Вычисление возраста
  const calculateAge = (birthDate: string): string => {
    const [day, month, year] = birthDate.split(".").map(Number);
    const birth = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return `${age} лет`;
  };

  // Маппинг названия плана к типу
  const mapPlanNameToType = (planName: string): "base" | "premium" => {
    return planName.toLowerCase().includes("базовый") ? "base" : "premium";
  };

  const handleSubscriptionSubmit = async () => {
    if (!subscriptionData.plan || !childId) return;

    const selectedPlan = availablePlans.find(
      (plan) => mapPlanNameToType(plan.name) === subscriptionData.plan
    );

    if (!selectedPlan) return;

    try {
      await createSubscriptionMutation.mutateAsync({
        data: {
          child_id: childId,
          plan_id: selectedPlan.id,
        },
      });

      // Обновляем данные подписки в store
      setSubscriptionData({
        subscriptionId: selectedPlan.id,
        plan: subscriptionData.plan,
      });

      // Переходим к следующему шагу
      navigate(ROUTES.AUTH.DELIVERY);
    } catch (error) {
      console.error("Failed to create subscription:", error);
    }
  };

  const isSubscriptionValid = subscriptionData.plan !== "";

  useEffect(() => {
    if (!childId) {
      navigate(ROUTES.AUTH.CHILD);
    }
  }, [childId, navigate]);

  if (!childId) {
    return null;
  }

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
            Какой набор подойдёт {child?.name}?
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

          {/* Child Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <span className="font-semibold text-2xl">
                  {child?.gender === "male" ? "👦🏻" : "👩🏻"}
                </span>
              </div>
              <div>
                <h2
                  className="font-semibold text-gray-900"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {child?.name},{" "}
                  {child?.date_of_birth
                    ? calculateAge(child.date_of_birth)
                    : ""}
                </h2>
              </div>
            </div>

            {/* Интересы */}
            <div className="mb-4">
              <h3
                className="text-sm font-medium text-gray-600 mb-2"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Интересы
              </h3>
              <div className="flex flex-wrap gap-2">
                {child?.interests?.map((interest, idx) => {
                  const interestName = getInterestName(interest.id);
                  // Извлекаем эмодзи и текст из названия интереса
                  const match = interestName.match(/^(\S+)\s+(.+)$/);
                  const emoji = match ? match[1] : "🎯";
                  const name = match ? match[2] : interestName;

                  return (
                    <Tag key={idx} selected={true}>
                      <span className="mr-1">{emoji}</span>
                      {name}
                    </Tag>
                  );
                })}
              </div>
            </div>

            {/* Навыки */}
            <div>
              <h3
                className="text-sm font-medium text-gray-600 mb-2"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Навыки для развития
              </h3>
              <div className="flex flex-wrap gap-2">
                {child?.skills?.map((skill, idx) => {
                  const skillName = getSkillName(skill.id);
                  // Извлекаем эмодзи и текст из названия навыка
                  const match = skillName.match(/^(\S+)\s+(.+)$/);
                  const emoji = match ? match[1] : "⭐";
                  const name = match ? match[2] : skillName;

                  return (
                    <Tag key={idx} selected={true}>
                      <span className="mr-1">{emoji}</span>
                      {name}
                    </Tag>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Loading plans indicator */}
          {isLoadingPlans && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                <span
                  className="text-gray-600 font-medium"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Загружаем планы подписки...
                </span>
              </div>
            </div>
          )}

          {/* Subscription plans */}
          {availablePlans.map((plan) => {
            const planType = mapPlanNameToType(plan.name);
            const isSelected = subscriptionData.plan === planType;

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
                onClick={() => setSubscriptionData({ plan: planType })}
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
                  disabled={isLoadingPlans || isLoading}
                >
                  {isSelected ? "Выбрано" : "Выбрать"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom action button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
        <button
          className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
            isSubscriptionValid && !isLoadingPlans && !isLoading
              ? "text-white shadow-sm"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          style={{
            fontFamily: "Nunito, sans-serif",
            backgroundColor:
              isSubscriptionValid && !isLoadingPlans && !isLoading
                ? "#30313D"
                : undefined,
          }}
          disabled={!isSubscriptionValid || isLoadingPlans || isLoading}
          onClick={handleSubscriptionSubmit}
        >
          {isLoading
            ? "Создаем подписку..."
            : isLoadingPlans
            ? "Загружаем планы..."
            : "Перейти к оформлению"}
        </button>
      </div>
    </div>
  );
};
