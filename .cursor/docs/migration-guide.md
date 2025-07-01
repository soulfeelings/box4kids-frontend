# Миграция с моков на реальные API

## 🎯 Обзор миграции

Заменяем три основных мока в `LoginPage.tsx`:

1. `handleSendCode()` - отправка OTP
2. `handleCheckCode()` - проверка OTP
3. `handleRegister()` - регистрация пользователя

## 📋 Подготовка к миграции

### 1. Установка зависимостей

```bash
npm install @tanstack/react-query zustand immer
npm install @tanstack/react-query-devtools --save-dev
```

### 2. Создание структуры папок

```bash
mkdir -p src/{services,store,hooks,types,components}
mkdir -p src/store/slices
mkdir -p src/hooks/{api,store}
```

### 3. Настройка React Query Provider

```typescript
// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 минут
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

## 🔄 Шаг 1: Замена handleSendCode

### До (мок):

```typescript
// LoginPage.tsx - СТАРЫЙ КОД
const handleSendCode = () => {
  setError(null);
  if (phone.length < 7) {
    setError("Введите корректный номер телефона");
    return;
  }
  // Mock: odd last digit = new user
  setIsNewUser(Number(phone[phone.length - 1]) % 2 === 1);
  setStep(Step.Code);
};
```

### После (API):

```typescript
// LoginPage.tsx - НОВЫЙ КОД
import { useAuth } from "../hooks/api/useAuth";
import { useRegistration } from "../hooks/store/useRegistration";

