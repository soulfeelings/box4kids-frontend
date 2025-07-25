/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * Box4Kids
 * API для Box4Kids - сервис аренды игрушек для детей
 * OpenAPI spec version: 0.1.0
 */
import type { AdminUserResponseName } from './adminUserResponseName';
import type { ChildWithBoxesResponse } from './childWithBoxesResponse';
import type { DeliveryInfoListResponse } from './deliveryInfoListResponse';
import type { SubscriptionWithDetailsResponse } from './subscriptionWithDetailsResponse';

/**
 * Схема для пользователя в админке
 */
export interface AdminUserResponse {
  id: number;
  phone_number: string;
  name?: AdminUserResponseName;
  role: string;
  created_at: string;
  children: ChildWithBoxesResponse[];
  delivery_addresses: DeliveryInfoListResponse;
  subscriptions: SubscriptionWithDetailsResponse[];
}
