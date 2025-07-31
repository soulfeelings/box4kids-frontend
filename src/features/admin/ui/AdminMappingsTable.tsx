import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useGetAllToyCategoriesToyCategoriesGet } from "../../../api-client";
import { useGetAllInterestsInterestsGet } from "../../../api-client";
import { useGetAllSkillsSkillsGet } from "../../../api-client";

export const AdminMappingsTable: React.FC = () => {
  const { t } = useTranslation();
  const { data: categories } = useGetAllToyCategoriesToyCategoriesGet();
  const { data: interests } = useGetAllInterestsInterestsGet();
  const { data: skills } = useGetAllSkillsSkillsGet();
  const [expandedMapping, setExpandedMapping] = useState<number | null>(null);
  const [newInterestId, setNewInterestId] = useState("");
  const [newSkillId, setNewSkillId] = useState("");

  const toggleMappingExpansion = (categoryId: number) => {
    setExpandedMapping(expandedMapping === categoryId ? null : categoryId);
  };

  const handleAddInterest = async (categoryId: number) => {
    try {
      // API call to add interest
      console.log("Adding interest", newInterestId, "to category", categoryId);
      setNewInterestId("");
    } catch (err) {
      console.error("Ошибка добавления интереса:", err);
    }
  };

  const handleAddSkill = async (categoryId: number) => {
    try {
      // API call to add skill
      console.log("Adding skill", newSkillId, "to category", categoryId);
      setNewSkillId("");
    } catch (err) {
      console.error("Ошибка добавления навыка:", err);
    }
  };

  const handleRemoveInterest = async (
    categoryId: number,
    interestName: string
  ) => {
    try {
      // API call to remove interest
      console.log("Removing interest", interestName, "from category", categoryId);
    } catch (err) {
      console.error("Ошибка удаления интереса:", err);
    }
  };

  const handleRemoveSkill = async (categoryId: number, skillName: string) => {
    try {
      // API call to remove skill
      console.log("Removing skill", skillName, "from category", categoryId);
    } catch (err) {
      console.error("Ошибка удаления навыка:", err);
    }
  };

  const getAvailableInterests = (categoryId: number) => {
    return interests?.interests.filter(
      (interest) => !mappings.find((m) => m.category_id === categoryId)?.interests.includes(interest.name)
    ) || [];
  };

  const getAvailableSkills = (categoryId: number) => {
    return skills?.skills.filter(
      (skill) => !mappings.find((m) => m.category_id === categoryId)?.skills.includes(skill.name)
    ) || [];
  };

  // Mock data - replace with actual API call
  const mappings = [
    {
      category_id: 1,
      category_name: t('constructors'),
      interests: [t('logic'), t('motor_skills')],
      skills: [t('spatial_thinking'), t('creativity')],
    },
    {
      category_id: 2,
      category_name: t('creative_sets'),
      interests: [t('creativity'), t('imagination')],
      skills: [t('fine_motor_skills'), t('color_perception')],
    },
  ];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {t('category_mappings')}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('category')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('interests')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('skills')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mappings.map((mapping) => (
              <React.Fragment key={mapping.category_id}>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {mapping.category_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {mapping.interests.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {mapping.skills.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() =>
                        toggleMappingExpansion(mapping.category_id)
                      }
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {expandedMapping === mapping.category_id
                        ? t('hide')
                        : t('manage')}
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
                            {t('interests')}:
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
                                  {t('delete')}
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
                                <option value="">{t('select_interest')}</option>
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
                                {t('add')}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Навыки */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            {t('skills')}:
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
                                  {t('delete')}
                                </button>
                              </div>
                            ))}
                            <div className="flex space-x-2">
                              <select
                                value={newSkillId}
                                onChange={(e) =>
                                  setNewSkillId(e.target.value)
                                }
                                className="flex-1 text-sm border-gray-300 rounded-md px-2 py-1"
                              >
                                <option value="">{t('select_skill')}</option>
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
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {t('add')}
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
