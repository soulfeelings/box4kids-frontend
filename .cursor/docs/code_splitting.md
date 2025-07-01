# План рефакторинга LoginPage.tsx

## Структура файлов

```
src/components/auth/
├── AuthContainer.tsx          # Главный контейнер + роутинг
├── steps/
│   ├── PhoneStep.tsx
│   ├── CodeStep.tsx
│   ├── WelcomeStep.tsx
│   ├── RegisterStep.tsx
│   ├── ChildStep.tsx
│   ├── CategoriesStep.tsx
│   ├── SubscriptionStep.tsx
│   ├── DeliveryStep.tsx
│   ├── PaymentStep.tsx
│   └── SuccessStep.tsx
├── shared/
│   ├── StepHeader.tsx         # Общий header
│   ├── Tag.tsx               # Компонент тега
│   ├── ChildCard.tsx         # Карточка ребенка
│   └── SubscriptionCard.tsx  # Карточка подписки
├── hooks/
│   ├── useAuthFlow.ts        # Управление flow
│   ├── useChildData.ts       # Данные детей
│   └── useFormValidation.ts  # Валидация
├── utils/
│   ├── validation.ts         # Функции валидации
│   ├── formatting.ts         # Форматирование дат/телефонов
│   └── constants.ts          # Иконки, опции
└── types/
    └── auth.types.ts         # Типы
```

## Ключевые принципы

- AuthContainer - только роутинг между шагами
- Каждый шаг - отдельный компонент с props
- Логика в хуках
- Валидация и форматирование в utils
- Переиспользуемые UI в shared/
- Строгая типизация

## Результат

- 2000 строк → 10-15 файлов по 100-200 строк
- Тестируемые компоненты
- Переиспользуемость
- Читаемость
- Командная работа без конфликтов
