// Interface for user data
export interface UserData {
  id: number;
  name: string;
  phone: string;
  children: Array<{
    id: number;
    name: string;
    birthDate: string;
    gender: "male" | "female";
    limitations: "none" | "has_limitations";
    comment: string;
    interests: string[];
    skills: string[];
    subscription: "base" | "premium" | "";
  }>;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  // New fields for different states
  subscriptionStatus: "not_subscribed" | "just_subscribed" | "active";
  nextSetStatus: "not_determined" | "determined";
  subscriptionDate?: string; // ISO date string when subscription was made
}
