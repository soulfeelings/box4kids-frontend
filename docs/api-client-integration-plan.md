# План интеграции API клиента с React Query

## Статус: В процессе

### Что имеем:

- ✅ Сгенерированный API клиента (`/api-client/`)
- ✅ React Query уже установлен
- ✅ Хуки и типы сгенерированы (orval)

### Шаги интеграции:

1. **Настройка React Query Provider**

   - ✅ Обернуть App в QueryClient
   - ✅ Настроить базовые опции

2. **Рефакторинг Store**

   - ✅ Заменить `childData` на `children: ChildData[]`
   - ✅ Добавить `id` в `ChildData`
   - ✅ Добавить методы `addChild`, `updateChild`, `getCurrentChild`
   - ✅ Сохранить обратную совместимость

3. **Замена старых хуков**

   - ✅ PhoneStep → `useSendOtpAuthSendOtpPost`, `useDevGetCodeAuthDevGetCodePost`
   - ⚠️ CodeStep → `useVerifyOtpAuthVerifyOtpPost` (есть ошибки типов)
   - ✅ CategoriesStep → `useGetAllInterestsInterestsGet`, `useGetAllSkillsSkillsGet`, `useUpdateChildChildrenChildIdPut`
   - ✅ Восстановлен `useAuthApi` (для обратной совместимости)

4. **Обновление компонентов**

   - ✅ PhoneStep обновлен
   - ⚠️ CodeStep частично обновлен (нужно исправить типы)
   - ✅ CategoriesStep обновлен с новой архитектурой store
   - ❌ ChildStep (нужно добавить создание ребенка с ID)
   - ❌ SubscriptionStep, DeliveryStep, PaymentStep
   - ❌ KidsAppInterface (много ошибок типов)
   - ❌ AuthContext → интеграция с новыми хуками

5. **Удаление старого кода**
   - ❌ Дублирующиеся типы

### Следующие шаги:

- Обновить ChildStep для создания ребенка с ID через API
- Исправить типы в CodeStep
- Обновить остальные компоненты авторизации
- Разобраться с конфликтом типов UserProfileResponse
