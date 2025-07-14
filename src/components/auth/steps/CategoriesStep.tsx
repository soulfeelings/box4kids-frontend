import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistrationStore } from "../../../store/registrationStore";
import {
  useGetAllInterestsInterestsGet,
  useGetAllSkillsSkillsGet,
  useGetChildChildrenChildIdGet,
  useUpdateChildChildrenChildIdPut,
} from "../../../api-client/";
import { ROUTES } from "../../../constants/routes";
import { useChildIdLocation } from "../useChildIdLocation";

export const CategoriesStep: React.FC = () => {
  const navigate = useNavigate();
  const childId = useChildIdLocation();
  const { setError } = useRegistrationStore();

  const { data: interestsData } = useGetAllInterestsInterestsGet();
  const { data: skillsData } = useGetAllSkillsSkillsGet();
  const updateChildMutation = useUpdateChildChildrenChildIdPut();
  const getChildMutation = useGetChildChildrenChildIdGet(childId as number, {
    query: {
      enabled: !!childId,
    },
  });

  const child = getChildMutation.data;

  const [selectedInterestsIds, setSelectedInterestsIds] = useState<number[]>(
    []
  );
  const [selectedSkillsIds, setSelectedSkillsIds] = useState<number[]>([]);

  // Синхронизируем состояние с editingChild при изменении
  useEffect(() => {
    if (child) {
      setSelectedInterestsIds(
        child.interests?.map((interest) => interest.id) || []
      );
      setSelectedSkillsIds(child.skills?.map((skill) => skill.id) || []);
    }
  }, [child]);

  const handleUpdateChildCategories = async (
    interestIds: number[],
    skillIds: number[]
  ) => {
    if (!childId) {
      setError("ID ребенка не найден");
      return;
    }

    try {
      await updateChildMutation.mutateAsync({
        childId,
        data: {
          interest_ids: interestIds,
          skill_ids: skillIds,
        },
      });

      // Переходим на следующий шаг
      navigate(ROUTES.AUTH.SUBSCRIPTION);
    } catch (error) {
      setError("Не удалось обновить категории");
    }
  };

  const handleBack = () => {
    navigate(ROUTES.AUTH.CHILD);
  };

  const handleClose = () => {
    navigate(ROUTES.APP.ROOT);
  };

  // Map API interests to UI format
  const interestItems =
    interestsData?.interests.map((interest) => {
      // Extract emoji and label from API response like "🧱 Конструкторы"
      const match = interest.name.match(/^(\S+)\s+(.+)$/);
      if (match) {
        return { emoji: match[1], label: match[2], id: interest.id };
      }
      return { emoji: "🎯", label: interest.name, id: interest.id };
    }) || [];

  const skillItems =
    skillsData?.skills.map((skill) => {
      // Extract emoji and label from API response like "✋ Моторика"
      const match = skill.name.match(/^(\S+)\s+(.+)$/);
      if (match) {
        return { emoji: match[1], label: match[2], id: skill.id };
      }
      return { emoji: "⭐", label: skill.name, id: skill.id };
    }) || [];

  const toggleInterest = (interestId: number) => {
    const newInterests = selectedInterestsIds.includes(interestId)
      ? selectedInterestsIds.filter((i) => i !== interestId)
      : [...selectedInterestsIds, interestId];

    setSelectedInterestsIds(newInterests);
  };

  const toggleSkill = (skillId: number) => {
    const newSkills = selectedSkillsIds.includes(skillId)
      ? selectedSkillsIds.filter((s) => s !== skillId)
      : [...selectedSkillsIds, skillId];

    setSelectedSkillsIds(newSkills);
  };

  const isCategoriesFormValid =
    selectedInterestsIds.length > 0 && selectedSkillsIds.length > 0;

  // Проверяем наличие editingChild и ID ребенка
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
          Шаг 3/6
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
            Что интересно вашему ребёнку?
          </h1>
        </div>

        <div className="space-y-8">
          {/* Loading indicator */}
          {updateChildMutation.isPending && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                <span
                  className="text-gray-600 font-medium"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Сохраняем категории...
                </span>
              </div>
            </div>
          )}

          {/* Interests */}
          <div className="space-y-4">
            <h3
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Интересы
            </h3>
            <div className="flex flex-wrap gap-3">
              {interestItems.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedInterestsIds.includes(interest.id)
                      ? "bg-indigo-400 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{ fontFamily: "Nunito, sans-serif" }}
                  disabled={updateChildMutation.isPending}
                >
                  <span className="text-base">{interest.emoji}</span>
                  <span>{interest.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Навыки для развития
            </h3>
            <div className="flex flex-wrap gap-3">
              {skillItems.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => toggleSkill(skill.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedSkillsIds.includes(skill.id)
                      ? "bg-indigo-400 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{ fontFamily: "Nunito, sans-serif" }}
                  disabled={updateChildMutation.isPending}
                >
                  <span className="text-base">{skill.emoji}</span>
                  <span>{skill.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
        <button
          className={`w-full rounded-[32px] py-4 text-base font-medium transition-all ${
            isCategoriesFormValid && !updateChildMutation.isPending
              ? "text-white shadow-sm"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isCategoriesFormValid || updateChildMutation.isPending}
          onClick={() =>
            handleUpdateChildCategories(selectedInterestsIds, selectedSkillsIds)
          }
          style={{
            fontFamily: "Nunito, sans-serif",
            backgroundColor:
              isCategoriesFormValid && !updateChildMutation.isPending
                ? "#30313D"
                : undefined,
          }}
        >
          {updateChildMutation.isPending ? "Сохраняем..." : "Продолжить"}
        </button>
      </div>
    </div>
  );
};
