# План внедрения React Router в Box4Kids Web App

## Текущее состояние

### Проблемы

- Навигация через `useState` в App.tsx
- LoginPage использует Step enum с 10 шагами через state
- Отсутствует react-router-dom в зависимостях
- Страницы Profile, Support, DeliveryHistory используют prop-based навигацию
- Нет централизованного управления состоянием пользователя

### Существующие страницы

```
App.tsx (demo/login/kids через state)
├── DemoPage (встроена в App.tsx)
├── LoginPage (10 шагов через Step enum)
├── KidsAppInterface
├── ProfilePage
├── SupportPage
└── DeliveryHistoryPage
```

## Целевая структура маршрутов

```
/                        - Главная страница приложения (если авторизован)
/demo                   - Демонстрация состояний приложения
/auth/phone             - Ввод телефона
/auth/code              - Ввод кода
/auth/welcome           - Приветствие
/auth/register          - Регистрация
/auth/child             - Данные ребенка
/auth/categories        - Выбор категорий
/auth/subscription      - Выбор подписки
/auth/delivery          - Данные доставки
/auth/payment           - Оплата
/auth/success           - Успешная регистрация
/app                    - Главная страница приложения (KidsAppInterface)
/app/profile            - Профиль пользователя
/app/delivery-history   - История доставок
/app/support            - Поддержка
```

## Этапы внедрения

### Этап 1: Базовая настройка (1-2 часа)

**1.1 Установка зависимостей** ✅ ВЫПОЛНЕНО

```bash
npm install react-router-dom
npm install --save-dev @types/react-router-dom
```

**1.2 Настройка основного роутинга** ✅ ВЫПОЛНЕНО

- Обернуть App в BrowserRouter
- Создать основные маршруты
- Настроить редирект с / на /demo
- Добавить маршрут /demo для демонстрации
- Настроить fallback на /auth/phone для неавторизованных

### Этап 2: Создание контекста (1 час) ✅ ВЫПОЛНЕНО

**2.1 AuthContext** ✅

```typescript
// src/context/AuthContext.tsx
interface AuthContextType {
  user: UserData | null;
  userId: number | null;
  setUser: (user: UserData, userId: number) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
```

**2.2 AppProvider** ✅

- Обернуть приложение в контекст
- Управление состоянием пользователя
- Защита маршрутов через isAuthenticated

### Этап 3: Разделение LoginPage на компоненты (3-4 часа)

**3.1 Создание отдельных компонентов для каждого шага**

```
src/components/auth/
├── PhoneStep.tsx          - Step.Phone
├── CodeStep.tsx           - Step.Code
├── WelcomeStep.tsx        - Step.Welcome
├── RegisterStep.tsx       - Step.Register
├── ChildStep.tsx          - Step.Child
├── CategoriesStep.tsx     - Step.Categories
├── SubscriptionStep.tsx   - Step.Subscription
├── DeliveryStep.tsx       - Step.Delivery
├── PaymentStep.tsx        - Step.Payment
└── SuccessStep.tsx        - Step.Success
```

**3.2 Создание общего AuthLayout**

```typescript
// src/components/layout/AuthLayout.tsx
- Общий стиль для всех шагов авторизации
- Прогресс-бар (опционально)
- Общие элементы UI
```

**3.3 Вынос общей логики**

```typescript
// src/hooks/useAuth.ts
- API вызовы
- Валидация
- Переход между шагами
```

### Этап 4: Обновление маршрутизации (2-3 часа)

**4.1 Создание базовых маршрутов**

```typescript
// src/components/common/RouteGuard.tsx
- Простая проверка наличия userId в store
- Редирект на /auth/phone если нет userId
```

**4.2 Настройка вложенных маршрутов**

```typescript
// App.tsx
<Routes>
  <Route path="/" element={<Navigate to="/app" replace />} />
  <Route path="/demo" element={<DemoPage />} />
  <Route path="/auth" element={<AuthLayout />}>
    <Route path="phone" element={<PhoneStep />} />
    <Route path="code" element={<CodeStep />} />
    <Route path="welcome" element={<WelcomeStep />} />
    <Route path="register" element={<RegisterStep />} />
    <Route path="child" element={<ChildStep />} />
    <Route path="categories" element={<CategoriesStep />} />
    <Route path="subscription" element={<SubscriptionStep />} />
    <Route path="delivery" element={<DeliveryStep />} />
    <Route path="payment" element={<PaymentStep />} />
    <Route path="success" element={<SuccessStep />} />
  </Route>
  <Route
    path="/app"
    element={
      <RouteGuard>
        <AppLayout />
      </RouteGuard>
    }
  >
    <Route index element={<KidsAppInterface />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="delivery-history" element={<DeliveryHistoryPage />} />
    <Route path="support" element={<SupportPage />} />
  </Route>
</Routes>
```

