## Архитектура Web-приложения (React)

Папка `web` содержит фронтенд-приложение, разработанное с использованием React. Структура папок организована для обеспечения модульности и удобства поддержки.

- **`public/`**: Содержит статические ресурсы, такие как `index.html`, `favicon.ico` и другие общедоступные файлы. Это точка входа для браузера.

- **`src/`**: Основная папка с исходным кодом React-приложения.
  - **`App.tsx`**: Корневой компонент приложения, который обычно содержит основные маршруты и компоновку.
  - **`index.tsx`**: Главный файл, который рендерит корневой компонент `App` в DOM.
  - **`pages/`**: Содержит компоненты, представляющие целые страницы или представления приложения (например, `LoginPage.tsx`).
  - **`components/`**: Содержит переиспользуемые UI-компоненты (например, `Button.tsx`, `Modal.tsx`).
  - **`services/`**: Модули для взаимодействия с API бэкенда, бизнес-логика и управление данными.
  - **`utils/`**: Вспомогательные функции, не привязанные к конкретным компонентам или страницам (например, форматирование даты, валидация).
  - **`assets/`**: Хранилище для изображений, шрифтов, иконок и других медиа-ресурсов.
  - **`styles/`**: Глобальные стили, переменные CSS или файлы конфигурации CSS-фреймворков (например, Tailwind CSS).

Этот подход способствует четкому разделению ответственности и упрощает масштабирование проекта.

# Архитектура системы

## 🏗️ Выбор технологий

### React Query для серверного состояния

**Зачем:** Кэширование, retry, фоновые обновления, оптимистичные обновления

```typescript
// ✅ Отлично подходит для:
- Загрузка пользователей, детей, подписок
- Автоматическое обновление данных
- Обработка ошибок сети
- Состояния загрузки из коробки
```

### Гибридный подход: React Hook Form + Zustand

**React Hook Form для сложных форм:**

- Данные ребенка (имя, возраст, интересы)
- Доставка (адрес, время)
- Оплата (карта, биллинг)

**Zustand для UI состояния:**

- Шаги регистрации (Step.Phone → Step.Code → Step.Welcome)
- Простые поля (телефон, код, имя)
- Навигация между шагами
- **Кеширование данных форм между шагами**

```typescript
// ✅ React Hook Form отлично подходит для:
- Валидация сложных форм
- Производительность (меньше re-renders)
- Готовые интеграции с UI библиотеками

// ✅ Zustand отлично подходит для:
- Сохранение состояния между шагами
- Простые поля и флаги
- Координация многоэтапного процесса
- Кеширование данных форм (draftData)
```

### Сервисы для API логики

**Зачем:** Чистота, тестируемость, переиспользование

```typescript
// ✅ Отлично подходит для:
- Инкапсуляция API вызовов
- Типизация запросов/ответов
- Обработка ошибок в одном месте
```

## 🎯 Разделение ответственности

### Слой 1: Сервисы (API)

```typescript
// src/services/authService.ts
export class AuthService {
  // Только чистые API вызовы
  async sendOtp(phone: string): Promise<{ message: string }> {
    return apiClient.post("/auth/send-otp", { phone_number: phone });
  }
}
```

**Ответственность:**

- ✅ HTTP запросы к бекенду
- ✅ Сериализация/десериализация данных
- ✅ Первичная обработка ошибок API
- ❌ НЕ хранит состояние
- ❌ НЕ содержит бизнес-логику UI

### Слой 2: React Query (Серверное состояние)

```typescript
// src/hooks/api/useAuth.ts
export const useAuth = () => {
  const sendOtpMutation = useMutation({
    mutationFn: authService.sendOtp,
    retry: 3,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });
};
```

**Ответственность:**

- ✅ Кэширование серверных данных
- ✅ Синхронизация с сервером
- ✅ Retry логика
- ✅ Оптимистичные обновления
- ❌ НЕ хранит UI состояние

### Слой 3A: React Hook Form (Сложные формы)

```typescript
// src/components/ChildForm.tsx
export const ChildForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChildFormData>();

  const onSubmit = (data: ChildFormData) => {
    // Данные автоматически валидированы
    submitChildData(data);
  };
};
```

**Ответственность:**

- ✅ Валидация сложных форм
- ✅ Оптимизация производительности
- ✅ Интеграция с UI компонентами
- ❌ НЕ сохраняет состояние между шагами

### Слой 3B: Zustand (UI состояние)

```typescript
// src/store/slices/registrationSlice.ts
export const createRegistrationSlice = (set) => ({
  currentStep: 0,
  phone: "",
  // ✅ Кеш данных форм для сохранения между шагами
  draftData: {
    child: null,
    delivery: null,
    payment: null,
  },
  setStep: (step) => set({ currentStep: step }),
  setPhone: (phone) => set({ phone }),
  saveChildDraft: (data) =>
    set((state) => {
      state.draftData.child = data;
    }),
  getChildDraft: () => get().draftData.child,
});
```

