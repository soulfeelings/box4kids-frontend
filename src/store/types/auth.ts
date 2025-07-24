import { InterestId, SkillId } from "./references";

// Типы для данных каждого шага аутентификации
export interface PhoneData {
  phone: string;
  code: string;
  verified: boolean;
}

export interface RegisterData {
  email: string;
  terms: boolean;
  name: string;
}

export interface CategoriesData {
  interests: InterestId[];
  skills: SkillId[];
}

export interface SubscriptionData {
  plan: "base" | "premium" | "";
  subscriptionId: number | null;
}

export interface PaymentData {
  paymentId: number | null;
  status: string;
}
