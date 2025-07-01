# Zustand Store структура

## 🎯 Принцип slices

Разбиваем store на логические области - каждый slice отвечает за свою функциональность.

### Базовая структура slice

```typescript
// src/store/slices/baseSlice.ts
import { StateCreator } from "zustand";

export interface BaseSlice {
  // Состояние
  someValue: string;

  // Действия
  setSomeValue: (value: string) => void;
  reset: () => void;
}

export const createBaseSlice: StateCreator<
  BaseSlice & OtherSlices, // Все типы store
  [],
  [],
  BaseSlice // Текущий slice
> = (set, get) => ({
  someValue: "",
  setSomeValue: (value) => set({ someValue: value }),
  reset: () => set({ someValue: "" }),
});
```

## 🔐 AuthSlice - аутентификация

```typescript
// src/store/slices/authSlice.ts
import { StateCreator } from "zustand";
import { User } from "../../types/api";

export interface AuthSlice {
  // Состояние
  user: User | null;
  isAuthenticated: boolean;

  // Действия
  setUser: (user: User | null) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice & RegistrationSlice & ChildrenSlice,
  [],
  [],
  AuthSlice
> = (set, get) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  updateUserProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
});
```

## 📋 RegistrationSlice - процесс регистрации

```typescript
// src/store/slices/registrationSlice.ts
import { StateCreator } from "zustand";

export enum RegistrationStep {
  Phone = 0,
  Code = 1,
  Welcome = 2,
  Register = 3,
  Child = 4,
  Categories = 5,
  Subscription = 6,
  Delivery = 7,
  Payment = 8,
  Success = 9,
}

export interface RegistrationSlice {
  // Состояние шагов
  currentStep: RegistrationStep;
  completedSteps: Set<RegistrationStep>;

  // Простые данные форм (остаются в Zustand)
  phone: string;
  code: string;
  name: string;

  // ✅ Кеш сложных форм для сохранения между шагами
  draftData: {
    child: ChildFormData | null;
    delivery: DeliveryFormData | null;
    payment: PaymentFormData | null;
  };

  // Статусы валидации шагов
  stepValidation: {
    child: boolean;
    delivery: boolean;
    payment: boolean;
  };

  // Флаги состояния
  isNewUser: boolean;

  // Действия навигации
  setStep: (step: RegistrationStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  markStepCompleted: (step: RegistrationStep) => void;

  // Действия с простыми данными
  setPhone: (phone: string) => void;
  setCode: (code: string) => void;
  setName: (name: string) => void;
  setIsNewUser: (isNew: boolean) => void;

  // ✅ Действия с кешем форм
  saveChildDraft: (data: ChildFormData) => void;
  saveDeliveryDraft: (data: DeliveryFormData) => void;
  savePaymentDraft: (data: PaymentFormData) => void;
  getChildDraft: () => ChildFormData | null;
  getDeliveryDraft: () => DeliveryFormData | null;
  getPaymentDraft: () => PaymentFormData | null;

  // Валидация шагов
  setStepValid: (
    step: "child" | "delivery" | "payment",
    isValid: boolean
  ) => void;
  isStepValid: (step: "child" | "delivery" | "payment") => boolean;

  // Сброс
  resetRegistration: () => void;
  clearDrafts: () => void;
}

export const createRegistrationSlice: StateCreator<
  AuthSlice & RegistrationSlice & ChildrenSlice,
  [],
  [],
  RegistrationSlice
> = (set, get) => ({
  currentStep: RegistrationStep.Phone,
  completedSteps: new Set(),
  phone: "",
  code: "",
  name: "",
  draftData: {
    child: null,
    delivery: null,
    payment: null,
  },
  stepValidation: {
    child: false,
    delivery: false,
    payment: false,
  },
  isNewUser: false,

  setStep: (step) =>
    set({
      currentStep: step,
    }),

  nextStep: () =>
    set((state) => {
      const nextStep = Math.min(
        state.currentStep + 1,
        RegistrationStep.Success
      );
      return { currentStep: nextStep };
    }),

  prevStep: () =>
    set((state) => {
      const prevStep = Math.max(state.currentStep - 1, 0);
      return { currentStep: prevStep };
    }),

  markStepCompleted: (step) =>
    set((state) => ({
      completedSteps: new Set([...state.completedSteps, step]),
    })),

  setPhone: (phone) => set({ phone }),
  setCode: (code) => set({ code }),
  setName: (name) => set({ name }),
  setIsNewUser: (isNew) => set({ isNewUser: isNew }),

  // ✅ Реализация сохранения/восстановления кеша
  saveChildDraft: (data) =>
    set((state) => {
      state.draftData.child = data;
      state.stepValidation.child = true;
    }),

  saveDeliveryDraft: (data) =>
    set((state) => {
      state.draftData.delivery = data;
      state.stepValidation.delivery = true;
    }),

  savePaymentDraft: (data) =>
    set((state) => {
      state.draftData.payment = data;
      state.stepValidation.payment = true;
    }),

  getChildDraft: () => get().draftData.child,
  getDeliveryDraft: () => get().draftData.delivery,
  getPaymentDraft: () => get().draftData.payment,

  setStepValid: (step, isValid) =>
    set((state) => {
      state.stepValidation[step] = isValid;
    }),

  isStepValid: (step) => get().stepValidation[step],

  resetRegistration: () =>
    set({
      currentStep: RegistrationStep.Phone,
      completedSteps: new Set(),
      phone: "",
      code: "",
      name: "",
      draftData: {
        child: null,
        delivery: null,
        payment: null,
      },
      stepValidation: {
        child: false,
        delivery: false,
        payment: false,
      },
      isNewUser: false,
    }),

  clearDrafts: () =>
    set((state) => {
      state.draftData = {
        child: null,
        delivery: null,
        payment: null,
      };
      state.stepValidation = {
        child: false,
        delivery: false,
        payment: false,
      };
    }),
});
```

