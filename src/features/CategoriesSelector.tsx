import React, { useEffect, useState } from "react";
import { InterestResponse, SkillResponse } from "../api-client/model";
import { UserChildData } from "../types";
import { useTranslation } from 'react-i18next';

interface CategoriesSelectorProps {
  child?: UserChildData;
  interests: InterestResponse[];
  skills: SkillResponse[];
  onInterestsChange: (interestIds: number[]) => void;
  onSkillsChange: (skillIds: number[]) => void;
  isDisabled?: boolean;
}

export const CategoriesSelector: React.FC<CategoriesSelectorProps> = ({
  child,
  interests,
  skills,
  onInterestsChange,
  onSkillsChange,
  isDisabled = false,
}) => {
  const { t } = useTranslation();
  const [selectedInterestsIds, setSelectedInterestsIds] = useState<number[]>(
    []
  );
  const [selectedSkillsIds, setSelectedSkillsIds] = useState<number[]>([]);

  // Инициализация данных при загрузке
  useEffect(() => {
    if (child) {
      setSelectedInterestsIds(child.interests || []);
      setSelectedSkillsIds(child.skills || []);
    }
  }, [child]);

  // Уведомляем родительский компонент об изменениях
  useEffect(() => {
    onInterestsChange(selectedInterestsIds);
  }, [selectedInterestsIds, onInterestsChange]);

  useEffect(() => {
    onSkillsChange(selectedSkillsIds);
  }, [selectedSkillsIds, onSkillsChange]);

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

  return (
    <div className="space-y-8">
      {/* Interests */}
      <div className="space-y-4">
        <h3
          className="text-lg font-semibold text-gray-900"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {t('interests')}
        </h3>
        <div className="flex flex-wrap gap-3">
          {interests.map((interest) => (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              disabled={isDisabled}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                selectedInterestsIds.includes(interest.id)
                  ? "bg-indigo-400 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <span>{interest.name}</span>
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
          {t('skills_for_development')}
        </h3>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => toggleSkill(skill.id)}
              disabled={isDisabled}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                selectedSkillsIds.includes(skill.id)
                  ? "bg-indigo-400 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <span>{skill.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
