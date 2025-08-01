/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * Box4Kids
 * API для Box4Kids - сервис аренды игрушек для детей
 * OpenAPI spec version: 0.1.0
 */
import type { SubscriptionCreateResponsePaymentId } from './subscriptionCreateResponsePaymentId';
import type { SubscriptionStatus } from './subscriptionStatus';

/**
 * Схема ответа при создании заказа
 */
export interface SubscriptionCreateResponse {
  subscription_id: number;
  payment_id: SubscriptionCreateResponsePaymentId;
  status: SubscriptionStatus;
  individual_price: number;
  message: string;
}