export const LoginPage: React.FC = () => {
  const { sendOtp, isLoading, error } = useAuth();
  const { actions } = useRegistration();

  const handleSendCode = async () => {
    if (phone.length < 7) {
      setError("Введите корректный номер телефона");
      return;
    }

    try {
      await sendOtp(phone);
      actions.setStep(Step.Code);
    } catch (error) {
      setError(error.message || "Ошибка отправки кода");
    }
  };

  // Отображение состояния загрузки
  const isButtonDisabled = isLoading || phone.length < 7;
```

### Создание хука useAuth:

```typescript
// src/hooks/api/useAuth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../services/authService";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const sendOtpMutation = useMutation({
    mutationFn: authService.sendOtp,
    onError: (error) => {
      console.error("Ошибка отправки OTP:", error);
    },
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

## 🔄 Шаг 2: Замена handleCheckCode

### До (мок):

```typescript
// СТАРЫЙ КОД
const handleCheckCode = () => {
  setError(null);
  if (code.length !== 4) {
    setError("Введите 4-значный код");
    return;
  }
  if (code !== "1234") {
    setError("Неверный код");
    return;
  }
  if (isNewUser) {
    setWelcomeIndex(0);
    setStep(Step.Welcome);
  } else {
    setStep(Step.Success);
  }
};
```

### После (API):

```typescript
// НОВЫЙ КОД
import { useAuth } from "../hooks/api/useAuth";
import { useRegistration } from "../hooks/store/useRegistration";

const { verifyOtp, isLoading, error } = useAuth();
const { data, actions } = useRegistration();
const { setUser } = useAppStore();

const handleCheckCode = async () => {
  if (code.length !== 4) {
    setError("Введите 4-значный код");
    return;
  }

  try {
    const user = await verifyOtp({ phone: data.phone, code });
    setUser(user);

    if (!user.name) {
      // Новый пользователь - перейти к регистрации
      actions.setIsNewUser(true);
      setWelcomeIndex(0);
      actions.setStep(Step.Welcome);
    } else {
      // Существующий пользователь - перейти к успеху
      actions.setStep(Step.Success);
    }
  } catch (error) {
    setError(error.message || "Неверный код");
  }
};
```

### Обновление store для отслеживания пользователя:

```typescript
// src/store/slices/authSlice.ts
export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (
  set
) => ({
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
});
```

## 🔄 Шаг 3: Замена handleRegister

### До (мок):

```typescript
// СТАРЫЙ КОД
const handleRegister = () => {
  setError(null);
  if (!name.trim()) {
    setError("Введите имя");
    return;
  }
  setStep(Step.Child);
};
```

### После (API):

```typescript
// НОВЫЙ КОD
import { useUserProfile } from "../hooks/api/useUserProfile";

const { updateProfile, isUpdating } = useUserProfile();
const { user } = useAuth();
const { data, actions } = useRegistration();

const handleRegister = async () => {
  if (!data.name.trim()) {
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
      data: { name: data.name.trim() },
    });

    setUser(updatedUser);
    actions.setStep(Step.Child);
  } catch (error) {
    setError(error.message || "Ошибка регистрации");
  }
};
```

### Создание хука useUserProfile:

```typescript
// src/hooks/api/useUserProfile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";

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

## ⚙️ Обновление UI компонентов

### Состояния загрузки в кнопках:

```typescript
// Компонент кнопки с загрузкой
const LoadingButton: React.FC<{
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

// Использование в LoginPage
<LoadingButton
  onClick={handleSendCode}
  isLoading={isLoading}
  disabled={phone.length < 7}
>
  Отправить код
</LoadingButton>;
```

### Отображение ошибок:

```typescript
// Компонент для ошибок
const ErrorMessage: React.FC<{ error: string | null }> = ({ error }) => {
  if (!error) return null;

  return <div className="error-message">{error}</div>;
};

// Использование в LoginPage
<ErrorMessage error={error?.message || null} />;
```

## 🔄 Миграция состояния формы

### Интеграция Zustand store с формами:

```typescript
// LoginPage.tsx - обновленное состояние
export const LoginPage: React.FC = () => {
  const { currentStep, data, actions } = useRegistration();
  const { sendOtp, verifyOtp, isLoading, error } = useAuth();

  // Убираем локальные useState, используем store
  const { phone, code, name } = data;
  const { setPhone, setCode, setName, setStep } = actions;

  // Handlers теперь работают со store
  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  // Остальные обработчики остаются те же...
};
```

## 🧪 Добавление обработки ошибок

### Типизированные ошибки:

```typescript
// src/types/errors.ts
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export const isApiError = (error: any): error is ApiError => {
  return (
    error &&
    typeof error.message === "string" &&
    typeof error.status === "number"
  );
};
```

### Обработчик ошибок в компоненте:

```typescript
// Утилита для обработки ошибок
const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
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

// Использование в обработчиках
const handleSendCode = async () => {
  try {
    await sendOtp(phone);
    setStep(Step.Code);
  } catch (error) {
    setError(getErrorMessage(error));
  }
};
```

## 📱 Добавление автоматической отправки кода

### Автоматическая верификация при вводе 4-значного кода:

```typescript
// Автоматический вызов при заполнении кода
useEffect(() => {
  if (code.length === 4) {
    handleCheckCode();
  }
}, [code]);

// Но убираем хардкод проверки
const handleCheckCode = async () => {
  if (code.length !== 4) return;

  try {
    const user = await verifyOtp({ phone, code });
    // ... остальная логика
  } catch (error) {
    setError(getErrorMessage(error));
    // Очищаем код при ошибке
    setCode("");
  }
};
```

## 🔄 Обновление переходов между шагами

### Использование store для навигации:

```typescript
// Замена прямых setStep на actions из store
const { currentStep, actions } = useRegistration();

// Вместо setStep(Step.Code)
actions.setStep(RegistrationStep.Code);

// Добавляем валидацию перед переходами
const canProceedToNextStep = () => {
  switch (currentStep) {
    case RegistrationStep.Phone:
      return phone.length >= 7;
    case RegistrationStep.Code:
      return code.length === 4;
    case RegistrationStep.Register:
      return name.trim().length > 0;
    default:
      return true;
  }
};
```

## ✅ Проверка миграции

### Чек-лист после миграции:

- [ ] ✅ Отправка OTP работает с реальным API
- [ ] ✅ Проверка OTP работает с реальным API
- [ ] ✅ Регистрация пользователя работает с реальным API
- [ ] ✅ Состояния загрузки отображаются корректно
- [ ] ✅ Ошибки обрабатываются и отображаются
- [ ] ✅ Store синхронизирован с API данными
- [ ] ✅ Переходы между шагами работают
- [ ] ✅ Автоматическая верификация кода работает
- [ ] ✅ DevTools показывают корректные запросы

### Тестирование сценариев:

```typescript
// 1. Успешная регистрация нового пользователя
// Phone → Code → Welcome → Register → Child

// 2. Вход существующего пользователя
// Phone → Code → Success

// 3. Обработка ошибок
// - Неверный телефон
// - Неверный код
// - Ошибки сети
// - Ошибки сервера
```

## 🚀 Следующие шаги

После успешной миграции основных моков:

1. **Расширить API** - добавить эндпоинты для детей, подписок
2. **Добавить персистентность** - сохранение состояния в localStorage
3. **Улучшить UX** - добавить анимации, переходы
4. **Добавить аналитику** - отслеживание действий пользователей
5. **Оптимизировать производительность** - мемоизация, lazy loading
