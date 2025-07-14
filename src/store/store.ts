import { create } from "zustand";
import { devtools } from 'zustand/middleware'
import { AUTH_STEPS, AuthStep } from "../constants/auth";
import { UserData } from "../types";
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

export interface StoredChild {
  id: number;
  name: string;
  birthDate: string;
  gender: Gender;
  limitations: string;
  comment: string;
}

// Данные ребенка во время редактирования
export interface EditingChild {
  id?: number; // Если есть ID - редактируем, если нет - создаем
  name: string;
  birthDate: string;
  gender: Gender | null;
  limitations: string;
  comment: string;
  interestIds: number[];
  skillIds: number[];
}

export interface CategoriesData {
  interests: string[];
  skills: string[];
  interestIds: number[];
  skillIds: number[];
}

export interface SubscriptionData {
  plan: "base" | "premium" | "";
  subscriptionId: number | null;
}

export interface DeliveryData {
  address: string;
  date: string;
  time: string;
  comment?: string;
}

export interface PaymentData {
  paymentId: number | null;
  status: string;
}

// Основное состояние store
interface State {
  // Данные шагов
  phoneData: PhoneData;
  welcomeData: WelcomeData;
  registerData: RegisterData;

  categoriesData: CategoriesData;
  subscriptionData: SubscriptionData;
  deliveryData: DeliveryData;
  paymentData: PaymentData;

  // Аутентификация
  user: UserData | null;
  isAuthenticated: () => boolean;

  // Состояние загрузки и ошибок
  isLoading: boolean;
  isInitDataLoading: boolean;
  error: string | null;
  initDataError: string | null;

  // Действия
  setPhoneData: (data: Partial<PhoneData>) => void;
  setWelcomeData: (data: Partial<WelcomeData>) => void;
  setRegisterData: (data: Partial<RegisterData>) => void;

  setCategoriesData: (data: Partial<CategoriesData>) => void;
  setSubscriptionData: (data: Partial<SubscriptionData>) => void;
  setDeliveryData: (data: Partial<DeliveryData>) => void;
  setPaymentData: (data: Partial<PaymentData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetRegistration: () => void;

  // Аутентификация
  setUser: (user: UserData) => void;
  logout: () => void;

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
  registerData: {
    email: "",
    terms: false,
    name: "",
  },
  categoriesData: {
    interests: [],
    skills: [],
    interestIds: [],
    skillIds: [],
  },
  subscriptionData: {
    plan: "" as const,
    subscriptionId: null,
  },
  deliveryData: {
    address: "",
    date: "",
    time: "",
    comment: "",
  },
  paymentData: {
    paymentId: null,
    status: "",
  },
  user: null,
  isLoading: false,
  isInitDataLoading: false,
  error: null,
  initDataError: null,
};

// Создание store с persist middleware для сохранения в localStorage
export const useStore = create<State>()(devtools(
  (set, get) => ({
    ...initialState,

    // Computed property для аутентификации
    isAuthenticated() {
      const token = localStorage.getItem("access_token");
      console.log("token", token);
      return !!token;
    },

    setPhoneData: (data) =>
      set((state) => ({
        phoneData: { ...state.phoneData, ...data },
      })),

    setWelcomeData: (data) =>
      set((state) => ({
        welcomeData: { ...state.welcomeData, ...data },
      })),

    setRegisterData: (data) =>
      set((state) => ({
        registerData: { ...state.registerData, ...data },
      })),

    setCategoriesData: (data) =>
      set((state) => ({
        categoriesData: { ...state.categoriesData, ...data },
      })),

    setSubscriptionData: (data) =>
      set((state) => ({
        subscriptionData: { ...state.subscriptionData, ...data },
      })),

    setDeliveryData: (data) =>
      set((state) => ({
        deliveryData: { ...state.deliveryData, ...data },
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

    logout: () => set({ user: null }),

    // Новые методы для онбординга
    canAccessStep: (step: AuthStep) => {
      const state = get();
      switch (step) {
        case AUTH_STEPS.REGISTER:
          return (
            state.phoneData.verified &&
            !!state.welcomeData.firstName &&
            !!state.welcomeData.lastName
          );

        case AUTH_STEPS.CHILD:
          return (
            !!state.registerData.email &&
            state.registerData.terms &&
            !!state.registerData.name
          );

        case AUTH_STEPS.CATEGORIES:
          return true; // Ребенок может быть создан в процессе

        case AUTH_STEPS.SUBSCRIPTION:
          return state.categoriesData.interestIds.length > 0;

        case AUTH_STEPS.DELIVERY:
          return (
            state.subscriptionData.plan !== "" &&
            state.subscriptionData.plan !== null
          );

        case AUTH_STEPS.PAYMENT:
          return (
            !!state.deliveryData.address &&
            !!state.deliveryData.date &&
            !!state.deliveryData.time
          );

        default:
          return true;
      }
    },

    getNextValidStep: () => {
      const state = get();
      const steps = [
        AUTH_STEPS.REGISTER,
        AUTH_STEPS.CHILD,
        AUTH_STEPS.CATEGORIES,
        AUTH_STEPS.SUBSCRIPTION,
        AUTH_STEPS.DELIVERY,
        AUTH_STEPS.PAYMENT,
      ];

      for (const step of steps) {
        if (!state.canAccessStep(step)) {
          return step;
        }
      }

      return AUTH_STEPS.PAYMENT; // Последний шаг по умолчанию
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
          children: userChildren.map((child: any) => ({
            id: child.id,
            name: child.name,
            birthDate: child.date_of_birth,
            gender: child.gender,
            limitations: child.has_limitations ? "has_limitations" : "none",
            comment: child.comment || "",
            interests:
              child.interests?.map((interest: any) => interest.name) || [],
            skills: child.skills?.map((skill: any) => skill.name) || [],
            subscription:
              userSubscriptions.find((sub: any) => sub.child_id === child.id)
                ?.plan_name === "premium"
                ? "premium"
                : "base",
          })),
          deliveryAddress: deliveryAddresses.addresses[0]?.address || "",
          deliveryDate: "00.00.0000",
          deliveryTime:
            deliveryAddresses.addresses[0]?.delivery_time_preference || "",
          subscriptionStatus:
            userSubscriptions.length > 0 ? "active" : "not_subscribed",
          nextSetStatus: "not_determined",
          subscriptionDate: userSubscriptions[0]?.created_at,
        };

        // Сохраняем данные в store
        set({ user: userData });

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
  }),
  {
    name: "registration-store",
  }
)
  // {
  //   name: "registration-store", // Имя ключа в localStorage
  //   partialize: (state) => ({
  //     // Сохраняем только основные данные, исключая временные состояния
  //     currentStep: state.currentStep,
  //     phoneData: state.phoneData,
  //     welcomeData: state.welcomeData,
  //     registerData: state.registerData,
  //     categoriesData: state.categoriesData,
  //     subscriptionData: state.subscriptionData,
  //     deliveryData: state.deliveryData,
  //     paymentData: state.paymentData,
  //     user: state.user,
  //   }),
  // }
  // )
);
