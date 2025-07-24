import React, { useState } from "react";
import { useAdminMappings } from "../hooks/useAdminMappings";
import { useAdminInterests } from "../hooks/useAdminInterests";
import { useAdminSkills } from "../hooks/useAdminSkills";
import { AdminMapping } from "../types";

export const AdminMappingsTable: React.FC = () => {
  const {
    mappings,
    isLoading,
    error,
    addInterest,
    addSkill,
    removeInterest,
    removeSkill,
  } = useAdminMappings();
  const { interests } = useAdminInterests();
  const { skills } = useAdminSkills();
  const [expandedMapping, setExpandedMapping] = useState<number | null>(null);
  const [newInterestId, setNewInterestId] = useState<string>("");
  const [newSkillId, setNewSkillId] = useState<string>("");

  const toggleMappingExpansion = (categoryId: number) => {
    setExpandedMapping(expandedMapping === categoryId ? null : categoryId);
  };

  const handleAddInterest = async (categoryId: number) => {
    if (!newInterestId) return;

    try {
      await addInterest(categoryId, parseInt(newInterestId));
      setNewInterestId("");
    } catch (err) {
      console.error("Ошибка добавления интереса:", err);
    }
  };

  const handleAddSkill = async (categoryId: number) => {
    if (!newSkillId) return;

    try {
      await addSkill(categoryId, parseInt(newSkillId));
      setNewSkillId("");
    } catch (err) {
      console.error("Ошибка добавления навыка:", err);
    }
  };

  const handleRemoveInterest = async (
    categoryId: number,
    interestName: string
  ) => {
    // Находим ID интереса по имени
    const interest = interests.find((i) => i.name === interestName);
    if (!interest) {
      console.error("Интерес не найден:", interestName);
      return;
    }

    try {
      await removeInterest(categoryId, interest.id);
    } catch (err) {
      console.error("Ошибка удаления интереса:", err);
    }
  };

  const handleRemoveSkill = async (categoryId: number, skillName: string) => {
    // Находим ID навыка по имени
    const skill = skills.find((s) => s.name === skillName);
    if (!skill) {
      console.error("Навык не найден:", skillName);
      return;
    }

    try {
      await removeSkill(categoryId, skill.id);
    } catch (err) {
      console.error("Ошибка удаления навыка:", err);
    }
  };

  // Получаем доступные интересы (те, которые еще не добавлены к категории)
  const getAvailableInterests = (categoryId: number) => {
    const mapping = mappings.find((m) => m.category_id === categoryId);
    if (!mapping) return interests;

    return interests.filter(
      (interest) => !mapping.interests.includes(interest.name)
    );
  };

  // Получаем доступные навыки (те, которые еще не добавлены к категории)
  const getAvailableSkills = (categoryId: number) => {
    const mapping = mappings.find((m) => m.category_id === categoryId);
    if (!mapping) return skills;

    return skills.filter((skill) => !mapping.skills.includes(skill.name));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Загрузка маппингов...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">Ошибка: {error}</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Маппинг категорий ({mappings.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Интересы
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Навыки
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mappings.map((mapping) => (
              <React.Fragment key={mapping.category_id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {mapping.category_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {mapping.category_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {mapping.interests.length} интересов
                    </div>
                    <div className="text-sm text-gray-500">
                      {mapping.interests.slice(0, 2).join(", ")}
                      {mapping.interests.length > 2 && "..."}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {mapping.skills.length} навыков
                    </div>
                    <div className="text-sm text-gray-500">
                      {mapping.skills.slice(0, 2).join(", ")}
                      {mapping.skills.length > 2 && "..."}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() =>
                        toggleMappingExpansion(mapping.category_id)
                      }
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {expandedMapping === mapping.category_id
                        ? "Скрыть"
                        : "Управлять"}
                    </button>
                  </td>
                </tr>

                {expandedMapping === mapping.category_id && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Интересы */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            Интересы:
                          </h4>
                          <div className="space-y-2">
                            {mapping.interests.map((interest, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-white p-2 rounded border"
                              >
                                <span className="text-sm">{interest}</span>
                                <button
                                  onClick={() =>
                                    handleRemoveInterest(
                                      mapping.category_id,
                                      interest
                                    )
                                  }
                                  className="text-red-600 hover:text-red-900 text-xs"
                                >
                                  Удалить
                                </button>
                              </div>
                            ))}
                            <div className="flex space-x-2">
                              <select
                                value={newInterestId}
                                onChange={(e) =>
                                  setNewInterestId(e.target.value)
                                }
                                className="flex-1 text-sm border-gray-300 rounded-md px-2 py-1"
                              >
                                <option value="">Выберите интерес</option>
                                {getAvailableInterests(mapping.category_id).map(
                                  (interest) => (
                                    <option
                                      key={interest.id}
                                      value={interest.id}
                                    >
                                      {interest.name}
                                    </option>
                                  )
                                )}
                              </select>
                              <button
                                onClick={() =>
                                  handleAddInterest(mapping.category_id)
                                }
                                disabled={!newInterestId}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Добавить
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Навыки */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            Навыки:
                          </h4>
                          <div className="space-y-2">
                            {mapping.skills.map((skill, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-white p-2 rounded border"
                              >
                                <span className="text-sm">{skill}</span>
                                <button
                                  onClick={() =>
                                    handleRemoveSkill(
                                      mapping.category_id,
                                      skill
                                    )
                                  }
                                  className="text-red-600 hover:text-red-900 text-xs"
                                >
                                  Удалить
                                </button>
                              </div>
                            ))}
                            <div className="flex space-x-2">
                              <select
                                value={newSkillId}
                                onChange={(e) => setNewSkillId(e.target.value)}
                                className="flex-1 text-sm border-gray-300 rounded-md px-2 py-1"
                              >
                                <option value="">Выберите навык</option>
                                {getAvailableSkills(mapping.category_id).map(
                                  (skill) => (
                                    <option key={skill.id} value={skill.id}>
                                      {skill.name}
                                    </option>
                                  )
                                )}
                              </select>
                              <button
                                onClick={() =>
                                  handleAddSkill(mapping.category_id)
                                }
                                disabled={!newSkillId}
                                className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Добавить
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
