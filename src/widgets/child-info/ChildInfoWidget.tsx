import React from "react";
import { Tag } from "../../components/Tag";
import { dateManager } from "../../utils/date/DateManager";
import { UserChildData } from "../../types";
import { InterestResponse, SkillResponse } from "../../api-client/model";
import { useTranslation } from 'react-i18next';

interface ChildInfoWidgetProps {
  child: UserChildData;
  interests: InterestResponse[];
  skills: SkillResponse[];
  subscriptionPlan?: {
    name: string;
    toy_count: number;
    price_monthly: number;
  } | null;
}

export const ChildInfoWidget: React.FC<ChildInfoWidgetProps> = ({
  child,
  interests,
  skills,
  subscriptionPlan,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {child.gender === "male" ? "👦🏻" : "👩🏻"} {child.name},{" "}
            {dateManager.getAgeWithDeclension(child?.date_of_birth)}
          </h3>
        </div>
      </div>

      {/* Special Needs */}
      {child?.limitations && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">{t('features')}</p>
          <div className="flex flex-wrap gap-2">
            <Tag>{child.comment}</Tag>
          </div>
        </div>
      )}

      {/* Interests */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">{t('interests')}</p>
        <div className="flex flex-wrap gap-2">
          {interests.filter(Boolean).map((interest, index) => (
            <Tag key={index}>{interest.name}</Tag>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">{t('skills_for_development')}</p>
        <div className="flex flex-wrap gap-2">
          {skills.filter(Boolean).map((skill, index) => (
            <Tag key={index}>{skill.name}</Tag>
          ))}
        </div>
      </div>

      {/* Subscription */}
      {subscriptionPlan && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">{t('tariff')}</p>
          <Tag>
            {subscriptionPlan?.name} • {subscriptionPlan?.toy_count} {t('toys')} • $
            {subscriptionPlan?.price_monthly} {t('per_month')}
          </Tag>
        </div>
      )}
    </div>
  );
};
