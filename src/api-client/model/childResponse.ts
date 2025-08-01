/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * Box4Kids
 * API для Box4Kids - сервис аренды игрушек для детей
 * OpenAPI spec version: 0.1.0
 */
import type { Gender } from './gender';
import type { ChildResponseComment } from './childResponseComment';
import type { InterestResponse } from './interestResponse';
import type { SkillResponse } from './skillResponse';
import type { SubscriptionResponse } from './subscriptionResponse';

export interface ChildResponse {
  id: number;
  name: string;
  date_of_birth: string;
  gender: Gender;
  has_limitations: boolean;
  comment: ChildResponseComment;
  parent_id: number;
  interests: InterestResponse[];
  skills: SkillResponse[];
  subscriptions: SubscriptionResponse[];
  /** Вычисляет возраст ребенка на основе даты рождения.

Примечание: Вычисление происходит только по датам без учета времени и часовых поясов.
Это покрывает 99% случаев корректно для детских игрушек. */
  readonly age: number;
}