## 👶 ChildrenSlice - управление детьми

```typescript
// src/store/slices/childrenSlice.ts
import { StateCreator } from "zustand";
import { Child } from "../../types/api";

// ✅ Гибридный подход: сложные формы в React Hook Form, простое состояние в Zustand

// Типы данных форм для кеширования
export interface ChildFormData {
  name: string;
  birthDate: string;
  gender: "male" | "female" | "";
  interests: string[];
  skills: string[];
  limitations: "none" | "has_limitations" | "";
  comment: string;
}

export interface DeliveryFormData {
  address: string;
  city: string;
  postalCode: string;
  deliveryDate: string;
  deliveryTime: string;
  comment: string;
}

export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
}

export interface ChildrenSlice {
  // Состояние списка детей
  children: Child[];
  selectedChildId: string | null; // для выбора ребенка при оформлении подписки

  // Действия со списком
  addChild: (child: Child) => void;
  updateChild: (id: string, updates: Partial<Child>) => void;
  removeChild: (id: string) => void;
  setChildren: (children: Child[]) => void;
  setSelectedChild: (childId: string | null) => void;

  // Селекторы
  getChildById: (id: string) => Child | undefined;
  getChildrenBySubscription: (subscription: "base" | "premium") => Child[];
}

export const createChildrenSlice: StateCreator<
  AuthSlice & RegistrationSlice & ChildrenSlice,
  [],
  [],
  ChildrenSlice
> = (set, get) => ({
  children: [],
  selectedChildId: null,

  addChild: (child) =>
    set((state) => ({
      children: [...state.children, child],
    })),

  updateChild: (id, updates) =>
    set((state) => ({
      children: state.children.map((child) =>
        child.id === id ? { ...child, ...updates } : child
      ),
    })),

  removeChild: (id) =>
    set((state) => ({
      children: state.children.filter((child) => child.id !== id),
    })),

  setChildren: (children) => set({ children }),

  setSelectedChild: (childId) => set({ selectedChildId: childId }),

  getChildById: (id) => get().children.find((child) => child.id === id),

  getChildrenBySubscription: (subscription) =>
    get().children.filter((child) => child.subscription === subscription),
});
```

## 🛍️ SubscriptionSlice - подписки

