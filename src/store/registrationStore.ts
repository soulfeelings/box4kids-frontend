import { create } from "zustand";
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

// Создание store
export const useRegistrationStore = create<RegistrationState>((set, get) => ({
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
}));
