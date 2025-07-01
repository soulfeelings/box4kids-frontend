# План внедрения

## 🗓️ Общий план (6-7 дней)

### Этап 1: Инфраструктура (1-2 дня)

### Этап 2: Аутентификация (1 день)

### Этап 3: Регистрация и профиль (1 день)

### Этап 4: Дети и подписки (2-3 дня)

### Этап 5: UX улучшения (1 день)

---

## 📋 Этап 1: Инфраструктура (1-2 дня)

### День 1: Основа

**Время:** 4-6 часов

#### 1.1 Установка зависимостей (30 мин)

```bash
# Основные библиотеки
npm install @tanstack/react-query zustand immer react-hook-form

# DevTools
npm install @tanstack/react-query-devtools --save-dev

# Проверка установки
npm list @tanstack/react-query zustand immer react-hook-form
```

#### 1.2 Создание структуры папок (15 мин)

```bash
# Создание папок
mkdir -p src/{services,store,hooks,types,components,utils}
mkdir -p src/store/slices
mkdir -p src/hooks/{api,store}

# Проверка структуры
tree src/ -I 'node_modules'
```

#### 1.3 Настройка TypeScript типов (1 час)

```typescript
// src/types/api.ts
export interface User {
  id: number;
  phone_number: string;
  name?: string;
  role: "parent" | "admin";
  created_at: string;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  interests: string[];
  skills: string[];
  limitations: "none" | "has_limitations";
  comment?: string;
  subscription?: "base" | "premium";
}

// src/types/requests.ts
export interface SendOtpRequest {
  phone_number: string;
}

export interface VerifyOtpRequest {
  phone_number: string;
  code: string;
}

// src/types/errors.ts
export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}
```

#### 1.4 Создание API клиента (1.5 часа)

```typescript
// src/services/api.ts
class ApiClient {
  private baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(error.detail || "API Error", response.status, error);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
```

#### 1.5 Создание базовых сервисов (2 часа)

```typescript
// src/services/authService.ts
export class AuthService {
  async sendOtp(phoneNumber: string) {
    return apiClient.post("/auth/send-otp", { phone_number: phoneNumber });
  }

  async verifyOtp(phoneNumber: string, code: string) {
    return apiClient.post("/auth/verify-otp", {
      phone_number: phoneNumber,
      code: code,
    });
  }
}

export const authService = new AuthService();

// src/services/userService.ts
export class UserService {
  async updateProfile(userId: number, data: { name: string }) {
    return apiClient.put(`/users/${userId}/profile`, data);
  }
}

export const userService = new UserService();
```

#### 1.6 Настройка React Query (1 час)

```typescript
// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginPage />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### День 2: Store (при необходимости)

**Время:** 2-4 часа

#### 2.1 Создание базовых slices (2 часа)

```typescript
// src/store/slices/authSlice.ts
export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (
  set
) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
});

// src/store/slices/registrationSlice.ts
// ✅ Только простые поля и навигация - сложные формы в React Hook Form
export const createRegistrationSlice: StateCreator<
  AppState,
  [],
  [],
  RegistrationSlice
> = (set) => ({
  currentStep: 0,
  phone: "",
  code: "",
  name: "",
  setStep: (step) => set({ currentStep: step }),
  setPhone: (phone) => set({ phone }),
  setCode: (code) => set({ code }),
  setName: (name) => set({ name }),
  reset: () => set({ currentStep: 0, phone: "", code: "", name: "" }),
});
```

#### 2.2 Объединение в главный store (1 час)

```typescript
// src/store/index.ts
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((...args) => ({
        ...createAuthSlice(...args),
        ...createRegistrationSlice(...args),
      })),
      { name: "box4kids-store" }
    ),
    { name: "Box4Kids Store" }
  )
);
```

#### 2.3 Создание хуков для store (1 час)

```typescript
// src/hooks/store/useAuth.ts
export const useAuth = () => {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const logout = useAppStore((state) => state.logout);

  return { user, setUser, logout };
};
```

**✅ Результат Этапа 1:**

- Настроена инфраструктура
- API клиент готов к использованию
- Store структура создана
- TypeScript типы определены

---

## 🔐 Этап 2: Аутентификация (1 день)

**Время:** 6-8 часов

### 2.1 Создание React Query хуков (2 часа)

```typescript
// src/hooks/api/useAuth.ts
export const useAuth = () => {
  const queryClient = useQueryClient();

  const sendOtpMutation = useMutation({
    mutationFn: authService.sendOtp,
    onError: (error) => console.error("OTP Error:", error),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      authService.verifyOtp(phone, code),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
    },
  });

  return {
    sendOtp: sendOtpMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    isLoading: sendOtpMutation.isPending || verifyOtpMutation.isPending,
    error: sendOtpMutation.error || verifyOtpMutation.error,
  };
};
```

### 2.2 Замена handleSendCode (1 час)

```typescript
// LoginPage.tsx - обновление
import { useAuth } from "../hooks/api/useAuth";