**Ответственность:**

- ✅ Шаги регистрации
- ✅ Простые поля (телефон, код, имя)
- ✅ Координация между формами
- ✅ **Кеширование данных форм между переходами**
- ✅ Валидация состояния шагов
- ✅ Настройки пользователя
- ❌ НЕ хранит серверные данные

### Слой 4: Компоненты (Представление)

```typescript
// src/pages/LoginPage.tsx - простые формы через Zustand
export const LoginPage = () => {
  const { sendOtp, isLoading } = useAuth();
  const { step, phone, setStep } = useRegistration();

  const handleSendCode = async () => {
    await sendOtp(phone);
    setStep(Step.Code);
  };
};

// src/components/ChildForm.tsx - сложные формы через React Hook Form
export const ChildForm = () => {
  const { saveChildDraft, getChildDraft, nextStep } = useRegistration();

  const form = useForm<ChildFormData>({
    // ✅ Восстанавливаем данные при возврате на шаг
    defaultValues: getChildDraft() || {},
  });

  const onSubmit = async (data: ChildFormData) => {
    // ✅ Сохраняем в кеш перед переходом
    saveChildDraft(data);
    await submitChild(data);
    nextStep(); // переход к следующему шагу
  };
};
```

**Ответственность:**

- ✅ Отображение UI
- ✅ Обработка пользовательского ввода
- ✅ Координация между React Hook Form и Zustand
- ✅ Интеграция простых и сложных форм
- ❌ НЕ содержит бизнес-логику

## 📊 Диаграмма взаимодействия

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Компоненты    │    │  React Query    │    │    Сервисы     │
│                 │    │                 │    │                 │
│ LoginPage.tsx   │───▶│ useAuth()       │───▶│ AuthService     │
│ ChildForm.tsx   │    │ useChildren()   │    │ UserService     │
│ DeliveryForm    │    │ useSubscription │    │ ChildService    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         ├──────────────┐                               ▼
         ▼              ▼                   ┌─────────────────┐
┌─────────────────┐ ┌──────────────┐       │   Backend API   │
│    Zustand      │ │React Hook Form│       │                 │
│                 │ │              │       │ POST /auth/send │
│ useRegistration │ │ useForm()    │       │ POST /auth/verify│
│ useAuth         │ │ register()   │       │ PUT /users/...  │
│ useChildren     │ │ handleSubmit │       │ POST /children  │
└─────────────────┘ └──────────────┘       └─────────────────┘
```

## 🔄 Поток данных

### Отправка OTP (пример)

1. **Пользователь** вводит телефон и нажимает "Отправить код"
2. **Компонент** вызывает `sendOtp(phone)` из React Query
3. **React Query** вызывает `authService.sendOtp(phone)`
4. **Сервис** делает HTTP запрос к `POST /auth/send-otp`
5. **При успехе** компонент вызывает `setStep(Step.Code)` в Zustand
6. **UI** обновляется, показывая шаг ввода кода

### Сохранение формы между шагами (новый пример)

1. **Пользователь** заполняет форму ребенка и нажимает "Далее"
2. **React Hook Form** валидирует данные
3. **Компонент** вызывает `saveChildDraft(data)` в Zustand
4. **Zustand** сохраняет данные в `draftData.child`
5. **Компонент** переходит к следующему шагу
6. **При возврате** React Hook Form восстанавливает данные из `getChildDraft()`

### Преимущества такого подхода:

- ✅ **Тестируемость** - каждый слой изолирован
- ✅ **Переиспользование** - сервисы можно использовать везде
- ✅ **Производительность** - React Query кэширует данные
- ✅ **Отказоустойчивость** - retry логика из коробки
- ✅ **Типобезопасность** - TypeScript на всех уровнях

## 🚀 Готовность к масштабированию

### Легко добавить новые функции:

```typescript
// Новый сервис для подписок
export class SubscriptionService {
  async createSubscription(data: SubscriptionData) {
    return apiClient.post("/subscriptions", data);
  }
}

// Новый slice для подписок
export const createSubscriptionSlice = (set) => ({
  selectedPlan: null,
  setPlan: (plan) => set({ selectedPlan: plan }),
});

// Новый хук для подписок
export const useSubscriptions = () => {
  return useMutation({
    mutationFn: subscriptionService.createSubscription,
  });
};
```

### Легко добавить новые страницы:

```typescript
// Новая страница использует те же слои
export const SubscriptionPage = () => {
  const { createSubscription } = useSubscriptions();
  const { selectedPlan } = useSubscriptionStore();

  // Та же архитектура, новая функциональность
};
```

## 💡 Принципы принятия решений

1. **Серверные данные** → React Query
2. **UI состояние** → Zustand
3. **API логика** → Сервисы
4. **Сложные формы** → React Hook Form + Zustand
5. **Маршрутизация** → React Router (если понадобится)
