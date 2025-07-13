import { create } from "zustand";
import { AUTH_STEPS, AuthStep } from "../constants/auth";

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

export interface ChildData {
  id?: number; // Добавляем ID
  name: string;
  birthDate: string;
  gender: string;
  limitations: string;
  comment: string;
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
  children: ChildData[]; // Изменяем на массив
  categoriesData: CategoriesData;
  subscriptionData: SubscriptionData;
  deliveryData: DeliveryData;
  paymentData: PaymentData;

  // ID пользователя после завершения регистрации
  userId: number | null;

  // Состояние загрузки и ошибок
  isLoading: boolean;
  error: string | null;

  // Действия
  setCurrentStep: (step: AuthStep) => void;
  setPhoneData: (data: Partial<PhoneData>) => void;
  setWelcomeData: (data: Partial<WelcomeData>) => void;
  setRegisterData: (data: Partial<RegisterData>) => void;
  addChild: (child: ChildData) => void; // Добавить ребенка
  updateChild: (id: number, data: Partial<ChildData>) => void; // Обновить ребенка
  getCurrentChild: () => ChildData | null; // Получить текущего ребенка
  setCategoriesData: (data: Partial<CategoriesData>) => void;
  setSubscriptionData: (data: Partial<SubscriptionData>) => void;
  setDeliveryData: (data: Partial<DeliveryData>) => void;
  setPaymentData: (data: Partial<PaymentData>) => void;
  setUserId: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetRegistration: () => void;

  // Для обратной совместимости
  childData: ChildData; // Виртуальное поле для текущего ребенка
  setChildData: (data: Partial<ChildData>) => void; // Обновить текущего ребенка
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
  children: [], // Пустой массив детей
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
  userId: null,
  isLoading: false,
  error: null,
};

// Создание store
export const useRegistrationStore = create<RegistrationState>((set, get) => ({
  ...initialState,

  // Виртуальное поле для текущего ребенка (обратная совместимость)
  get childData() {
    const children = get().children;
    return (
      children[0] || {
        name: "",
        birthDate: "",
        gender: "",
        limitations: "",
        comment: "",
      }
    );
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

  // Новые методы для работы с детьми
  addChild: (child) =>
    set((state) => ({
      children: [...state.children, child],
    })),

  updateChild: (id, data) =>
    set((state) => ({
      children: state.children.map((child) =>
        child.id === id ? { ...child, ...data } : child
      ),
    })),

  getCurrentChild: () => {
    const children = get().children;
    return children[0] || null;
  },

  // Для обратной совместимости - обновляем первого ребенка или создаем нового
  setChildData: (data) =>
    set((state) => {
      if (state.children.length === 0) {
        // Создаем нового ребенка
        return {
          children: [
            {
              ...data,
              name: data.name || "",
              birthDate: data.birthDate || "",
              gender: data.gender || "",
              limitations: data.limitations || "",
              comment: data.comment || "",
            },
          ],
        };
      } else {
        // Обновляем первого ребенка
        return {
          children: state.children.map((child, index) =>
            index === 0 ? { ...child, ...data } : child
          ),
        };
      }
    }),

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

  setUserId: (id) => set({ userId: id }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  resetRegistration: () => set(initialState),
}));