const { sendOtp, isLoading, error } = useAuth();

const handleSendCode = async () => {
  if (phone.length < 7) {
    setError("Введите корректный номер телефона");
    return;
  }

  try {
    await sendOtp(phone);
    setStep(Step.Code);
  } catch (error) {
    setError(error.message || "Ошибка отправки кода");
  }
};
```

### 2.3 Замена handleCheckCode (2 часа)

```typescript
const { verifyOtp } = useAuth();
const { setUser } = useAppStore();

const handleCheckCode = async () => {
  if (code.length !== 4) {
    setError("Введите 4-значный код");
    return;
  }

  try {
    const user = await verifyOtp({ phone, code });
    setUser(user);

    if (!user.name) {
      setWelcomeIndex(0);
      setStep(Step.Welcome);
    } else {
      setStep(Step.Success);
    }
  } catch (error) {
    setError(error.message || "Неверный код");
  }
};
```

### 2.4 Добавление состояний загрузки (1.5 часа)

```typescript
// src/components/LoadingButton.tsx
export const LoadingButton: React.FC<{
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, isLoading, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className="btn-primary"
  >
    {isLoading ? "Загрузка..." : children}
  </button>
);

// Использование
<LoadingButton
  onClick={handleSendCode}
  isLoading={isLoading}
  disabled={phone.length < 7}
>
  Отправить код
</LoadingButton>;
```

### 2.5 Тестирование аутентификации (1.5 часа)

```bash
# Запуск бекенда (если еще не запущен)
cd server && python -m uvicorn main:app --reload

# Тестирование фронтенда
cd web && npm start

# Проверить в браузере:
# 1. Отправка кода работает
# 2. Состояния загрузки отображаются
# 3. Ошибки обрабатываются
# 4. DevTools показывают запросы
```

**✅ Результат Этапа 2:**

- Отправка OTP работает с реальным API
- Проверка OTP работает с реальным API
- Состояния загрузки добавлены
- Обработка ошибок настроена

---

## 👤 Этап 3: Регистрация и профиль (1 день)

**Время:** 6-8 часов

### 3.1 Создание хука для профиля (1 час)

```typescript
// src/hooks/api/useUserProfile.ts
export const useUserProfile = () => {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number;
      data: { name: string };
    }) => userService.updateProfile(userId, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user"], updatedUser);
    },
  });

  return {
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    error: updateProfileMutation.error,
  };
};
```

### 3.2 Замена handleRegister (1.5 часа)

```typescript
import { useUserProfile } from "../hooks/api/useUserProfile";

const { updateProfile, isUpdating } = useUserProfile();
const { user } = useAuth();

const handleRegister = async () => {
  if (!name.trim()) {
    setError("Введите имя");
    return;
  }

  if (!user) {
    setError("Ошибка аутентификации");
    return;
  }

  try {
    const updatedUser = await updateProfile({
      userId: user.id,
      data: { name: name.trim() },
    });

    setUser(updatedUser);
    setStep(Step.Child);
  } catch (error) {
    setError(error.message || "Ошибка регистрации");
  }
};
```

### 3.3 Интеграция с Zustand store (2 часа)

```typescript
// Замена локальных useState на store
const { currentStep, data, actions } = useRegistration();
const { phone, code, name } = data;
const { setPhone, setCode, setName, setStep } = actions;

// Обновление обработчиков
const handlePhoneChange = (value: string) => {
  setPhone(value);
};

const handleCodeChange = (value: string) => {
  setCode(value);
};

const handleNameChange = (value: string) => {
  setName(value);
};
```

### 3.4 Улучшение обработки ошибок (1.5 часа)

```typescript
// src/utils/errorHandling.ts
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return "Некорректные данные";
      case 429:
        return "Слишком много запросов. Попробуйте позже";
      case 500:
        return "Ошибка сервера. Попробуйте позже";
      default:
        return error.message || "Произошла ошибка";
    }
  }
  return "Произошла неожиданная ошибка";
};

