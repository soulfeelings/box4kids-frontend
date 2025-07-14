import { Gender } from "./api-client/model/gender";
import { InterestResponse } from "./api-client/model/interestResponse";
import { SkillResponse } from "./api-client/model/skillResponse";

export interface UserChildData {
  id: number;
  name: string;
  date_of_birth: string;
  gender: Gender;
  limitations: boolean;
  comment: string | null;
  interests: InterestResponse["id"][];
  skills: SkillResponse["id"][];
  subscription: "base" | "premium" | "";
}

// Interface for user data
export interface UserData {
  id: number;
  name: string;
  phone: string;
  children: Array<UserChildData>;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  // New fields for different states
  subscriptionStatus: "not_subscribed" | "just_subscribed" | "active";
  nextSetStatus: "not_determined" | "determined";
  subscriptionDate?: string; // ISO date string when subscription was made
}
