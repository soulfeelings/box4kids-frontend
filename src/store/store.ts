import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthStep } from "../constants/auth";
import { UserData, DeliveryAddressData } from "../types";
import { Gender } from "../api-client/model/gender";
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
import { InterestResponse } from "../api-client/model/interestResponse";
import { SkillResponse } from "../api-client/model/skillResponse";
import { convertDateFromISO } from "../utils/date/convert";
import { SubscriptionResponse } from "../api-client/model/subscriptionResponse";
import { SubscriptionPlanResponse } from "../api-client/model";

type InterestId = InterestResponse["id"];
type SkillId = SkillResponse["id"];

// Типы для данных каждого шага
export interface PhoneData {
  phone: string;
  code: string;
  verified: boolean;
}

export interface WelcomeData {
  firstName: string;
  lastName: string;
  welcomeIndex: number;
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

// Основное состояние store
interface State {
  // Данные шагов
  phoneData: PhoneData;
  welcomeData: WelcomeData;

  categoriesData: CategoriesData;
  paymentData: PaymentData;

  // Аутентификация
  user: UserData | null;
  isAuthenticated: () => boolean;
  subscriptionPlans: SubscriptionPlanResponse[];

  // Состояние загрузки и ошибок
  isLoading: boolean;
  isInitDataLoading: boolean;
  error: string | null;
  initDataError: string | null;
  currentChildIdToUpdate: number | null;

  // Действия
  setPhoneData: (data: Partial<PhoneData>) => void;
  setWelcomeData: (data: Partial<WelcomeData>) => void;
  getSubscriptionPlan: (id: number) => SubscriptionPlanResponse | null;