// src/components/ErrorMessage.tsx
export const ErrorMessage: React.FC<{ error: string | null }> = ({ error }) => {
  if (!error) return null;

  return <div className="error-message">{error}</div>;
};
```

### 3.5 Тестирование регистрации (2 часа)

```typescript
// Тестовые сценарии:
// 1. Новый пользователь: Phone → Code → Welcome → Register → Child
// 2. Существующий пользователь: Phone → Code → Success
// 3. Обработка ошибок на каждом шаге
// 4. Состояния загрузки работают корректно
// 5. Store сохраняет состояние
```

**✅ Результат Этапа 3:**

- Регистрация работает с реальным API
- Профиль пользователя обновляется
- Store интегрирован с компонентами
- Улучшена обработка ошибок

---

## 👶 Этап 4: Дети и подписки (2-3 дня)

### День 1: API для детей (6-8 часов)

#### 4.1 Расширение типов (30 мин)

```typescript
// src/types/api.ts - дополнение
export interface ChildCreateRequest {
  name: string;
  age: number;
  gender: "male" | "female";
  interests: string[];
  skills: string[];
  limitations: "none" | "has_limitations";
  comment?: string;
  parent_id: number;
}
```

#### 4.2 Создание ChildService (1.5 часа)

```typescript
// src/services/childService.ts
export class ChildService {
  async createChild(data: ChildCreateRequest): Promise<Child> {
    return apiClient.post("/users/children", data);
  }

  async getChildren(parentId: number): Promise<Child[]> {
    return apiClient.get(`/users/${parentId}/children`);
  }

  async updateChild(childId: string, data: Partial<Child>): Promise<Child> {
    return apiClient.put(`/children/${childId}`, data);
  }
}

export const childService = new ChildService();
```

#### 4.3 Создание хуков для детей (2 часа)

```typescript
// src/hooks/api/useChildren.ts
export const useChildren = (parentId?: number) => {
  const queryClient = useQueryClient();

  const childrenQuery = useQuery({
    queryKey: ["children", parentId],
    queryFn: () => childService.getChildren(parentId!),
    enabled: !!parentId,
  });

  const createChildMutation = useMutation({
    mutationFn: childService.createChild,
    onSuccess: (newChild) => {
      queryClient.setQueryData(["children", parentId], (old: Child[]) => [
        ...(old || []),
        newChild,
      ]);
    },
  });

  return {
    children: childrenQuery.data || [],
    isLoading: childrenQuery.isLoading,
    createChild: createChildMutation.mutate,
    isCreating: createChildMutation.isPending,
  };
};
```

#### 4.4 Создание форм на React Hook Form (3 часа)

```typescript
// src/components/ChildForm.tsx - новый подход с React Hook Form
import { useForm } from "react-hook-form";

interface ChildFormData {
  name: string;
  birthDate: string;
  gender: "male" | "female" | "";
  interests: string[];
  skills: string[];
  limitations: "none" | "has_limitations";
  comment: string;
}

