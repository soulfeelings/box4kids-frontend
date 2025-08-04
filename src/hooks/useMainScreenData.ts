import { useState, useEffect } from "react";
import {
  UserProfileResponse,
  SubscriptionWithDetailsResponse,
  ToyBoxResponse,
  ToyBoxReviewRequest,
  ChildResponse,
  DeliveryInfoResponse,
} from "../types/api";

export const useMainScreenData = (userId: number | null) => {
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(
    null
  );
  const [subscriptions, setSubscriptions] = useState<
    SubscriptionWithDetailsResponse[]
  >([]);
  const [deliveryAddresses, setDeliveryAddresses] = useState<
    DeliveryInfoResponse[]
  >([]);
  const [currentToyBoxes, setCurrentToyBoxes] = useState<
    Map<number, ToyBoxResponse>
  >(new Map());
  const [nextToyBoxes, setNextToyBoxes] = useState<Map<number, ToyBoxResponse>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Переиспользуем функцию apiRequest из LoginPage
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  };

  const loadMainData = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Загружаем данные параллельно из отдельных endpoints
      const [profileData, subscriptionsData, deliveryData] = await Promise.all([
        apiRequest(`/users/profile/${userId}`) as Promise<UserProfileResponse>,
        apiRequest(`/subscriptions/user/${userId}`) as Promise<
          SubscriptionWithDetailsResponse[]
        >,
        apiRequest(`/delivery-addresses/?user_id=${userId}`) as Promise<{
          addresses: DeliveryInfoResponse[];
        }>,
      ]);

      setUserProfile(profileData);
      setSubscriptions(subscriptionsData);
      setDeliveryAddresses(deliveryData.addresses || []);

      // Загружаем наборы игрушек для каждого ребенка
      const currentBoxes = new Map<number, ToyBoxResponse>();
      const nextBoxes = new Map<number, ToyBoxResponse>();

      await Promise.all(
        profileData.children.map(async (child: ChildResponse) => {
          try {
            const [currentBox, nextBox] = await Promise.all([
              apiRequest(`/toy-boxes/current/${child.id}`),
              apiRequest(`/toy-boxes/next/${child.id}`),
            ]);
            currentBoxes.set(child.id, currentBox);
            nextBoxes.set(child.id, nextBox);
          } catch (error) {
            console.error(
              `Failed to load toy boxes for child ${child.id}:`,
              error
            );
            // Не останавливаем загрузку из-за ошибки с одним ребенком
          }
        })
      );

      setCurrentToyBoxes(currentBoxes);
      setNextToyBoxes(nextBoxes);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Не удалось загрузить данные"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMainData();
  }, [userId]);

  const submitReview = async (
    boxId: number,
    rating: number,
    comment: string
  ) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const review: ToyBoxReviewRequest = {
        user_id: userId,
        rating,
        comment: comment || undefined,
      };

      await apiRequest(`/toy-boxes/${boxId}/review`, {
        method: "POST",
        body: JSON.stringify(review),
      });

      // Обновляем данные после отправки отзыва
      await loadMainData();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Не удалось отправить отзыв"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userProfile,
    subscriptions,
    deliveryAddresses,
    currentToyBoxes,
    nextToyBoxes,
    isLoading,
    error,
    reload: loadMainData,
    submitReview,
  };
};
