// Admin types - simplified for testing
export interface AdminLoginRequest {
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AdminUser {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  role: string;
  created_at: string;
  children: ChildWithBoxes[];
  subscriptions: any[];
  delivery_addresses: any[];
}

export interface ChildWithBoxes {
  id: number;
  name: string;
  age: number;
  current_box: ToyBoxResponse | null;
  next_box: NextBoxResponse | null;
}

export interface ToyBoxResponse {
  id: number;
  subscription_id: number;
  child_id: number;
  status: string;
  delivery_date: string;
  return_date: string;
  delivery_time: string;
  return_time: string;
  items: ToyBoxItemResponse[];
}

export interface ToyBoxItemResponse {
  id: number;
  toy_category_id: number;
  quantity: number;
  category_name: string;
}

export interface NextBoxResponse {
  delivery_date: string;
  return_date: string;
  delivery_time: string;
  return_time: string;
  items: NextBoxItemResponse[];
}

export interface NextBoxItemResponse {
  toy_category_id: number;
  quantity: number;
  category_name: string;
}

export interface AdminInventoryItem {
  id: number;
  category_id: number;
  category_name: string;
  available_quantity: number;
  reserved_quantity: number;
  total_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface AdminMapping {
  category_id: number;
  category_name: string;
  interests: string[];
  skills: string[];
}

export interface UpdateInventoryRequest {
  available_quantity: number;
}

export interface AddMappingRequest {
  interest_id?: number;
  skill_id?: number;
}