export const ChildForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChildFormData>();
  const { createChild, isCreating } = useChildren(user?.id);
  const { nextStep } = useRegistration(); // координация шагов через Zustand

  const onSubmit = async (data: ChildFormData) => {
    try {
      const childData: ChildCreateRequest = {
        ...data,
        age: calculateAge(data.birthDate),
        parent_id: user!.id,
      };

      await createChild(childData);
      nextStep(); // переход к следующему шагу
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name", { required: "Введите имя ребенка" })}
        placeholder="Имя ребенка"
      />
      {errors.name && <span>{errors.name.message}</span>}
      {/* остальные поля... */}
    </form>
  );
};
```

#### 4.5 Интеграция с Zustand для навигации (1 час)

```typescript
// src/hooks/useRegistrationForm.ts - связующий хук
export const useRegistrationForm = () => {
  const { currentStep, setStep, nextStep, prevStep } = useRegistration();

  const goToNextStep = (data?: any) => {
    // Сохраняем данные если нужно
    if (data) {
      // логика сохранения временных данных
    }
    nextStep();
  };

  return { currentStep, setStep, goToNextStep, prevStep };
};
```

#### 4.6 Реализация сохранения состояния между шагами (2 часа)

```typescript
// src/components/ChildForm.tsx - с сохранением состояния
export const ChildForm = () => {
  const { saveChildDraft, getChildDraft, nextStep } = useRegistration();

  const form = useForm<ChildFormData>({
    // ✅ Восстанавливаем данные при возврате на шаг
    defaultValues: getChildDraft() || {
      name: "",
      birthDate: "",
      gender: "",
      interests: [],
      skills: [],
      limitations: "",
      comment: "",
    },
  });

  const onSubmit = async (data: ChildFormData) => {
    // ✅ Сохраняем в кеш Zustand
    saveChildDraft(data);

    // Переходим к следующему шагу
    nextStep();
  };

  // ✅ Автосохранение при изменениях (опционально)
  const { watch } = form;
  const watchedData = watch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.values(watchedData).some((val) => val !== "")) {
        saveChildDraft(watchedData as ChildFormData);
      }
    }, 1000); // debounce 1 секунда

    return () => clearTimeout(timer);
  }, [watchedData, saveChildDraft]);

  return <form onSubmit={handleSubmit(onSubmit)}>{/* форма */}</form>;
};
```

#### 4.7 Финальная отправка всех данных (1 час)

```typescript
// src/hooks/useRegistrationSubmit.ts
export const useRegistrationSubmit = () => {
  const { getChildDraft, getDeliveryDraft, getPaymentDraft } =
    useRegistration();
  const { createChild } = useChildren();
  const { createSubscription } = useSubscriptions();

  const submitRegistration = async () => {
    // ✅ Собираем все данные из кеша
    const childData = getChildDraft();
    const deliveryData = getDeliveryDraft();
    const paymentData = getPaymentDraft();

    if (!childData || !deliveryData || !paymentData) {
      throw new Error("Не все данные заполнены");
    }

    // ✅ Отправляем одним пакетом
    const child = await createChild(childData);
    const subscription = await createSubscription({
      childId: child.id,
      delivery: deliveryData,
      payment: paymentData,
    });

    return { child, subscription };
  };

  return { submitRegistration };
};
```

#### 4.8 Тестирование сохранения состояния (1 час)

```typescript
// Тестовые сценарии:
// 1. Заполнить форму ребенка → перейти к доставке → вернуться → данные сохранены
// 2. Автосохранение срабатывает при изменениях
// 3. Перезагрузка страницы (если добавлен persist) → данные восстановлены
// 4. Финальная отправка собирает данные всех шагов
// 5. Сброс формы очищает весь кеш
```

### День 2: Подписки и доставка (6-8 часов)

#### 4.6 Создание SubscriptionService (1.5 часа)

```typescript
// src/services/subscriptionService.ts
export class SubscriptionService {
  async createSubscription(
    data: SubscriptionCreateRequest
  ): Promise<Subscription> {
    return apiClient.post("/subscriptions/create", data);
  }

  async getSubscriptions(userId: number): Promise<Subscription[]> {
    return apiClient.get(`/subscriptions/user/${userId}`);
  }
}
```

#### 4.7 Обновление handleSubscriptionSubmit (2 часа)

#### 4.8 Создание API для доставки (2 часа)

#### 4.9 Обновление handleDeliverySubmit (1.5 часа)

#### 4.10 Тестирование полного flow (1 час)

### День 3: Интеграция и полировка (4-6 часов)

#### 4.11 Создание store slices для детей и подписок (2 часа)

#### 4.12 Интеграция всех API в единый flow (2 часа)

#### 4.13 Тестирование полного цикла регистрации (2 часа)

**✅ Результат Этапа 4:**

- API для всех этапов регистрации работает
- Данные корректно сохраняются на бекенде
- Store синхронизирован с сервером
- **✅ Состояние форм сохраняется между шагами**
- **✅ Пользователь может свободно переходить туда-сюда без потери данных**
- **✅ Автосохранение предотвращает потерю данных**
- Полный flow от телефона до оплаты функционирует

---

## 🎨 Этап 5: UX улучшения (1 день)

**Время:** 6-8 часов

### 5.1 Улучшение индикаторов загрузки (1.5 часа)

```typescript
// src/components/ProgressIndicator.tsx
export const ProgressIndicator: React.FC<{
  current: number;
  total: number;
}> = ({ current, total }) => {
  const progress = Math.round((current / total) * 100);

  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }} />
      <span>{progress}%</span>
    </div>
  );
};
```

### 5.2 Добавление валидации форм (2 часа)

```typescript
// src/utils/validation.ts
export const validatePhone = (phone: string): string | null => {
  if (phone.length < 7) return "Введите корректный номер телефона";
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name.trim()) return "Введите имя";
  if (name.trim().length < 2) return "Имя должно содержать минимум 2 символа";
  return null;
};
```

### 5.3 Персистентность состояния (1.5 часа)

```typescript
// Настройка persist middleware
export const useAppStore = create<AppState>()(
  persist(
    // store...
    {
      name: "box4kids-store",
      partialize: (state) => ({
        user: state.user,
        children: state.children,
        selectedPlans: state.selectedPlans,
      }),
    }
  )
);
```

### 5.4 Оптимизация производительности (1.5 часа)

```typescript
// Мемоизация селекторов
const selectUserName = useCallback((state: AppState) => state.user?.name, []);

