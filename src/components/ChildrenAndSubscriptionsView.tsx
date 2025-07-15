import React, { useMemo } from "react";
import { User } from "lucide-react";
import { UserChildData, UserData } from "../types";
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
import { Tag } from "./Tag";
import { useStore } from "../store/store";
import { InterestResponse } from "../api-client/model/interestResponse";
import { SkillResponse } from "../api-client/model/skillResponse";

export const ChildrenAndSubscriptionsView: React.FC = () => {
  const { user, getSubscriptionPlan } = useStore();
  const navigate = useNavigate();

  const { data: interests } = useGetAllInterestsInterestsGet();
  const { data: skills } = useGetAllSkillsSkillsGet();

  const plans = useMemo(() => {
    return user?.children.map((child) =>
      getSubscriptionPlan(child.subscriptions[0].id)
    );
  }, [user]);

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

        <AddNewChildBanner
          onClick={() => {
            navigate(ROUTES.AUTH.ONBOARDING, {
              state: {
                step: AUTH_STEPS.CHILD,
              },
            });
          }}
        />
      </div>
      <BottomNavigation
        onHomeClick={() => {}}
        onChildrenClick={() => {}}
        onProfileClick={() => {}}
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
  const { getSubscriptionPlan } = useStore();

  const interestNames = useMemo(() => {
    return child.interests.map(
      (interest) => interests.find((i) => i.id === interest)?.name
    );
  }, [child.interests, interests]);

  const skillNames = useMemo(() => {
    return child.skills.map(
      (skill) => skills.find((s) => s.id === skill)?.name
    );
  }, [child.skills, skills]);

  const subscriptionPlan = useMemo(() => {
    return getSubscriptionPlan(child.subscriptions[0].id);
  }, [child.subscriptions, getSubscriptionPlan]);

  return (
    <div className="bg-white rounded-2xl p-4 mb-4" key={child.id}>
      {/* Child Info */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {child.gender === "male" ? "👦🏻" : "👩🏻"} {child.name},{" "}
              {calculateAge(child?.date_of_birth)} лет
            </h3>
          </div>
        </div>

        {/* Special Needs */}
        {child?.limitations && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Особенности</p>
            <div className="flex flex-wrap gap-2">
              <Tag>{child.comment}</Tag>
            </div>
          </div>
        )}

        {/* Interests */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Интересы</p>
          <div className="flex flex-wrap gap-2">
            {interestNames.map((name, index) => (
              <Tag key={index}>{name}</Tag>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Навыки для развития</p>
          <div className="flex flex-wrap gap-2">
            {skillNames.map((name, index) => (
              <Tag key={index}>{name}</Tag>
            ))}
          </div>
        </div>

        {/* Subscription */}
        {subscriptionPlan && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Тариф</p>
            <Tag>
              {subscriptionPlan?.name} • {subscriptionPlan?.toy_count} игрушек •
              ${subscriptionPlan?.price_monthly} /мес
            </Tag>
          </div>
        )}
      </div>

      {/* Toy Set Composition */}
      {subscriptionPlan && (
        <div className="mb-6">
          <h4 className="text-gray-800 font-medium mb-3">
            Состав набора игрушек
          </h4>
          <div className="space-y-3">
            {subscriptionPlan.toy_configurations?.map((toy) => (
              <div className="flex items-center">
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
        {subscriptionPlan ? (
          <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-2xl text-sm font-medium">
            Изменить тариф
          </button>
        ) : (
          <button className="w-full bg-black text-white py-2 rounded-2xl text-sm font-medium">
            Выбрать тариф
          </button>
        )}
        <button className="w-full bg-[#E3E3E3] text-black py-2 rounded-2xl text-sm font-medium">
          Изменить данные ребенка
        </button>
        <button className="w-full bg-[#FBC8D5] text-[#E14F75] py-2 rounded-2xl text-sm font-medium">
          Удалить
        </button>
      </div>
    </div>
  );
}