```typescript
// src/store/slices/subscriptionSlice.ts
import { StateCreator } from "zustand";

export type PlanType = "base" | "premium";

export interface SubscriptionSlice {
  // Выбранные планы для детей
  selectedPlans: Record<string, PlanType>; // childId -> planType

  // ✅ Простые поля остаются в Zustand, сложные формы доставки -> React Hook Form
  currentStep: "plan" | "delivery" | "payment";

  // Действия с планами
  setPlanForChild: (childId: string, plan: PlanType) => void;
  removePlanForChild: (childId: string) => void;
  clearAllPlans: () => void;
  setSubscriptionStep: (step: "plan" | "delivery" | "payment") => void;

  // Вычисляемые поля (как геттеры)
  getTotalPrice: () => number;
  getSelectedChildrenIds: () => string[];
}

export const createSubscriptionSlice: StateCreator<
  AuthSlice & RegistrationSlice & ChildrenSlice & SubscriptionSlice,
  [],
  [],
  SubscriptionSlice
> = (set, get) => ({
  selectedPlans: {},
  currentStep: "plan",

  setPlanForChild: (childId, plan) =>
    set((state) => ({
      selectedPlans: {
        ...state.selectedPlans,
        [childId]: plan,
      },
    })),

  removePlanForChild: (childId) =>
    set((state) => {
      const { [childId]: removed, ...rest } = state.selectedPlans;
      return { selectedPlans: rest };
    }),

  clearAllPlans: () => set({ selectedPlans: {} }),

  setSubscriptionStep: (step) => set({ currentStep: step }),

  getTotalPrice: () => {
    const { selectedPlans } = get();
    return Object.values(selectedPlans).reduce((total, plan) => {
      const basePrice = plan === "premium" ? 60 : 35;
      return total + basePrice;
    }, 0);
  },

  getSelectedChildrenIds: () => Object.keys(get().selectedPlans),
});
```

## 🏪 Главный Store

```typescript
// src/store/index.ts
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createAuthSlice, AuthSlice } from "./slices/authSlice";
import {
  createRegistrationSlice,
  RegistrationSlice,
} from "./slices/registrationSlice";
import { createChildrenSlice, ChildrenSlice } from "./slices/childrenSlice";
import {
  createSubscriptionSlice,
  SubscriptionSlice,
} from "./slices/subscriptionSlice";

export type AppState = AuthSlice &
  RegistrationSlice &
  ChildrenSlice &
  SubscriptionSlice;

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((...args) => ({
          ...createAuthSlice(...args),
          ...createRegistrationSlice(...args),
          ...createChildrenSlice(...args),
          ...createSubscriptionSlice(...args),
        }))
      ),
      {
        name: "box4kids-store",
        // Сохраняем только важные данные
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          children: state.children,
          selectedPlans: state.selectedPlans,
        }),
        // Версионирование для миграций
        version: 1,
        migrate: (persistedState, version) => {
          if (version === 0) {
            // Миграция с версии 0 на 1
            return {
              ...persistedState,
              // Добавляем новые поля
            };
          }
          return persistedState;
        },
      }
    ),
    { name: "Box4Kids Store" }
  )
);
```

## 🔍 Селекторы

```typescript
// src/store/selectors.ts
import { AppState } from "./index";

// Auth селекторы
export const selectUser = (state: AppState) => state.user;
export const selectIsAuthenticated = (state: AppState) => state.isAuthenticated;

// Registration селекторы
export const selectCurrentStep = (state: AppState) => state.currentStep;
export const selectRegistrationData = (state: AppState) => ({
  phone: state.phone,
  code: state.code,
  name: state.name,
});

// Children селекторы
export const selectChildren = (state: AppState) => state.children;
export const selectChildrenCount = (state: AppState) => state.children.length;
export const selectCurrentChildForm = (state: AppState) =>
  state.currentChildForm;

// Subscription селекторы
export const selectSelectedPlans = (state: AppState) => state.selectedPlans;
export const selectTotalPrice = (state: AppState) => state.getTotalPrice();

// Комбинированные селекторы
export const selectChildrenWithPlans = (state: AppState) =>
  state.children.map((child) => ({
    ...child,
    selectedPlan: state.selectedPlans[child.id] || null,
  }));

export const selectRegistrationProgress = (state: AppState) => {
  const totalSteps = 10; // Общее количество шагов
  const currentStep = state.currentStep;
  return Math.round((currentStep / totalSteps) * 100);
};
```

## 🎣 Специализированные хуки

```typescript
// src/hooks/store/useAuth.ts
import { useAppStore } from "../../store";
import { selectUser, selectIsAuthenticated } from "../../store/selectors";

export const useAuth = () => {
  const user = useAppStore(selectUser);
  const isAuthenticated = useAppStore(selectIsAuthenticated);
  const setUser = useAppStore((state) => state.setUser);
  const logout = useAppStore((state) => state.logout);

  return {
    user,
    isAuthenticated,
    actions: {
      setUser,
      logout,
    },
  };
};

// src/hooks/store/useRegistration.ts
export const useRegistration = () => {
  const currentStep = useAppStore(selectCurrentStep);
  const registrationData = useAppStore(selectRegistrationData);
  const progress = useAppStore(selectRegistrationProgress);

  const actions = useAppStore((state) => ({
    setStep: state.setStep,
    nextStep: state.nextStep,
    prevStep: state.prevStep,
    setPhone: state.setPhone,
    setCode: state.setCode,
    setName: state.setName,
    reset: state.resetRegistration,
  }));

  return {
    currentStep,
    progress,
    data: registrationData,
    actions,
  };
};

// src/hooks/store/useChildren.ts
export const useChildren = () => {
  const children = useAppStore(selectChildren);
  const currentForm = useAppStore(selectCurrentChildForm);
  const editingId = useAppStore((state) => state.editingChildId);

  const actions = useAppStore((state) => ({
    addChild: state.addChild,
    updateChild: state.updateChild,
    removeChild: state.removeChild,
    setForm: state.setChildForm,
    resetForm: state.resetChildForm,
    startEditing: state.startEditingChild,
    stopEditing: state.stopEditingChild,
  }));

  return {
    children,
    currentForm,
    editingId,
    actions,
  };
};
```

