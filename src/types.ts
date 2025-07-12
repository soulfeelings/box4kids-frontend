// Interface for user data
export interface UserData {
  name: string;
  phone: string;
  children: Array<{
    id: string;
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
  deliveryComments?: string; // Optional comment for courier
  // New fields for different states
  subscriptionStatus: "not_subscribed" | "just_subscribed" | "active" | "paused";
  nextSetStatus: "not_determined" | "determined";
  subscriptionDate?: string; // ISO date string when subscription was made
} 