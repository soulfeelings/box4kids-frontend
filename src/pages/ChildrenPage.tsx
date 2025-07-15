import React, { useMemo } from "react";
import { UserChildData } from "../types";
import { AddNewChildBanner } from "../features/AddNewChildBanner";
import { ROUTES } from "../constants/routes";
import { useNavigate } from "react-router-dom";
import { AUTH_STEPS } from "../constants/auth";
import { calculateAge } from "../utils/age/calculateAge";
import { BottomNavigation } from "../features/BottomNavigation";
import {
  useGetAllInterestsInterestsGet,
  useGetAllSkillsSkillsGet,
} from "../api-client";
import { useStore } from "../store/store";
import { InterestResponse } from "../api-client/model/interestResponse";
import { SkillResponse } from "../api-client/model/skillResponse";
import { useHandleDeleteChilld } from "../features/useHandleDeleteChilld";
import { NoSubscribtionsView } from "../features/NoSubscribtionsView";
import { SubscriptionStatus } from "../api-client/model";
import { Tag } from "../components/Tag";
import { ChildInfoWidget } from "../widgets/child-info";

export const ChildrenPage: React.FC = () => {
  const { user, getSubscriptionPlan } = useStore();
  const navigate = useNavigate();

  const { data: interests } = useGetAllInterestsInterestsGet();
  const { data: skills } = useGetAllSkillsSkillsGet();

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
        <h1 className="text-lg font-semibold text-gray-800">Дети и наборы</h1>
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
              navigate(ROUTES.AUTH.ONBOARDING, {
                state: {
                  step: AUTH_STEPS.CHILD,
                },
              });
            }}
            textButton="Добавить ребенка"
          />
        )}

        {user?.children.length !== 0 && (
          <AddNewChildBanner
            className="mb-4"
            onClick={() => {
              navigate(ROUTES.AUTH.ONBOARDING, {
                state: {
                  step: AUTH_STEPS.CHILD,
                },
              });
            }}
          />
        )}
      </div>
      <BottomNavigation />
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
  const { getSubscriptionPlan, setCurrentChildIdToUpdate } = useStore();
  const navigate = useNavigate();

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

  const subscriptionPlan = useMemo(() => {
    return getSubscriptionPlan(subscription?.plan_id);
  }, [subscription, getSubscriptionPlan]);

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
            Состав набора игрушек
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

      {/* Action buttons */}
      <div className="space-y-3">
        {subscriptionPlan &&
        subscription.status === SubscriptionStatus.active ? (
          <>
            <button
              onClick={() => {
                navigate(ROUTES.AUTH.ONBOARDING, {
                  state: {
                    step: AUTH_STEPS.SUBSCRIPTION,
                  },
                });
                setCurrentChildIdToUpdate(child.id);
              }}
              className="w-full bg-black text-white py-2 rounded-2xl text-sm font-medium"
            >
              Остановить подписку
            </button>
            <button
              onClick={() => {
                navigate(ROUTES.AUTH.ONBOARDING, {
                  state: {
                    step: AUTH_STEPS.SUBSCRIPTION,
                  },
                });
                setCurrentChildIdToUpdate(child.id);
              }}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-2xl text-sm font-medium"
            >
              Остановить подписку
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              navigate(ROUTES.AUTH.ONBOARDING, {
                state: {
                  step: AUTH_STEPS.SUBSCRIPTION,
                },
              });
              setCurrentChildIdToUpdate(child.id);
            }}
            className="w-full bg-black text-white py-2 rounded-2xl text-sm font-medium"
          >
            Выбрать тариф
          </button>
        )}
        <button
          onClick={() => {
            navigate(`/app/edit-child/${child.id}`);
          }}
          className="w-full bg-[#E3E3E3] text-black py-2 rounded-2xl text-sm font-medium"
        >
          Изменить данные ребенка
        </button>
        <button
          onClick={() => {
            handleDeleteChild(child.id);
          }}
          className="w-full bg-[#FBC8D5] text-[#E14F75] py-2 rounded-2xl text-sm font-medium"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
