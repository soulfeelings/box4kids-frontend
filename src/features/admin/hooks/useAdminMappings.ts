import { useState, useEffect } from "react";
import {
  getAdminMappings,
  addInterestToCategory,
  addSkillToCategory,
  removeInterestFromCategory,
  removeSkillFromCategory,
} from "../api/adminApi";
import { AdminMapping, AddMappingRequest } from "../types";

export const useAdminMappings = () => {
  const [mappings, setMappings] = useState<AdminMapping[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMappings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAdminMappings();
      setMappings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка загрузки маппингов"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addInterest = async (categoryId: number, interestId: number) => {
    try {
      const data: AddMappingRequest = { interest_id: interestId };
      await addInterestToCategory(categoryId, data);
      await fetchMappings(); // Обновляем список
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка добавления интереса"
      );
      throw err;
    }
  };

  const addSkill = async (categoryId: number, skillId: number) => {
    try {
      const data: AddMappingRequest = { skill_id: skillId };
      await addSkillToCategory(categoryId, data);
      await fetchMappings(); // Обновляем список
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка добавления навыка");
      throw err;
    }
  };

  const removeInterest = async (categoryId: number, interestId: number) => {
    try {
      await removeInterestFromCategory(categoryId, interestId);
      await fetchMappings(); // Обновляем список
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления интереса");
      throw err;
    }
  };

  const removeSkill = async (categoryId: number, skillId: number) => {
    try {
      await removeSkillFromCategory(categoryId, skillId);
      await fetchMappings(); // Обновляем список
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления навыка");
      throw err;
    }
  };

  useEffect(() => {
    fetchMappings();
  }, []);

  return {
    mappings,
    isLoading,
    error,
    fetchMappings,
    addInterest,
    addSkill,
    removeInterest,
    removeSkill,
  };
};
