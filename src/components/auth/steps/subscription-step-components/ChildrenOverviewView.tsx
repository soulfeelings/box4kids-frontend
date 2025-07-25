import { InterestResponse } from "../../../../api-client/model/interestResponse";
import { SkillResponse } from "../../../../api-client/model/skillResponse";
import { AddNewChildBanner } from "../../../../features/AddNewChildBanner";
import { UserChildData } from "../../../../types";
import { ChildOverviewCard } from "./ChildOverviewCard";

// Children overview view component
export const ChildrenOverviewView: React.FC<{
  children: UserChildData[];
  interests: InterestResponse[];
  skills: SkillResponse[];
  onEditData: (childId: number) => void;
  onEditSubscription: (childId: number) => void;
  onDelete: (childId: number) => void;
  onAddNewChild: () => void;
  getSubscriptionPlan: (id: number) => any;
}> = ({
  children,
  interests,
  skills,
  onEditData,
  onEditSubscription,
  onDelete,
  onAddNewChild,
  getSubscriptionPlan,
}) => {
  return (
    <div className="space-y-6">
      {/* Add Child Banner */}
      <AddNewChildBanner onClick={onAddNewChild} />
      {children.map((child) => (
        <ChildOverviewCard
          key={child.id}
          child={child}
          interests={interests}
          skills={skills}
          onEditData={onEditData}
          onEditSubscription={onEditSubscription}
          onDelete={onDelete}
          getSubscriptionPlan={getSubscriptionPlan}
        />
      ))}
    </div>
  );
};