## ⚙️ Middleware и утилиты

### Логирование изменений

```typescript
// src/store/middleware/logger.ts
export const logger = (config) => (set, get, store) =>
  config(
    (...args) => {
      console.log("Store update:", args);
      set(...args);
      console.log("New state:", get());
    },
    get,
    store
  );
```

### Подписка на изменения

```typescript
// src/hooks/store/useStoreSubscription.ts
import { useEffect } from "react";
import { useAppStore } from "../../store";

export const useStoreSubscription = () => {
  useEffect(() => {
    // Подписываемся на изменения пользователя
    const unsubscribe = useAppStore.subscribe(
      (state) => state.user,
      (user) => {
        console.log("User changed:", user);
        // Можно отправить аналитику, синхронизировать с сервером и т.д.
      }
    );

    return unsubscribe;
  }, []);
};
```

## 🧪 Тестирование Store

```typescript
// src/store/__tests__/authSlice.test.ts
import { useAppStore } from "../index";

describe("AuthSlice", () => {
  beforeEach(() => {
    useAppStore.getState().logout(); // Сброс состояния
  });

  it("should set user correctly", () => {
    const mockUser = {
      id: 1,
      phone_number: "+7999999999",
      name: "Test User",
      role: "parent" as const,
      created_at: "2023-01-01",
    };

    useAppStore.getState().setUser(mockUser);

    const state = useAppStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should logout correctly", () => {
    const mockUser = {
      /* ... */
    };

    useAppStore.getState().setUser(mockUser);
    useAppStore.getState().logout();

    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
```

## 🚀 Производительность

### Оптимизация селекторов

```typescript
// Используйте мелкие селекторы вместо подписки на весь store
const userName = useAppStore((state) => state.user?.name); // ✅ Хорошо
const { user } = useAppStore(); // ❌ Плохо - подписка на весь user объект
```

### Мемоизация комплексных селекторов

```typescript
import { useMemo } from "react";

export const useChildrenWithPlans = () => {
  const children = useAppStore(selectChildren);
  const plans = useAppStore(selectSelectedPlans);

  return useMemo(
    () =>
      children.map((child) => ({
        ...child,
        plan: plans[child.id],
      })),
    [children, plans]
  );
};
```

## 📝 Улучшение форм с zustand-forms

### Установка расширения

```bash
npm install zustand-forms
```

### Упрощенная форма ребенка

```typescript
// src/store/forms/childForm.ts
import { createFormStore } from "zustand-forms";

export interface ChildFormData {
  name: string;
  birthDate: string;
  gender: "male" | "female" | "";
  limitations: "none" | "has_limitations" | "";
  comment: string;
  interests: string[];
  skills: string[];
}

const childFormValidation = {
  name: (value: string) => {
    if (!value.trim()) return "Введите имя ребенка";
    if (value.trim().length < 2)
      return "Имя должно содержать минимум 2 символа";
    return null;
  },

  birthDate: (value: string) => {
    if (!value) return "Выберите дату рождения";
    const age = calculateAge(value);
    if (age < 3 || age > 15) return "Возраст должен быть от 3 до 15 лет";
    return null;
  },

  gender: (value: string) => {
    if (!value) return "Выберите пол ребенка";
    return null;
  },

  interests: (value: string[]) => {
    if (value.length === 0) return "Выберите хотя бы один интерес";
    if (value.length > 5) return "Максимум 5 интересов";
    return null;
  },
};

export const useChildForm = createFormStore<ChildFormData>({
  initialValues: {
    name: "",
    birthDate: "",
    gender: "",
    limitations: "",
    comment: "",
    interests: [],
    skills: [],
  },

  validation: childFormValidation,

  onSubmit: async (values) => {
    // Интеграция с основным store
    const { user, addChild } = useAppStore.getState();

    const childData = {
      ...values,
      age: calculateAge(values.birthDate),
      parent_id: user!.id,
    };

    await childService.createChild(childData);
    addChild(childData);
  },
});
```

