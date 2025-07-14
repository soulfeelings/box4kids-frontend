import React, { useEffect, useState } from "react";
import { useStore } from "../../../store/store";
import {
  useCreateSubscriptionOrderSubscriptionsPost,
  useGetAllInterestsInterestsGet,
  useGetAllSkillsSkillsGet,
} from "../../../api-client/";
import { UserChildData } from "../../../types";
import { AddNewChildBanner } from "../../../features/AddNewChildBanner";
import { calculateAge } from "../../../utils/age/calculateAge";
import { InterestResponse } from "../../../api-client/model/interestResponse";
import { SkillResponse } from "../../../api-client/model/skillResponse";

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

// Subscription plan card component
const SubscriptionPlanCard: React.FC<{
  plan: any;
  isSelected: boolean;
  onSelect: (planId: number) => void;
  isLoading: boolean;
}> = ({ plan, isSelected, onSelect, isLoading }) => {
  return (
    <div
      className={`rounded-3xl p-6 shadow-sm border transition-all cursor-pointer ${
        isSelected
          ? "border-indigo-400"
          : "border-gray-100 hover:border-gray-300"
      }`}
      style={{
        backgroundColor: "#F2F2F2",
      }}
      onClick={() => onSelect(plan.id)}
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
          {plan.toy_configurations?.map((config: any) => (
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
};

// Child overview card component
const ChildOverviewCard: React.FC<{
  child: UserChildData;
  interests: InterestResponse[];
  skills: SkillResponse[];
  onEditData: (childId: number) => void;
  onEditSubscription: (childId: number) => void;
  onDelete: (childId: number) => void;
}> = ({
  child,
  interests,
  skills,
  onEditData,
  onEditSubscription,
  onDelete,
}) => {
  const currentSubscription = child.subscriptions[0];
  const currentPlan = currentSubscription?.plan_id;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
          <span className="font-semibold text-2xl">
            {child.gender === "male" ? "👦🏻" : "👩🏻"}
          </span>
        </div>
        <div>
          <h1
            className="font-semibold text-gray-900"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {child.name}, {calculateAge(child.date_of_birth)} лет
          </h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Интересы */}
        <div>
          <h2
            className="text-md font-semibold text-[#686564] mb-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Интересы
          </h2>
          <div className="flex flex-wrap gap-2">
            {child.interests.map((interestId, idx) => {
              const interest = interests.find((i) => i.id === interestId);
              return (
                <Tag key={idx} selected={true}>
                  {interest?.name}
                </Tag>
              );
            })}
          </div>
        </div>

        {/* Навыки для развития */}
        <div>
          <h2
            className="text-md font-semibold text-[#686564] mb-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Навыки для развития
          </h2>
          <div className="flex flex-wrap gap-2">
            {child.skills.map((skillId, idx) => {
              const skill = skills.find((s) => s.id === skillId);
              return (
                <Tag key={idx} selected={true}>
                  {skill?.name}
                </Tag>
              );
            })}
          </div>
        </div>

        {/* Тариф */}
        <div>
          <h2
            className="text-md font-semibold text-[#686564] mb-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Тариф
          </h2>
          <div
            className="bg-gray-50 rounded-xl p-4"
            style={{ borderRadius: "12px" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="font-medium text-gray-900"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                {currentSubscription ? "Активная подписка" : "Нет подписки"}
              </span>
              {currentSubscription && (
                <>
                  <span className="text-gray-500">•</span>
                  <span
                    className="text-gray-700"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    План ID: {currentPlan}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="space-y-3 pt-4">
          <button
            className="w-full py-3 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
            style={{
              fontFamily: "Nunito, sans-serif",
              borderRadius: "32px",
              backgroundColor: "#E3E3E3",
            }}
            onClick={() => onEditData(child.id)}
          >
            Изменить данные ребёнка
          </button>
          <button
            className="w-full py-3 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
            style={{
              fontFamily: "Nunito, sans-serif",
              borderRadius: "32px",
              backgroundColor: "#E3E3E3",
            }}
            onClick={() => onEditSubscription(child.id)}
          >
            Изменить тариф
          </button>
          <button
            className="w-full py-3 bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors"
            style={{ fontFamily: "Nunito, sans-serif", borderRadius: "32px" }}
            onClick={() => onDelete(child.id)}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

// Children overview view component
const ChildrenOverviewView: React.FC<{
  children: UserChildData[];
  interests: InterestResponse[];
  skills: SkillResponse[];
  onEditData: (childId: number) => void;
  onEditSubscription: (childId: number) => void;
  onDelete: (childId: number) => void;
  onAddNewChild: () => void;
}> = ({
  children,
  interests,
  skills,
  onEditData,
  onEditSubscription,
  onDelete,
  onAddNewChild,
}) => {
  return (
    <div className="space-y-6">
      {children.map((child) => (
        <ChildOverviewCard
          key={child.id}
          child={child}
          interests={interests}
          skills={skills}
          onEditData={onEditData}
          onEditSubscription={onEditSubscription}
          onDelete={onDelete}
        />
      ))}

      {/* Add Child Banner */}
      <AddNewChildBanner onClick={onAddNewChild} />
    </div>
  );
};

// Single child subscription view component
const SingleChildSubscriptionView: React.FC<{
  subscriptionPlans: any[];
  selectedSubscriptionId: number | null;
  onSelectSubscription: (planId: number) => void;
  isLoading: boolean;
}> = ({
  subscriptionPlans,
  selectedSubscriptionId,
  onSelectSubscription,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      {subscriptionPlans.map((plan) => (
        <SubscriptionPlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedSubscriptionId === plan.id}
          onSelect={onSelectSubscription}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export const SubscriptionStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  currentChildToUpdate?: UserChildData;
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

  const {
    isLoading,
    setError,
    getSubscriptionPlan,
    updateChild,
    removeChild,
    subscriptionPlans,
    user,
  } = useStore();

  const createSubscriptionMutation =
    useCreateSubscriptionOrderSubscriptionsPost();

  const { data: interestsData } = useGetAllInterestsInterestsGet();
  const { data: skillsData } = useGetAllSkillsSkillsGet();

  const handleBack = () => {
    onBack();
  };

  const handleClose = () => {
    onClose();
  };

  const handleEditChildData = (childId: number) => {
    // TODO: Navigate to child data edit step
  };

  const handleEditChildSubscription = (childId: number) => {
    const child = user?.children.find((c) => c.id === childId);
    if (child?.subscriptions[0]?.plan_id) {
      setSubscriptionId(child.subscriptions[0].plan_id);
    }
  };

  const handleDeleteChild = (childId: number) => {
    const child = user?.children.find((c) => c.id === childId);
    if (child && window.confirm(`Удалить данные ребёнка ${child.name}?`)) {
      removeChild(childId);
    }
  };

  const handleAddNewChild = () => {
    if (onAddNewChild) {
      onAddNewChild();
    }
  };

  // Маппинг названия плана к типу
  const mapPlanNameToType = (planName: string): "base" | "premium" => {
    return planName.toLowerCase().includes("базовый") ? "base" : "premium";
  };

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

    const subscriptionPlan = getSubscriptionPlan(subscriptionId);
    if (!subscriptionPlan) {
      setError("Не загрузились планы подписки");
      return;
    }

    try {
      await createSubscriptionMutation.mutateAsync({
        data: {
          child_id: targetChild.id,
          plan_id: subscriptionPlan.id,
        },
      });

      // Обновляем данные подписки в store
      updateChild(targetChild.id, {
        subscriptions: [
          {
            id: subscriptionId,
            plan_id: subscriptionPlan.id,
            child_id: targetChild.id,
            delivery_info_id: null,
            status: targetChild.subscriptions[0]?.status || "active",
            discount_percent:
              targetChild.subscriptions[0]?.discount_percent || 0,
            created_at:
              targetChild.subscriptions[0]?.created_at ||
              new Date().toISOString(),
            expires_at:
              targetChild.subscriptions[0]?.expires_at ||
              new Date().toISOString(),
          },
        ],
      });

      // Если мы были в режиме редактирования, выходим из него
      // Переходим к следующему шагу
      onNext();
    } catch (error) {
      console.error("Failed to create subscription:", error);
    }
  };

  // Определяем текущий режим отображения
  const allChildren = user?.children || [];
  const hasMultipleChildren = allChildren.length > 1;
  const allChildrenHaveSubscriptions = allChildren.every(
    (child) => child.subscriptions.length > 0
  );
  const shouldShowOverview =
    hasMultipleChildren && allChildrenHaveSubscriptions;

  const isSubscriptionValid = subscriptionId !== null;

  // Подготавливаем данные для отображения
  const interests: InterestResponse[] = interestsData?.interests || [];
  const skills: SkillResponse[] = skillsData?.skills || [];

  // Определяем заголовок
  const getTitle = () => {
    if (shouldShowOverview) {
      return "Проверьте составы набора Ваших детей";
    }
    return `Какой набор подойдёт ${currentChildToUpdate?.name || "ребёнку"}?`;
  };

  // Определяем цвет фона
  const getBackgroundColor = () => {
    return shouldShowOverview ? "#F2F2F2" : "white";
  };

  const isButtonEnabled = () => {
    return (shouldShowOverview || isSubscriptionValid) && !isLoading;
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: getBackgroundColor() }}
    >
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
            {getTitle()}
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

          {/* Conditional content based on mode */}
          {shouldShowOverview ? (
            <ChildrenOverviewView
              children={allChildren}
              interests={interests}
              skills={skills}
              onEditData={console.log}
              onEditSubscription={handleEditChildSubscription}
              onDelete={handleDeleteChild}
              onAddNewChild={handleAddNewChild}
            />
          ) : (
            <>
              <SingleChildSubscriptionView
                subscriptionPlans={subscriptionPlans}
                selectedSubscriptionId={subscriptionId}
                onSelectSubscription={setSubscriptionId}
                isLoading={isLoading}
              />

              {onAddNewChild && (
                <AddNewChildBanner onClick={handleAddNewChild} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom action button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
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
