/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * Box4Kids
 * API для Box4Kids - сервис аренды игрушек для детей
 * OpenAPI spec version: 0.1.0
 */

/**
 * Схема для возврата с платежной страницы
 */
export interface PaymentReturnRequest {
  external_payment_id: string;
  status?: string;
}
