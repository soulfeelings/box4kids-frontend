import React, { useMemo, useState, useEffect } from "react";
import { UserChildData } from "../types";
import { AddNewChildBanner } from "../features/AddNewChildBanner";
import {
  useNavigateToOnboarding,
  useNavigateToEditChild,
  useNavigateToCancelSubscription,
} from "../hooks/useNavigateHooks";
import { AUTH_STEPS } from "../constants/auth";
import { BottomNavigation } from "../features/BottomNavigation";
import {
  useGetAllInterestsInterestsGet,
  useGetAllSkillsSkillsGet,
} from "../api-client";
import { useStore } from "../store/store";
import { useSubscriptionPlan } from "../store/hooks";
import { InterestResponse } from "../api-client/model/interestResponse";
import { SkillResponse } from "../api-client/model/skillResponse";
import { useHandleDeleteChilld } from "../features/useHandleDeleteChilld";
import { NoSubscribtionsView } from "../features/NoSubscribtionsView";
import { SubscriptionStatus } from "../api-client/model";
import { ChildInfoWidget } from "../widgets/child-info";
import { useTranslation } from 'react-i18next';
import { LoadingComponent } from "../components/common/LoadingComponent";
import { ActionButton } from "../features/ActionButton";

export const ChildrenPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useStore();
  const navigateToOnboarding = useNavigateToOnboarding();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: interests } = useGetAllInterestsInterestsGet();
  const { data: skills } = useGetAllSkillsSkillsGet();

  useEffect(() => {
    // Симулируем загрузку данных
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingComponent type="children" />;
  }

  return (
    <div
      className="w-full min-h-screen"
      style={{ fontFamily: "Nunito, sans-serif", backgroundColor: "#FFE8C8" }}
    >
      {/* Header */}
      <div
        className="p-4 flex items-center justify-center relative"
        style={{ backgroundColor: "#FFE8C8" }}
      >
        <h1 className="text-lg font-semibold text-gray-800">{t('children_and_sets')}</h1>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {user?.children.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            interests={interests?.interests || []}
            skills={skills?.skills || []}
          />
        ))}

        {user?.children.length === 0 && (
          <NoSubscribtionsView
            onClickButton={() => {
              navigateToOnboarding({ step: AUTH_STEPS.CHILD });
            }}
            textButton={t('add_child')}
          />
        )}

        {user?.children.length !== 0 && (
          <AddNewChildBanner
            className="mb-4"
            onClick={() => {
              navigateToOnboarding({ step: AUTH_STEPS.CHILD });
            }}
          />
        )}
      </div>
      <BottomNavigation 
        onHomeClick={() => {
          // Навигация на главную страницу
        }}
        onChildrenClick={() => {
          // Уже на странице детей
        }}
        onProfileClick={() => {
          // Навигация на профиль
        }}
      />
    </div>
  );
};

