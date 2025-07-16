import { ToyBoxStatus } from "../api-client/model/toyBoxStatus";

// Централизованные API типы для всего приложения

// === AUTH ===
export interface UserResponse {
  id: number;
  phone_number: string;
  name: string | null;
  role: string;
}

// === INTERESTS & SKILLS ===
export interface InterestResponse {
  id: number;
  name: string;
}

export interface SkillResponse {
  id: number;
  name: string;
}

export interface InterestsListResponse {
  interests: InterestResponse[];
}

export interface SkillsListResponse {
  skills: SkillResponse[];
}

// === CHILDREN ===
export interface ChildResponse {
  id: number;
  name: string;
  date_of_birth: string;
  gender: "male" | "female";
  has_limitations: boolean;
  comment: string | null;
  parent_id: number;
  interests: InterestResponse[];
  skills: SkillResponse[];
  age: number;
}

// === SUBSCRIPTION PLANS ===
export interface ToyCategoryConfigResponse {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  quantity: number;
}

export interface SubscriptionPlanResponse {
  id: number;
  name: string;
  price_monthly: number;
  toy_count: number;
  description: string | null;
  toy_configurations: ToyCategoryConfigResponse[];
}

export interface SubscriptionPlansListResponse {
  plans: SubscriptionPlanResponse[];
}

// === SUBSCRIPTIONS ===
export interface SubscriptionCreateRequest {
  child_id: number;
  plan_id: number;
  delivery_info_id?: number;
}

export interface SubscriptionCreateResponse {
  subscription_id: number;
  payment_id: number | null;
  status: string;
  individual_price: number;
  message: string;
}

export interface SubscriptionWithDetailsResponse {
  id: number;
  child_id: number;
  plan_id: number;
  delivery_info_id: number | null;
  status: string;
  discount_percent: number;
  created_at: string;
  expires_at: string | null;
  child_name: string;
  plan_name: string;
  plan_price: number;
  user_id: number;
  user_name: string | null;
}

// === DELIVERY ===
export interface DeliveryInfoCreate {
  name: string;
  address: string;
  delivery_time_preference?: string;
  courier_comment?: string;
}

export interface DeliveryInfoResponse {
  id: number;
  name: string;
  address: string;
  delivery_time_preference: string | null;
  courier_comment: string | null;
  user_id: number;
  created_at: string;
}

// === PAYMENTS ===
export interface BatchPaymentCreateRequest {
  subscription_ids: number[];
}

export interface BatchPaymentResponse {
  payment_id: number;
  external_payment_id: string;
  payment_url: string;
  amount: number;
  currency: string;
  subscription_count: number;
  message: string;
}

export interface PaymentProcessResponse {
  status: "success" | "failed";
  message: string;
}

// === USER PROFILE ===
export interface UserProfileResponse {
  id: number;
  phone_number: string;
  name: string | null;
  role: string;
  children: ChildResponse[];
}

// === TOY BOXES ===
export interface ToyBoxResponse {
  id: number;
  subscription_id: number;
  child_id: number;
  delivery_info_id: number | null;
  status: ToyBoxStatus;
  delivery_date: string | null;
  return_date: string | null;
  created_at: string;
  items: ToyBoxItemResponse[];
  reviews: ToyBoxReviewResponse[];
}

export interface ToyBoxItemResponse {
  id: number;
  toy_category_id: number;
  quantity: number;
}

export interface ToyBoxReviewResponse {
  id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ToyBoxReviewRequest {
  user_id: number;
  rating: number;
  comment?: string;
}
