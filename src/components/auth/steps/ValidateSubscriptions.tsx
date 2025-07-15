import {
  useGetAllInterestsInterestsGet,
  useGetAllSkillsSkillsGet,
} from "../../../api-client";
import { InterestResponse } from "../../../api-client/model";
import { SkillResponse } from "../../../api-client/model/skillResponse";
import { SubscriptionStatus } from "../../../api-client/model/subscriptionStatus";
import { useHandleDeleteChilld } from "../../../features/useHandleDeleteChilld";
import { useStore } from "../../../store";
import { useChildrenWithoutSubscriptionByStatus } from "../../../store/hooks";
import { ChildrenOverviewView } from "./subscription-step-components/ChildrenOverviewView";
import {
  useNavigateToEditChild,
  useNavigateToOnboarding,
} from "../../../hooks/useNavigateHooks";

export const ValidateSubscriptionsStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  onAddNewChild: () => void;
  onEditChildSubscription: (childId: number) => void;
  onEditChildData: (childId: number) => void;
}> = ({
  onBack,
  onNext,
  onClose,
  // onAddNewChild,
  // onEditChildSubscription,
  // onEditChildData,
  ...props
}) => {
  const { data: interestsData } = useGetAllInterestsInterestsGet();
  const { data: skillsData } = useGetAllSkillsSkillsGet();

  const { handleDeleteChild } = useHandleDeleteChilld();

  const navigateToEditChild = useNavigateToEditChild();
  const navigateToOnboarding = useNavigateToOnboarding();

  const handleEditChildSubscription = (childId: number) => {
    navigateToOnboarding({ step: "subscription" });
  };

  const handleAddNewChild = () => {
    navigateToOnboarding({ step: "child" });
  };

  const handleEditChildData = (childId: number) => {
    navigateToEditChild({ childId });
  };

  // Получаем детей без активной подписки из store
  const childrenWithoutActiveSubscription =
    useChildrenWithoutSubscriptionByStatus([
      SubscriptionStatus.active,
      SubscriptionStatus.paused,
    ]);

  const interests: InterestResponse[] = interestsData?.interests || [];
  const skills: SkillResponse[] = skillsData?.skills || [];

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "#F2F2F2" }}
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

        <span
          className="text-sm font-medium text-gray-600"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Шаг 4/6
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
      <div className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
        {/* Title */}
        <div className="text-center mt-4 mb-6">
          <h1
            className="text-xl font-medium text-gray-900"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Проверьте состав наборов для Ваших детей
          </h1>
          <p
            className="text-sm text-gray-600 mt-2"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Показаны только дети без активной подписки
          </p>
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
          <ChildrenOverviewView
            children={childrenWithoutActiveSubscription}
            interests={interests}
            skills={skills}
            onEditData={handleEditChildData}
            onEditSubscription={handleEditChildSubscription}
            onDelete={handleDeleteChild}
            onAddNewChild={handleAddNewChild}
            getSubscriptionPlan={(id: number) =>
              useStore
                .getState()
                .subscriptionPlans.find((plan) => plan.id === id) || null
            }
          />
        </div>
      </div>

      {/* Bottom action button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
        <button
          className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${"text-white shadow-sm"}`}
          style={{
            fontFamily: "Nunito, sans-serif",
            backgroundColor: "#30313D",
          }}
          onClick={onNext}
        >
          Перейти к оформлению
        </button>
      </div>
    </div>
  );
};