function ChildCard({
  child,
  interests,
  skills,
}: {
  child: UserChildData;
  interests: InterestResponse[];
  skills: SkillResponse[];
}) {
  const { t } = useTranslation();
  const { setCurrentChildIdToUpdate } = useStore();
  const navigateToEditChild = useNavigateToEditChild();
  const navigateToCancelSubscription = useNavigateToCancelSubscription();
  const navigateToOnboarding = useNavigateToOnboarding();

  const childInterest = useMemo(() => {
    return child.interests
      .map((interest) => interests.find((i) => i.id === interest))
      .filter((interest) => interest !== undefined) as InterestResponse[];
  }, [child.interests, interests]);

  const childSkills = useMemo(() => {
    return child.skills
      .map((skill) => skills.find((s) => s.id === skill))
      .filter((skill) => skill !== undefined) as SkillResponse[];
  }, [child.skills, skills]);

  const subscription = useMemo(() => {
    return child.subscriptions[0] ?? null;
  }, [child.subscriptions]);

  const subscriptionPlan = useSubscriptionPlan(subscription?.plan_id);

  const { handleDeleteChild } = useHandleDeleteChilld();

  return (
    <div className="bg-white rounded-2xl p-4 mb-4" key={child.id}>
      <ChildInfoWidget
        child={child}
        interests={childInterest}
        skills={childSkills}
        subscriptionPlan={subscriptionPlan}
      />

      {/* Toy Set Composition */}
      {subscriptionPlan && (
        <div className="mb-6">
          <h4 className="text-gray-800 font-medium mb-3">
            {t('toy_set_composition')}
          </h4>
          <div className="space-y-3">
            {subscriptionPlan.toy_configurations?.map((toy) => (
              <div className="flex items-center" key={toy.id}>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  {toy.icon}
                </div>
                <span className="text-gray-700">
                  x{toy.quantity} {toy.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription warning block */}
      {subscriptionPlan &&
        subscription &&
        subscription.status === SubscriptionStatus.paused && (
          <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: "#FCEFE7" }}>
            <p className="text-sm leading-5" style={{ color: "#DC7E45" }}>
              {t('subscription_paused_warning')}
            </p>
          </div>
        )}

      {/* Action buttons */}
      <div className="space-y-3 pt-4">
        {/* ----- ACTIVE subscription ----- */}
        {subscriptionPlan && subscription && subscription.status === SubscriptionStatus.active && (
          <>
            {/* Edit child data */}
            <ActionButton
              onClick={() => {
                navigateToEditChild({ childId: child.id });
              }}
              variant="secondary"
            >
              {t('edit_child_data')}
            </ActionButton>

            {/* Edit tariff */}
            <ActionButton
              onClick={() => {
                navigateToOnboarding({ step: AUTH_STEPS.SUBSCRIPTION });
                setCurrentChildIdToUpdate(child.id);
              }}
              variant="secondary"
            >
              {t('edit_tariff')}
            </ActionButton>

            {/* Stop subscription */}
            <ActionButton
              onClick={() => {
                navigateToCancelSubscription({ subscriptionId: subscription.id });
              }}
              variant="danger"
            >
              {t('pause_subscription')}
            </ActionButton>
          </>
        )}

        {/* ----- PAUSED subscription ----- */}
        {subscriptionPlan && subscription && subscription.status === SubscriptionStatus.paused && (
          <>
            {/* Resume subscription */}
            <ActionButton
              onClick={() => {
                navigateToCancelSubscription({ subscriptionId: subscription.id });
              }}
              variant="primary"
            >
              {t('resume_subscription')}
            </ActionButton>

            {/* Edit child data */}
            <ActionButton
              onClick={() => {
                navigateToEditChild({ childId: child.id });
              }}
              variant="secondary"
            >
              {t('edit_child_data')}
            </ActionButton>

            {/* Delete child */}
            <ActionButton
              onClick={() => {
                handleDeleteChild(child.id);
              }}
              variant="danger"
            >
              {t('delete')}
            </ActionButton>
          </>
        )}

        {/* ----- NO subscription ----- */}
        {!subscription && (
          <>
            {/* Edit child data */}
            <ActionButton
              onClick={() => {
                navigateToEditChild({ childId: child.id });
              }}
              variant="secondary"
            >
              {t('edit_child_data')}
            </ActionButton>

            {/* Choose tariff */}
            <ActionButton
              onClick={() => {
                navigateToOnboarding({ step: AUTH_STEPS.SUBSCRIPTION });
                setCurrentChildIdToUpdate(child.id);
              }}
              variant="secondary"
            >
              {t('choose_tariff')}
            </ActionButton>

            {/* Delete child */}
            <ActionButton
              onClick={() => {
                handleDeleteChild(child.id);
              }}
              variant="danger"
            >
              {t('delete')}
            </ActionButton>
          </>
        )}
      </div>
    </div>
  );
}
