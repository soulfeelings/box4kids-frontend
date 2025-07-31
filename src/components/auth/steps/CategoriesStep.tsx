import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useStore } from "../../../store/store";
import {
  useGetAllInterestsInterestsGet,
  useGetAllSkillsSkillsGet,
  useUpdateChildChildrenChildIdPut,
} from "../../../api-client/";
import { UserChildData } from "../../../types";
import { notifications } from "../../../utils/notifications";
import { StepIndicator } from "../../ui/StepIndicator";
import { useTranslation } from 'react-i18next';

export const CategoriesStep: React.FC<{
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  currentChildToUpdate: UserChildData | null;
}> = ({ onBack, onNext, onClose, currentChildToUpdate }) => {
  const { t } = useTranslation();
  const { updateChild } = useStore();
  const { setError } = useStore();

  const { data: interestsData } = useGetAllInterestsInterestsGet();
  const { data: skillsData } = useGetAllSkillsSkillsGet();
  const updateChildMutation = useUpdateChildChildrenChildIdPut();

  const [selectedInterestsIds, setSelectedInterestsIds] = useState<number[]>(
    []
  );
  const [selectedSkillsIds, setSelectedSkillsIds] = useState<number[]>([]);

  // Синхронизируем состояние с editingChild при изменении
  useEffect(() => {
    if (currentChildToUpdate) {
      setSelectedInterestsIds(currentChildToUpdate.interests || []);
      setSelectedSkillsIds(currentChildToUpdate.skills || []);
    }
  }, [currentChildToUpdate]);

  const dataHasChanged = useMemo(() => {
    if (!currentChildToUpdate) {
      return false;
    }

    const interestsChanged =
      selectedInterestsIds.length !== currentChildToUpdate.interests.length ||
      selectedInterestsIds.some(
        (interestId) => !currentChildToUpdate.interests.includes(interestId)
      );

    const skillsChanged =
      selectedSkillsIds.length !== currentChildToUpdate.skills.length ||
      selectedSkillsIds.some(
        (skillId) => !currentChildToUpdate.skills.includes(skillId)
      );

    return interestsChanged || skillsChanged;
  }, [selectedInterestsIds, selectedSkillsIds, currentChildToUpdate]);

  const handleUpdateChildCategories = useCallback(
    async (interestIds: number[], skillIds: number[]) => {
      if (!currentChildToUpdate) {
        setError(t('child_id_not_found'));
        return;
      }

      if (!dataHasChanged) {
        onNext();
        return;
      }

      try {
        await updateChildMutation.mutateAsync({
          childId: currentChildToUpdate.id,
          data: {
            interest_ids: interestIds,
            skill_ids: skillIds,
          },
        });

        updateChild(currentChildToUpdate.id, {
          interests: interestIds,
          skills: skillIds,
        });

        notifications.dataSaved();

        // Переходим на следующий шаг
        onNext();
      } catch (error) {
        setError(t('failed_to_update_categories'));
        notifications.error(t('failed_to_save_categories'));
      }
    },
    [
      currentChildToUpdate,
      dataHasChanged,
      updateChildMutation,
      onNext,
      setError,
      updateChild,
      t,
    ]
  );

  useEffect(() => {
    if (!currentChildToUpdate) {
      setError(t('child_id_not_found'));
    }
  }, [currentChildToUpdate, setError, t]);

  const handleBack = () => {
    onBack();
  };

  const handleClose = () => {
    onClose();
  };

  // Map API interests to UI format
  const interestItems = interestsData?.interests || [];

  const skillItems = skillsData?.skills || [];

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

        <StepIndicator currentStep={3} />

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
            className="text-md font-medium text-gray-900"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {t('what_interests_your_child')}
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
                  {t('saving_categories')}
                </span>
              </div>
            </div>
          )}

          {/* Interests */}
          <div className="space-y-4">
            <h3
              className="text-md font-semibold text-gray-900"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              {t('interests')}
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
                  <span>{interest.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3
              className="text-md font-semibold text-gray-900"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              {t('skills_for_development')}
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
                  <span>{skill.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 max-w-[800px] mx-auto">
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
          {updateChildMutation.isPending ? t('saving') : t('continue')}
        </button>
      </div>
    </div>
  );
};
