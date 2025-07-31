import { InterestResponse, SkillResponse } from "../../../../api-client/model";
import { UserChildData } from "../../../../types";
import { dateManager } from "../../../../utils/date/DateManager";
import { Tag } from "../../../Tag";
import { ChildActionButtons } from "../../../../features/ChildActionButtons";
import { useTranslation } from 'react-i18next';

// Child overview card component
export const ChildOverviewCard: React.FC<{
  child: UserChildData;
  interests: InterestResponse[];
  skills: SkillResponse[];
  onEditData: (childId: number) => void;
  onEditSubscription: (childId: number) => void;
  onDelete: (childId: number) => void;
  getSubscriptionPlan: (id: number) => any;
}> = ({
  child,
  interests,
  skills,
  onEditData,
  onEditSubscription,
  onDelete,
  getSubscriptionPlan,
}) => {
  const { t } = useTranslation();
  const currentSubscription = child.subscriptions[0];
  const currentPlan = currentSubscription?.plan_id;
  const plan = getSubscriptionPlan(currentPlan);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
          <span className="font-semibold text-2xl">
            {child.gender === "male" ? "👦🏻" : "👩🏻"}
          </span>
        </div>
        <div>
          <h1
            className="font-semibold text-gray-900"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {child.name},{" "}
            {dateManager.getAgeWithDeclension(child.date_of_birth)}
          </h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Особенности */}
        {child.limitations && child.comment && (
          <div>
            <h2
              className="text-md font-semibold text-[#686564] mb-3"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              {t('features')}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Tag selected={true}>{child.comment}</Tag>
            </div>
          </div>
        )}

        {/* Интересы */}
        <div>
          <h2
            className="text-md font-semibold text-[#686564] mb-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {t('interests')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {child.interests.map((interestId, idx) => {
              const interest = interests.find((i) => i.id === interestId);
              return (
                <Tag key={idx} selected={true}>
                  {interest?.name}
                </Tag>
              );
            })}
          </div>
        </div>

        {/* Навыки для развития */}
        <div>
          <h2
            className="text-md font-semibold text-[#686564] mb-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {t('skills_for_development')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {child.skills.map((skillId, idx) => {
              const skill = skills.find((s) => s.id === skillId);
              return (
                <Tag key={idx} selected={true}>
                  {skill?.name}
                </Tag>
              );
            })}
          </div>
        </div>

        {/* Тариф */}
        <div>
          <h2
            className="text-md font-semibold text-[#686564] mb-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {t('tariff')}
          </h2>
          {currentSubscription ? (
            <div>
              <div className="mb-8">
                <Tag selected>
                  {plan?.name} • {plan?.toy_count} {t('toys')} • $
                  {plan?.price_monthly}{t('per_month')}
                </Tag>
              </div>

              {/* Состав набора игрушек */}
              <div>
                <h3
                  className="text-md font-semibold text-[#686564] mb-3"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {t('toy_set_composition')}
                </h3>
                <div className="space-y-3">
                  {plan?.toy_configurations?.map((config: any) => (
                    <div key={config.id} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                        style={{
                          backgroundColor:
                            config.name === t('constructor')
                              ? "#F8CAAF"
                              : config.name === t('creative_set')
                              ? "#D4E7C5"
                              : config.name === t('soft_toy')
                              ? "#F9E4B7"
                              : "#F2B7C4",
                        }}
                      >
                        {config.icon || "🎯"}
                      </div>
                      <span
                        className="font-medium text-gray-900"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        x{config.quantity}
                      </span>
                      <span
                        className="text-gray-800"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        {config.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <NoSubscription />
          )}
        </div>
        <ChildActionButtons
          onEditData={onEditData}
          onEditSubscription={onEditSubscription}
          onDelete={onDelete}
          childId={child.id}
        />
      </div>
    </div>
  );
};

function NoSubscription() {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-50 rounded-xl p-4" style={{ borderRadius: "12px" }}>
      <span
        className="text-gray-900"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        {t('no_subscription')}
      </span>
    </div>
  );
}