### Этап 5: Создание Layout компонентов (1-2 часа)

**5.1 AppLayout**

```typescript
// src/components/layout/AppLayout.tsx
- Общий layout для авторизованных пользователей
- BottomNavigation
- Outlet для вложенных маршрутов
```

**5.2 DemoPage**

```typescript
// src/pages/DemoPage.tsx
- Вынести демо-логику из App.tsx
- Использовать useNavigate для перехода
```

### Этап 6: Обновление существующих страниц (2-3 часа)

**6.1 ProfilePage**

- Убрать prop-based навигацию
- Использовать useNavigate для переходов
- Обновить кнопки "Назад"

**6.2 SupportPage и DeliveryHistoryPage**

- Убрать onClose props
- Использовать useNavigate(-1) для возврата
- Обновить навигацию

**6.3 KidsAppInterface**

- Получать userData из контекста
- Обновить навигацию на профиль

### Этап 7: Управление состоянием шагов (1-2 часа)

**7.1 Состояние регистрации**

```typescript
// src/context/RegistrationContext.tsx
- Сохранение прогресса между шагами
- Данные форм
- Validation state
```

**7.2 Навигация между шагами**

- Использовать useNavigate вместо setStep
- Сохранение прогресса в localStorage
- Восстановление состояния при перезагрузке

### Этап 8: Создание централизованного store (2-3 часа)

**8.1 Установка state management**

```bash
npm install zustand
# или
npm install @reduxjs/toolkit react-redux
```

**8.2 Создание store для регистрации**

```typescript
// src/store/registrationStore.ts
interface RegistrationState {
  currentStep: string;
  phoneData: { phone: string; code: string; verified: boolean };
  welcomeData: { firstName: string; lastName: string };
  registerData: { email: string; terms: boolean };
  childData: {
    name: string;
    birthDate: string;
    gender: string;
    limitations: string;
    comment: string;
  };
  categoriesData: { interests: string[]; skills: string[] };
  subscriptionData: { plan: string; subscriptionId: number };
  deliveryData: { address: string; date: string; time: string };
  paymentData: { paymentId: number; status: string };

  // Actions
  setCurrentStep: (step: string) => void;
  setPhoneData: (data: Partial<PhoneData>) => void;
  setWelcomeData: (data: Partial<WelcomeData>) => void;
  // ... остальные setters
  resetRegistration: () => void;
  restoreFromStorage: () => void;
}
```

**8.3 Создание store для приложения**

```typescript
// src/store/appStore.ts
interface AppState {
  user: UserData | null;
  userId: number | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: UserData, userId: number) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserData>) => void;
}
```

**8.4 Интеграция с API**

```typescript
// Отправка данных на бекенд только при финальных действиях
const useRegistrationActions = () => {
  const store = useRegistrationStore();

  const createChild = async () => {
    const { childData } = store.getState();
    try {
      const response = await api.createChild(childData);
      store.setChildId(response.id);
    } catch (error) {
      store.setError(error);
    }
  };

  const createSubscription = async () => {
    // Финальная отправка данных подписки
  };
};
```

**8.5 Интеграция с компонентами**

- Заменить useState на store во всех компонентах
- Отправка API запросов только при необходимости
- Простая навигация между шагами через store
- Валидация данных на каждом шаге

### Этап 9: Тестирование и финализация (1-2 часа)

**9.1 Тестирование устойчивости**

- Обновление страницы на каждом шаге
- Переход назад/вперед в браузере
- Проверка восстановления данных

**9.2 Финальная проверка**

- Все маршруты работают корректно
- Состояние сохраняется и восстанавливается
- Нет потери данных при навигации

## Структура файлов после миграции

```
src/
├── components/
│   ├── auth/
│   │   ├── PhoneStep.tsx
│   │   ├── CodeStep.tsx
│   │   └── ... (остальные шаги)
│   ├── layout/
│   │   ├── AuthLayout.tsx
│   │   ├── AppLayout.tsx
│   │   └── BottomNavigation.tsx
│   └── common/
│       └── RouteGuard.tsx
├── context/
│   ├── AuthContext.tsx
│   └── RegistrationContext.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useRegistration.ts
├── pages/
│   ├── DemoPage.tsx
│   ├── KidsAppInterface.tsx
│   ├── ProfilePage.tsx
│   ├── SupportPage.tsx
│   └── DeliveryHistoryPage.tsx
├── store/
│   ├── registrationStore.ts
│   ├── appStore.ts
│   └── index.ts
└── types/
    └── auth.ts
```

## Преимущества после миграции

1. **Улучшенная навигация**

   - Корректная работа кнопок браузера
   - Закладки и deep linking
   - История переходов

2. **Лучшая архитектура**

   - Разделение ответственности
   - Переиспользуемые компоненты
   - Centralized state management

