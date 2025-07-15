import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UserData } from "../types";
import { createUserSlice, UserSlice } from "./slices/userSlice";
import { createChildrenSlice, ChildrenSlice } from "./slices/childrenSlice";
import { createDeliverySlice, DeliverySlice } from "./slices/deliverySlice";
import { createUISlice, UISlice } from "./slices/uiSlice";
import { createAuthSlice, AuthSlice } from "./slices/authSlice";
import { createCommonSlice, CommonSlice } from "./slices/commonSlice";
import {
  getUserProfileUsersProfileGet,
  getUserChildrenUsersChildrenGet,
  getUserSubscriptionsSubscriptionsUserGet,
  getAllSubscriptionPlansSubscriptionPlansGet,
  getAllInterestsInterestsGet,
  getAllSkillsSkillsGet,
  getUserDeliveryAddressesDeliveryAddressesGet,
} from "../api-client";
import { retryAsync } from "../utils/retry";
import { convertDateFromISO } from "../utils/date/convert";

// Основное состояние store (без мутаций)
export interface BaseState {
  // Аутентификация
  user: UserData | null;

  // Состояние загрузки и ошибок
  isLoading: boolean;
  isInitDataLoading: boolean;
  error: string | null;
  initDataError: string | null;
  currentChildIdToUpdate: number | null;
  selectedDeliveryAddressId: number | null;
}

// Полное состояние с мутациями из slices
export interface State
  extends BaseState,
    UserSlice,
    ChildrenSlice,
    DeliverySlice,
    UISlice,
    AuthSlice,
    CommonSlice {
  // Дополнительные методы, не относящиеся к конкретным slices
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  resetTemporaryState: () => void;
  fetchInitData: () => Promise<void>;
}

// Начальное состояние
const initialState: BaseState = {
  user: null,
  isLoading: false,
  isInitDataLoading: false,
  error: null,
  initDataError: null,
  currentChildIdToUpdate: null,
  selectedDeliveryAddressId: null,
};

export const useStore = create<State>()(
  devtools((set) => ({
    ...initialState,

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    // Сброс временных значений состояния
    resetTemporaryState: () => {
      set({
        currentChildIdToUpdate: null,
        selectedDeliveryAddressId: null,
      });
    },

    // Инициализация данных
    fetchInitData: async () => {
      set({ isInitDataLoading: true, initDataError: null });

      try {
        // Запрашиваем все данные параллельно с retry
        const [
          userProfile,
          userChildren,
          userSubscriptions,
          subscriptionPlans,
          interests,
          skills,
          deliveryAddresses,
        ] = await retryAsync(
          () =>
            Promise.all([
              getUserProfileUsersProfileGet(),
              getUserChildrenUsersChildrenGet(),
              getUserSubscriptionsSubscriptionsUserGet(),
              getAllSubscriptionPlansSubscriptionPlansGet(),
              getAllInterestsInterestsGet(),
              getAllSkillsSkillsGet(),
              getUserDeliveryAddressesDeliveryAddressesGet(),
            ]),
          3, // 3 попытки
          1000 // начальная задержка 1с
        );

        // Трансформируем данные в формат UserData
        const userData: UserData = {
          id: userProfile.id,
          name: userProfile.name || "",
          phone: userProfile.phone_number,
          children: userChildren.map((child) => ({
            id: child.id,
            name: child.name,
            date_of_birth: convertDateFromISO(child.date_of_birth),
            gender: child.gender,
            limitations: child.has_limitations,
            comment: child.comment || "",
            interests: child.interests.map((interest) => interest.id),
            skills: child.skills.map((skill) => skill.id),
            subscriptions: child.subscriptions,
          })),
          deliveryAddresses: deliveryAddresses.addresses.map((address) => ({
            id: address.id,
            name: address.name,
            address: address.address,
            date: address.date,
            time: address.time,
            comment: address.courier_comment || null,
          })),
          subscriptionStatus:
            userSubscriptions.length > 0 ? "active" : "not_subscribed",
          nextSetStatus: "not_determined",
          subscriptionDate: userSubscriptions[0]?.created_at,
        };

        // Сохраняем данные в store
        set({ user: userData });
        set({ subscriptionPlans: subscriptionPlans.plans });

        // Обновляем справочные данные
        set((state) => ({
          categoriesData: {
            ...state.categoriesData,
            interests: interests.interests.map((interest) => interest.id),
            skills: skills.skills.map((skill) => skill.id),
          },
        }));

        console.log("✅ Данные успешно загружены:", userData);
      } catch (error) {
        console.error("❌ Ошибка загрузки данных после всех попыток:", error);
        set({
          initDataError:
            error instanceof Error ? error.message : "Ошибка загрузки данных",
        });
      } finally {
        set({ isInitDataLoading: false });
      }
    },

    // Объединяем slices
    ...createUserSlice(set),
    ...createChildrenSlice(set),
    ...createDeliverySlice(set),
    ...createUISlice(set),
    ...createAuthSlice(set),
    ...createCommonSlice(set),
  }))
);

export const clearPersistedStore = async () => {
  // 1. Очистка localStorage (или другого хранилища)
  // useStore.persist.clearStorage();

  // 2. Сброс всех данных в начальное состояние
  useStore.setState(initialState);

  // Если хочешь быть аккуратным — можно ещё обнулить вручную поля, не входящие в initialState,
  // например, categoriesData, если она добавляется после fetchInitData
};