### Использование в компоненте

```typescript
// src/components/ChildForm.tsx
import { useChildForm } from "../store/forms/childForm";

export const ChildForm: React.FC = () => {
  const form = useChildForm();

  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <input
          type="text"
          value={form.values.name}
          onChange={(e) => form.setFieldValue("name", e.target.value)}
          onBlur={() => form.setFieldTouched("name")}
        />
        {form.touched.name && form.errors.name && (
          <span className="error">{form.errors.name}</span>
        )}
      </div>

      <div>
        <input
          type="date"
          value={form.values.birthDate}
          onChange={(e) => form.setFieldValue("birthDate", e.target.value)}
          onBlur={() => form.setFieldTouched("birthDate")}
        />
        {form.touched.birthDate && form.errors.birthDate && (
          <span className="error">{form.errors.birthDate}</span>
        )}
      </div>

      <div>
        <select
          value={form.values.gender}
          onChange={(e) => form.setFieldValue("gender", e.target.value)}
        >
          <option value="">Выберите пол</option>
          <option value="male">Мальчик</option>
          <option value="female">Девочка</option>
        </select>
        {form.touched.gender && form.errors.gender && (
          <span className="error">{form.errors.gender}</span>
        )}
      </div>

      <button type="submit" disabled={!form.isValid || form.isSubmitting}>
        {form.isSubmitting ? "Сохранение..." : "Добавить ребенка"}
      </button>
    </form>
  );
};
```

### Хук для интеграции с основным store

```typescript
// src/hooks/store/useChildFormIntegration.ts
import { useChildForm } from "../../store/forms/childForm";
import { useAppStore } from "../../store";

export const useChildFormIntegration = () => {
  const form = useChildForm();
  const { editingChildId, startEditingChild, stopEditingChild } = useAppStore();

  // Загрузка данных при редактировании
  const loadChildForEditing = (childId: string) => {
    const child = useAppStore.getState().getChildById(childId);
    if (child) {
      form.setValues({
        name: child.name,
        birthDate: ageToDate(child.age), // Утилита конвертации
        gender: child.gender,
        limitations: child.limitations,
        comment: child.comment || "",
        interests: child.interests,
        skills: child.skills,
      });
      startEditingChild(childId);
    }
  };

  // Сброс формы
  const resetForm = () => {
    form.reset();
    stopEditingChild();
  };

  return {
    form,
    editingChildId,
    loadChildForEditing,
    resetForm,
  };
};
```

### Преимущества zustand-forms

```typescript
// ✅ Автоматическая валидация
form.errors.name; // Ошибки валидации
form.touched.name; // Поля, которых касался пользователь
form.isValid; // Валидна ли вся форма

// ✅ Состояния формы
form.isSubmitting; // Идет ли отправка
form.isDirty; // Изменялась ли форма
form.pristine; // Девственно чистая форма

// ✅ Удобные методы
form.setFieldValue("name", "Новое имя");
form.setFieldError("name", "Пользовательская ошибка");
form.setValues(newValues); // Обновить все значения
form.reset(); // Сброс к начальным значениям

// ✅ Валидация по триггерам
form.validateField("name"); // Валидация конкретного поля
form.validateForm(); // Валидация всей формы
```

### Сравнение подходов

| Функция         | Ручной подход       | zustand-forms  |
| --------------- | ------------------- | -------------- |
| Состояние формы | `useState` x10      | `form.values`  |
| Валидация       | Ручная проверка     | Автоматическая |
| Ошибки          | `useState` errors   | `form.errors`  |
| Dirty/Touched   | Ручное отслеживание | Встроенное     |
| Сброс формы     | Много `setState`    | `form.reset()` |
| Типизация       | Частичная           | Полная         |

### Когда использовать zustand-forms?

**✅ Используйте для:**

- Сложных форм с валидацией (форма ребенка)
- Форм с условной логикой
- Форм с множественными полями
- Когда нужны состояния dirty/touched

**❌ НЕ используйте для:**

- Простых форм (поиск, фильтры)
- Однопольных форм
- Когда bundle size критичен

### Установка и настройка

```json
{
  "dependencies": {
    "zustand-forms": "^1.0.0"
  }
}
```

```typescript
// src/types/forms.ts
declare module "zustand-forms" {
  export function createFormStore<T>(config: FormConfig<T>): FormStore<T>;
}
```