3. **Улучшенный UX**

   - Сохранение прогресса при обновлении
   - Быстрая навигация
   - Предсказуемое поведение

4. **Простота поддержки**
   - Понятная структура маршрутов
   - Легкое добавление новых страниц
   - Консистентная навигация

## Риски и митигация

### Риски

1. **Потеря текущего состояния** - данные форм могут потеряться при навигации
2. **Сложность тестирования** - больше компонентов для проверки
3. **Breaking changes** - изменение API между компонентами
4. **Производительность** - дополнительные re-renders при изменении состояния

### Митигация

1. **Централизованный store (Zustand/Redux)**

   - Сохранение состояния только в памяти
   - Отправка данных на бекенд только при необходимости
   - Простая навигация между шагами
   - Валидация данных на каждом шаге

2. **Простое управление состоянием**

   - Сохранение состояния в памяти до завершения регистрации
   - Предупреждение пользователя при попытке закрыть вкладку (опционально)
   - Валидация данных на каждом шаге
   - Простой рестарт процесса при перезагрузке

3. **Пошаговая миграция**

   - Постепенное внедрение по этапам
   - Сохранение работоспособности на каждом этапе
   - Откат к предыдущей версии при критических ошибках

4. **Тщательное тестирование**
   - Проверка каждого этапа навигации
   - Тестирование восстановления после перезагрузки
   - Проверка работы кнопок браузера
   - Тестирование на различных сценариях использования

## Временные затраты

- **Общее время**: 16-22 часа
- **Критический путь**: Этапы 1-4 (основная функциональность)
- **Защита от потери данных**: Этапы 5-8 (включая store)
- **Финализация**: Этап 9 (тестирование)

## Порядок выполнения

1. **Этапы 1-2** (базовая настройка) - обязательно
2. **Этапы 3-4** (разделение LoginPage и маршруты) - критически важно
3. **Этапы 5-7** (layout и существующие страницы) - для полной функциональности
4. **Этап 8** (store) - **КРИТИЧЕСКИ ВАЖНО** для защиты от потери данных
5. **Этап 9** (тестирование) - финализация

## Готовность к началу работы

Можно начинать с этапа 1 - установки зависимостей и базовой настройки роутинга.

## ⚠️ ВАЖНО: Упрощенное управление состоянием

**Этап 8 (store) является важным** для корректной работы навигации. Рекомендуется:

1. Внедрить базовый store уже на этапе 3-4 (параллельно с разделением LoginPage)
2. Использовать простое решение типа Zustand для быстрого внедрения
3. Сразу настроить управление состоянием между шагами
4. Тестировать навигацию и валидацию на каждом шаге

**Принцип работы:**

- При перезагрузке все состояние сбрасывается
- Пользователь начинает регистрацию заново
- Это естественный UX для процесса регистрации
- Никаких сложных механизмов синхронизации

**Упрощенный подход:**

```typescript
// Простой store для управления состоянием регистрации
const useRegistrationStore = create((set, get) => ({
  currentStep: "phone",
  phoneData: { phone: "", code: "", verified: false },
  welcomeData: { firstName: "", lastName: "" },
  registerData: { email: "", terms: false },
  // ... остальные шаги
  userId: null, // Устанавливается после успешной регистрации

  setCurrentStep: (step) => set({ currentStep: step }),
  setPhoneData: (data) =>
    set((state) => ({
      phoneData: { ...state.phoneData, ...data },
    })),
  setUserId: (id) => set({ userId: id }),

  resetRegistration: () =>
    set({
      currentStep: "phone",
      phoneData: { phone: "", code: "", verified: false },
      userId: null,
      // ... reset всех полей
    }),
}));

// Простой RouteGuard для проверки завершения регистрации
const RouteGuard = ({ children }) => {
  const { userId } = useRegistrationStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/auth/phone");
    }
  }, [userId, navigate]);

  return userId ? children : null;
};
```

## Стратегия управления состоянием

### При перезагрузке страницы:

1. Сброс всего состояния store
2. Редирект на /auth/phone (начать регистрацию заново)
3. Все данные теряются - пользователь заполняет форму заново

### При навигации между шагами:

1. Валидировать данные текущего шага
2. Отправить данные на бекенд (где это необходимо)
3. При успехе - сохранить в store и перейти на следующий шаг
4. При ошибке - показать ошибку, остаться на текущем шаге

### Преимущества упрощенного подхода:

- Максимально простая архитектура
- Работает с существующим API без изменений
- Данные сохраняются в памяти до завершения регистрации
- Минимальная сложность в обработке ошибок
- Быстрая навигация между шагами
- При перезагрузке - просто начинаем заново (естественный UX для регистрации)
- Нет проблем с синхронизацией состояний
- Легко тестировать и отлаживать
