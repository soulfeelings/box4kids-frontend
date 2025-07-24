import { Gender } from "../../api-client/model/gender";
import { SubscriptionResponse } from "../../api-client/model";
import { InterestId, SkillId } from "./references";

// Типы для управления детьми
export interface CreateChildData {
  id: number;
  name: string;
  date_of_birth: string;
  gender: Gender;
  limitations: boolean;
  comment: string;
  interests: InterestId[];
  skills: SkillId[];
  subscriptions: SubscriptionResponse[];
}

export interface UpdateChildData {
  name?: string;
  date_of_birth?: string;
  gender?: Gender;
  limitations?: boolean;
  comment?: string | null;
  interests?: InterestId[];
  skills?: SkillId[];
  subscriptions?: SubscriptionResponse[];
}
