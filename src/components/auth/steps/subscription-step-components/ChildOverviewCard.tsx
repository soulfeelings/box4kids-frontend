import { InterestResponse, SkillResponse } from "../../../../api-client/model";
import { UserChildData } from "../../../../types";
import { calculateAge } from "../../../../utils/age/calculateAge";
import { Tag } from "../../../Tag";

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
            {child.name}, {calculateAge(child.date_of_birth)} лет
          </h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Интересы */}
        <div>
          <h2
            className="text-md font-semibold text-[#686564] mb-3"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Интересы
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
            Навыки для развития
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
            Тариф
          </h2>
          {currentSubscription ? (
            <div>
              <div className="mb-8">
                <Tag selected>
                  {plan?.name} • {plan?.toy_count} игрушек • $
                  {plan?.price_monthly}/мес.
                </Tag>
              </div>

              {/* Состав набора игрушек */}
              <div>
                <h3
                  className="text-md font-semibold text-[#686564] mb-3"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Состав набора игрушек
                </h3>
                <div className="space-y-3">
                  {plan?.toy_configurations?.map((config: any) => (
                    <div key={config.id} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                        style={{
                          backgroundColor:
                            config.name === "Конструктор"
                              ? "#F8CAAF"
                              : config.name === "Творческий набор"
                              ? "#D4E7C5"
                              : config.name === "Мягкая игрушка"
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
        <ActionButtons
          onEditData={onEditData}
          onEditSubscription={onEditSubscription}
          onDelete={onDelete}
          child={child}
        />
      </div>
    </div>
  );
};

function ActionButtons({
  onEditData,
  onEditSubscription,
  onDelete,
  child,
}: {
  onEditData: (childId: number) => void;
  onEditSubscription: (childId: number) => void;
  onDelete: (childId: number) => void;
  child: UserChildData;
}) {
  return (
    <div className="space-y-3 pt-4">
      <button
        className="w-full py-3 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
        style={{
          fontFamily: "Nunito, sans-serif",
          borderRadius: "32px",
          backgroundColor: "#E3E3E3",
        }}
        onClick={() => onEditData(child.id)}
      >
        Изменить данные ребёнка
      </button>
      <button
        className="w-full py-3 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
        style={{
          fontFamily: "Nunito, sans-serif",
          borderRadius: "32px",
          backgroundColor: "#E3E3E3",
        }}
        onClick={() => onEditSubscription(child.id)}
      >
        Изменить тариф
      </button>
      <button
        className="w-full py-3 bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors"
        style={{ fontFamily: "Nunito, sans-serif", borderRadius: "32px" }}
        onClick={() => onDelete(child.id)}
      >
        Удалить
      </button>
    </div>
  );
}

function NoSubscription() {
  return (
    <div className="bg-gray-50 rounded-xl p-4" style={{ borderRadius: "12px" }}>
      <span
        className="text-gray-900"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        Нет подписки
      </span>
    </div>
  );
}
