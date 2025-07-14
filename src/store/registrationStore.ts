import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AUTH_STEPS, AuthStep } from "../constants/auth";
import { UserData } from "../types";
import { Gender } from "../api-client/model/gender";

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
interface RegistrationState {
  // Текущий шаг
  currentStep: AuthStep;

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
  isAuthenticated: boolean;

  // Состояние загрузки и ошибок
  isLoading: boolean;
  error: string | null;

  // Действия
  setCurrentStep: (step: AuthStep) => void;
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
}

// Начальное состояние
const initialState = {
  currentStep: AUTH_STEPS.PHONE,
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
  error: null,
};

// Создание store с persist middleware для сохранения в localStorage
export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Computed property для аутентификации
      get isAuthenticated() {
        return get().user !== null;
      },

      // Действия
      setCurrentStep: (step) => set({ currentStep: step }),

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
    }),
    {
      name: "registration-store", // Имя ключа в localStorage
      partialize: (state) => ({
        // Сохраняем только основные данные, исключая временные состояния
        currentStep: state.currentStep,
        phoneData: state.phoneData,
        welcomeData: state.welcomeData,
        registerData: state.registerData,
        categoriesData: state.categoriesData,
        subscriptionData: state.subscriptionData,
        deliveryData: state.deliveryData,
        paymentData: state.paymentData,
        user: state.user,
      }),
    }
  )
);