// Разделение хуков
const userName = useAppStore(selectUserName); // Подписка только на имя
```

### 5.5 Добавление аналитики (1.5 часа)

```typescript
// src/utils/analytics.ts
export const trackEvent = (event: string, data?: any) => {
  console.log(`Analytics: ${event}`, data);
  // Интеграция с аналитическими системами
};

// Использование
const handleSendCode = async () => {
  trackEvent("otp_send_started", { phone });
  // ...
  trackEvent("otp_send_success");
};
```

**✅ Результат Этапа 5:**

- Улучшены индикаторы загрузки
- Добавлена валидация форм
- Настроена персистентность
- Оптимизирована производительность
- Добавлена базовая аналитика

---

## 🧪 Тестирование и финализация

### Финальное тестирование (2 часа)

```bash
# Чек-лист полного тестирования:
# 1. Все API эндпоинты работают
# 2. Состояния загрузки отображаются
# 3. Ошибки обрабатываются корректно
# 4. Store сохраняет состояние
# 5. DevTools показывают корректные запросы
# 6. Переходы между шагами работают
# 7. Данные персистентны при перезагрузке
```

### Документация (1 час)

```markdown
# README для команды

- Как запустить проект
- Структура кода
- Основные хуки и сервисы
- Как добавить новый API
```

---

## 🔧 Этап 6: Рефакторинг кода (1 день)

**Время:** 6-8 часов

### 6.1 Разбиение LoginPage.tsx на компоненты

После завершения всех функциональных этапов необходимо выполнить рефакторинг согласно плану `@code_splitting.md`:

#### 6.1.1 Создание структуры компонентов (2 часа)

- Создать папку `src/components/auth/`
- Разбить LoginPage.tsx на отдельные step-компоненты
- Создать переиспользуемые UI компоненты в `shared/`

#### 6.1.2 Выделение логики в хуки (2 часа)

- Создать `useAuthFlow.ts` для управления переходами
- Создать `useChildData.ts` для работы с данными детей
- Создать `useFormValidation.ts` для валидации форм

#### 6.1.3 Создание утилит и констант (1 час)

- Вынести валидацию в `utils/validation.ts`
- Создать `utils/formatting.ts` для форматирования
- Создать `utils/constants.ts` для опций и данных

#### 6.1.4 Типизация (1 час)

- Создать `types/auth.types.ts`
- Добавить типы для всех step-компонентов
- Убедиться в строгой типизации

#### 6.1.5 Тестирование после рефакторинга (2 часа)

- Проверить работоспособность всех шагов
- Убедиться что данные передаются корректно
- Протестировать переходы между шагами

**✅ Результат рефакторинга:**

- LoginPage.tsx разбит на 10+ отдельных компонентов
- Код стал более читаемым и поддерживаемым
- Компоненты можно тестировать отдельно
- Команда может работать параллельно над разными частями

---

## 📊 Итоговые результаты

**После завершения всех этапов:**

- ✅ Все моки заменены на реальные API
- ✅ Архитектура готова к масштабированию
- ✅ Типобезопасность на всех уровнях
- ✅ Отличный Developer Experience
- ✅ Производительность оптимизирована
- ✅ UX улучшен состояниями загрузки
- ✅ Код разбит на поддерживаемые компоненты
- ✅ Готовность к продакшену

**Время на весь проект:** 7-8 рабочих дней
**Сложность:** Средняя
**Команда:** 1-2 разработчика
