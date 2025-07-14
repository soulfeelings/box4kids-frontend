import { Gender } from "./api-client/model/gender";
import { InterestResponse } from "./api-client/model/interestResponse";
import { SkillResponse } from "./api-client/model/skillResponse";
import { SubscriptionResponse } from "./api-client/model/subscriptionResponse";

export interface UserChildData {
  id: number;
  name: string;
  date_of_birth: string;
  gender: Gender;
  limitations: boolean;
  comment: string | null;
  interests: InterestResponse["id"][];
  skills: SkillResponse["id"][];
  subscriptions: SubscriptionResponse[];
}

export interface DeliveryAddressData {
  name: string;
  address: string;
  date: string;
  time: string;
  comment: string | null;
}

// Interface for user data
export interface UserData {
  id: number;
  name: string;
  phone: string;
  children: Array<UserChildData>;
  deliveryAddresses: Array<DeliveryAddressData>;
  // New fields for different states
  subscriptionStatus: "not_subscribed" | "just_subscribed" | "active";
  nextSetStatus: "not_determined" | "determined";
  subscriptionDate?: string; // ISO date string when subscription was made
}