  setCategoriesData: (data: Partial<CategoriesData>) => void;
  setPaymentData: (data: Partial<PaymentData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetRegistration: () => void;

  // Аутентификация
  setUser: (user: UserData) => void;
  setUserName: (name: string) => void;
  logout: () => void;
  setCurrentChildIdToUpdate: (childId: number | null) => void;

  // Управление детьми
  addChild: (childData: CreateChildData) => void;
  removeChild: (childId: number) => void;
  updateChild: (childId: number, updateData: UpdateChildData) => void;

  // Управление адресами доставки
  getUserDeliveryAddresses: () => DeliveryAddressData[];
  addDeliveryAddress: (addressData: DeliveryAddressData) => void;
  updateDeliveryAddress: (
    id: number,
    addressData: Partial<DeliveryAddressData>
  ) => void;
  removeDeliveryAddress: (id: number) => void;

  // Новые методы для онбординга
  canAccessStep: (step: AuthStep) => boolean;
  getNextValidStep: () => AuthStep;

  // Инициализация данных
  fetchInitData: () => Promise<void>;
}

// Начальное состояние
const initialState = {
  phoneData: {
    phone: "",
    code: "",
    verified: false,
  },
  welcomeData: {
    firstName: "",
    lastName: "",
    welcomeIndex: 0,
  },
  paymentData: {
    paymentId: null,
    status: "",
  },
  user: null,
  subscriptionPlans: [],
  isLoading: false,
  isInitDataLoading: false,
  error: null,
  initDataError: null,
  currentChildIdToUpdate: null,
};

// Создание store с persist middleware для сохранения в localStorage
export const useStore = create<State>()(
  persist(
    devtools((set, get) => ({
      ...initialState,

      isAuthenticated() {
        const token = localStorage.getItem("access_token");
        return !!token;
      },

      getSubscriptionPlan: (id: number) => {
        const state = get();
        return state.subscriptionPlans.find((plan) => plan.id === id) || null;
      },

      setPhoneData: (data) =>
        set((state) => ({
          phoneData: { ...state.phoneData, ...data },
        })),

      setWelcomeData: (data) =>
        set((state) => ({
          welcomeData: { ...state.welcomeData, ...data },
        })),

      setCategoriesData: (data) =>
        set((state) => ({
          categoriesData: { ...state.categoriesData, ...data },
        })),

      setPaymentData: (data) =>
        set((state) => ({
          paymentData: { ...state.paymentData, ...data },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      resetRegistration: () => set(initialState),

      // Аутентификация
      setUser: (user) => set({ user }),

      setUserName: (name: string) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, name } });
        } else {
          console.error("setUserName: User not found");
        }
      },

      setCurrentChildIdToUpdate: (childId: number | null) =>
        set({ currentChildIdToUpdate: childId }),

      logout: () => set({ user: null }),

      // Управление детьми
      addChild: (childData: CreateChildData) => {
        const user = get().user;
        if (!user) {
          console.error("addChild: User not found");
          return;
        }

        set({
          user: {
            ...user,
            children: [...user.children, childData],
          },
        });
      },

      removeChild: (childId: number) => {
        const user = get().user;
        if (!user) {
          console.error("removeChild: User not found");
          return;
        }

        set({
          user: {
            ...user,
            children: user.children.filter((child) => child.id !== childId),
          },
        });
      },

      updateChild: (childId: number, updateData: UpdateChildData) => {
        const user = get().user;
        if (!user) {
          console.error("updateChild: User not found");
          return;
        }

        const childIndex = user.children.findIndex(
          (child) => child.id === childId
        );
        if (childIndex === -1) {
          console.error(`updateChild: Child with id ${childId} not found`);
          return;
        }

        const updatedChildren = [...user.children];
        updatedChildren[childIndex] = {
          ...updatedChildren[childIndex],
          ...updateData,
        };

        set({
          user: {
            ...user,
            children: updatedChildren,
          },
        });
      },

      // Управление адресами доставки
      getUserDeliveryAddresses: () => {
        const user = get().user;
        return user?.deliveryAddresses || [];
      },

      addDeliveryAddress: (addressData: DeliveryAddressData) => {
        const user = get().user;
        if (!user) {
          console.error("addDeliveryAddress: User not found");
          return;
        }

        set({
          user: {
            ...user,
            deliveryAddresses: [...user.deliveryAddresses, addressData],
          },
        });
      },

      updateDeliveryAddress: (
        id: number,
        addressData: Partial<DeliveryAddressData>
      ) => {
        const user = get().user;
        if (!user) {
          console.error("updateDeliveryAddress: User not found");
          return;
        }

        const addressIndex = user.deliveryAddresses.findIndex(
          (address) => address.id === id
        );
        if (addressIndex === -1) {
          console.error(
            `updateDeliveryAddress: Address with id ${id} not found`
          );
          return;
        }

        const updatedAddresses = [...user.deliveryAddresses];
        updatedAddresses[addressIndex] = {
          ...updatedAddresses[addressIndex],
          ...addressData,
        };

        set({
          user: {
            ...user,
            deliveryAddresses: updatedAddresses,
          },
        });
      },

      removeDeliveryAddress: (id: number) => {
        const user = get().user;
        if (!user) {
          console.error("removeDeliveryAddress: User not found");
          return;
        }

        const addressExists = user.deliveryAddresses.some(
          (address) => address.id === id
        );
        if (!addressExists) {
          console.error(
            `removeDeliveryAddress: Address with id ${id} not found`
          );
          return;
        }

        set({
          user: {
            ...user,
            deliveryAddresses: user.deliveryAddresses.filter(
              (address) => address.id !== id
            ),
          },
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
              interests: interests.interests.map(
                (interest: any) => interest.name
              ),
              skills: skills.skills.map((skill: any) => skill.name),
              interestIds: interests.interests.map(
                (interest: any) => interest.id
              ),
              skillIds: skills.skills.map((skill: any) => skill.id),
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
    })),
    {
      name: "registration-store",
      partialize: (state: State) => ({
        currentChildIdToUpdate: state.currentChildIdToUpdate,
      }),
    }
  )
);
