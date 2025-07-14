import { SubscriptionPlanCard } from "./SubscriptionPlanCard";

// Single child subscription view component
export const SingleChildSubscriptionView: React.FC<{
  subscriptionPlans: any[];
  selectedSubscriptionId: number | null;
  onSelectSubscription: (planId: number) => void;
  isLoading: boolean;
}> = ({
  subscriptionPlans,
  selectedSubscriptionId,
  onSelectSubscription,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      {subscriptionPlans.map((plan) => (
        <SubscriptionPlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedSubscriptionId === plan.id}
          onSelect={onSelectSubscription}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};
