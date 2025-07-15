import React, { useEffect, useMemo, useState, useCallback } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEditChildParams } from "../hooks/useTypedParams";
import { BottomNavigation } from "../features/BottomNavigation";
import { ChildEditForm } from "../features/ChildEditForm";
import { CategoriesSelector } from "../features/CategoriesSelector";
import { ActionButton } from "../features/ActionButton";
import { useStore } from "../store/store";
import { selectChildById } from "../store/selectors";
import {
  useGetAllInterestsInterestsGet,
  useGetAllSkillsSkillsGet,
  useUpdateChildChildrenChildIdPut,
} from "../api-client/";
import { Gender } from "../api-client/model/gender";
import { convertDateFromISO, convertDateToISO } from "../utils/date/convert";
import { validateBirthDate } from "../utils/date/validate";
import { UserChildData } from "../types";
import { notifications } from "../utils/notifications";
import { ROUTES } from "../constants/routes";

interface ChildData {
  name: string;
  date_of_birth: string;
  gender: Gender;
  limitations: boolean;
  comment?: string | null;
}

export const EditChildPage: React.FC = () => {
  const { childId } = useEditChildParams();
  const navigate = useNavigate();
  const { updateChild, setError } = useStore();

  const { data: interestsData } = useGetAllInterestsInterestsGet();
  const { data: skillsData } = useGetAllSkillsSkillsGet();
  const updateChildMutation = useUpdateChildChildrenChildIdPut();

  // Находим ребенка по ID
  const currentChild = useStore(
    selectChildById(childId ? parseInt(childId) : 0)
  );

  // Состояние для данных ребенка
  const [childData, setChildData] = useState<ChildData>({
    name: "",
    date_of_birth: "",
    gender: "male",
    limitations: false,
    comment: "",
  });

  const handleClose = () => {
    navigate(-1);
  };

  // Состояние для интересов и навыков
  const [selectedInterestsIds, setSelectedInterestsIds] = useState<number[]>(
    []
  );
  const [selectedSkillsIds, setSelectedSkillsIds] = useState<number[]>([]);

  // Обработчики изменений
  const handleChildDataChange = useCallback((data: ChildData) => {
    setChildData(data);
  }, []);

  const handleInterestsChange = useCallback((interestIds: number[]) => {
    setSelectedInterestsIds(interestIds);
  }, []);

  const handleSkillsChange = useCallback((skillIds: number[]) => {
    setSelectedSkillsIds(skillIds);
  }, []);

  // Проверка изменений в данных ребенка
  const isChildDataChanged = useMemo(() => {
    if (!currentChild) return false;
    return (
      childData.name !== currentChild.name ||
      childData.date_of_birth !== currentChild.date_of_birth ||
      childData.gender !== currentChild.gender ||
      childData.limitations !== currentChild.limitations ||
      childData.comment !== currentChild.comment
    );
  }, [childData, currentChild]);

  // Проверка изменений в категориях
  const isCategoriesChanged = useMemo(() => {
    if (!currentChild) return false;

    const interestsChanged =
      selectedInterestsIds.length !== currentChild.interests.length ||
      selectedInterestsIds.some(
        (interestId) => !currentChild.interests.includes(interestId)
      );

    const skillsChanged =
      selectedSkillsIds.length !== currentChild.skills.length ||
      selectedSkillsIds.some(
        (skillId) => !currentChild.skills.includes(skillId)
      );

    return interestsChanged || skillsChanged;
  }, [selectedInterestsIds, selectedSkillsIds, currentChild]);

  // Валидация формы
  const birthDateValidation = validateBirthDate(childData.date_of_birth);
  const isChildFormValid =
    childData.name.trim() &&
    birthDateValidation.isValid &&
    childData.gender &&
    (childData.limitations === false ||
      (childData.limitations === true && childData.comment?.trim()));

  const isCategoriesFormValid =
    selectedInterestsIds.length > 0 && selectedSkillsIds.length > 0;

  const isFormValid = isChildFormValid && isCategoriesFormValid;
  const hasChanges = isChildDataChanged || isCategoriesChanged;

  const handleSave = async () => {
    if (!isFormValid || !currentChild) return;

    try {
      const updateData: any = {};

      // Добавляем данные ребенка если они изменились
      if (isChildDataChanged) {
        updateData.name = childData.name;
        updateData.date_of_birth = convertDateToISO(childData.date_of_birth);
        updateData.gender = childData.gender as Gender;
        updateData.has_limitations = childData.limitations;
        updateData.comment = childData.comment;
      }

      // Добавляем категории если они изменились
      if (isCategoriesChanged) {
        updateData.interest_ids = selectedInterestsIds;
        updateData.skill_ids = selectedSkillsIds;
      }

      const updatedChild = await updateChildMutation.mutateAsync({
        childId: currentChild.id,
        data: updateData,
      });

      // Обновляем в store
      updateChild(currentChild.id, {
        name: updatedChild.name,
        date_of_birth: convertDateFromISO(updatedChild.date_of_birth),
        gender: updatedChild.gender,
        limitations: updatedChild.has_limitations,
        comment: updatedChild.comment,
        interests: updatedChild.interests.map((interest) => interest.id),
        skills: updatedChild.skills.map((skill) => skill.id),
      });

      notifications.childUpdated();
    } catch (error) {
      console.error("Failed to update child:", error);
      setError("Не удалось обновить ребёнка");
      notifications.error("Не удалось сохранить данные ребенка");
    }
  };

  // Если ребенок не найден
  if (!currentChild) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Ребенок не найден</p>
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-center relative">
          <h1 className="text-[20px] font-semibold text-gray-900 text-center">
            Изменить данные ребёнка
          </h1>
          <button
            onClick={handleClose}
            className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24 overflow-y-auto">
        <div className="space-y-6">
          {/* Child Edit Form */}
          <ChildEditForm
            child={currentChild}
            onDataChange={handleChildDataChange}
            isDisabled={updateChildMutation.isPending}
          />

          {/* Categories Selector */}
          <CategoriesSelector
            child={currentChild}
            interests={interestsData?.interests || []}
            skills={skillsData?.skills || []}
            onInterestsChange={handleInterestsChange}
            onSkillsChange={handleSkillsChange}
            isDisabled={updateChildMutation.isPending}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-24 left-4 right-4">
        <ActionButton
          onClick={handleSave}
          disabled={!isFormValid || !hasChanges}
          isLoading={updateChildMutation.isPending}
          variant="primary"
        >
          Сохранить
        </ActionButton>
      </div>

      <BottomNavigation />
    </div>
  );
};
