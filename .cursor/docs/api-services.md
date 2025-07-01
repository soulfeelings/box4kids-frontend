# API клиент и сервисы

## 🔧 Базовый API клиент

### Создание клиента

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

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
```

### Обработка ошибок

```typescript
// src/services/api-error.ts
export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }

  get isNetworkError() {
    return this.status === 0;
  }

  get isServerError() {
    return this.status >= 500;
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }
}
```

## 📝 Типы данных

### Базовые типы

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

export interface Subscription {
  id: string;
  plan_name: "base" | "premium";
  price: number;
  child_id: string;
  expires_at: string;
}
```

### Запросы и ответы

```typescript
// src/types/requests.ts
export interface SendOtpRequest {
  phone_number: string;
}

export interface VerifyOtpRequest {
  phone_number: string;
  code: string;
}

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

export interface SubscriptionCreateRequest {
  plan_name: "base" | "premium";
  child_id: string;
  user_id: number;
}
```

## 🛠️ Сервисы для каждой области

### AuthService

```typescript
// src/services/authService.ts
import { apiClient } from "./api";
import { User, SendOtpRequest, VerifyOtpRequest } from "../types/api";

export class AuthService {
  async sendOtp(phoneNumber: string): Promise<{ message: string }> {
    const request: SendOtpRequest = { phone_number: phoneNumber };
    return apiClient.post<{ message: string }>("/auth/send-otp", request);
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<User> {
    const request: VerifyOtpRequest = {
      phone_number: phoneNumber,
      code: code,
    };
    return apiClient.post<User>("/auth/verify-otp", request);
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>("/auth/me");
  }
}

export const authService = new AuthService();
```

### UserService

```typescript
// src/services/userService.ts
import { apiClient } from "./api";
import { User } from "../types/api";

export class UserService {
  async updateProfile(userId: number, data: { name: string }): Promise<User> {
    return apiClient.put<User>(`/users/${userId}/profile`, data);
  }

  async getUserById(userId: number): Promise<User> {
    return apiClient.get<User>(`/users/${userId}`);
  }

  async deleteUser(userId: number): Promise<void> {
    return apiClient.delete<void>(`/users/${userId}`);
  }
}

export const userService = new UserService();
```

### ChildService

```typescript
// src/services/childService.ts
import { apiClient } from "./api";
import { Child, ChildCreateRequest } from "../types/api";

export class ChildService {
  async createChild(data: ChildCreateRequest): Promise<Child> {
    return apiClient.post<Child>("/users/children", data);
  }

  async getChildren(parentId: number): Promise<Child[]> {
    return apiClient.get<Child[]>(`/users/${parentId}/children`);
  }

  async updateChild(childId: string, data: Partial<Child>): Promise<Child> {
    return apiClient.put<Child>(`/children/${childId}`, data);
  }

  async deleteChild(childId: string): Promise<void> {
    return apiClient.delete<void>(`/children/${childId}`);
  }

  async getChildById(childId: string): Promise<Child> {
    return apiClient.get<Child>(`/children/${childId}`);
  }
}

export const childService = new ChildService();
```

### SubscriptionService

```typescript
// src/services/subscriptionService.ts
import { apiClient } from "./api";
import { Subscription, SubscriptionCreateRequest } from "../types/api";

export class SubscriptionService {
  async createSubscription(
    data: SubscriptionCreateRequest
  ): Promise<Subscription> {
    return apiClient.post<Subscription>("/subscriptions/create", data);
  }

  async getSubscriptions(userId: number): Promise<Subscription[]> {
    return apiClient.get<Subscription[]>(`/subscriptions/user/${userId}`);
  }

  async updateSubscription(
    subscriptionId: string,
    data: { plan_name: "base" | "premium" }
  ): Promise<Subscription> {
    return apiClient.put<Subscription>(
      `/subscriptions/${subscriptionId}`,
      data
    );
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    return apiClient.delete<void>(`/subscriptions/${subscriptionId}`);
  }
}

export const subscriptionService = new SubscriptionService();
```

## 🔌 React Query интеграция

### Хуки для аутентификации

```typescript
// src/hooks/api/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../services/authService";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const sendOtpMutation = useMutation({
    mutationFn: authService.sendOtp,
    onSuccess: () => {
      // Можно добавить уведомление об успехе
    },
    onError: (error) => {
      console.error("Ошибка отправки OTP:", error);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      authService.verifyOtp(phone, code),
    onSuccess: (user) => {
      // Сохраняем пользователя в кэш
      queryClient.setQueryData(["user"], user);
    },
    onError: (error) => {
      console.error("Ошибка верификации OTP:", error);
    },
  });

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: authService.getCurrentUser,
    enabled: false, // Загружаем только при необходимости
  });

  return {
    sendOtp: sendOtpMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    user: userQuery.data,
    isLoading: sendOtpMutation.isPending || verifyOtpMutation.isPending,
    error: sendOtpMutation.error || verifyOtpMutation.error,
  };
};
```

### Хуки для работы с детьми

```typescript
// src/hooks/api/useChildren.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { childService } from "../../services/childService";
import { ChildCreateRequest } from "../../types/api";

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
      queryClient.setQueryData(["children", parentId], (old: any[]) => [
        ...(old || []),
        newChild,
      ]);
    },
  });

  const updateChildMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      childService.updateChild(id, data),
    onSuccess: (updatedChild) => {
      queryClient.setQueryData(
        ["children", parentId],
        (old: any[]) =>
          old?.map((child) =>
            child.id === updatedChild.id ? updatedChild : child
          ) || []
      );
    },
  });

  return {
    children: childrenQuery.data || [],
    isLoading: childrenQuery.isLoading,
    createChild: createChildMutation.mutate,
    updateChild: updateChildMutation.mutate,
    isCreating: createChildMutation.isPending,
    isUpdating: updateChildMutation.isPending,
  };
};
```

## 🌍 Переменные окружения

### Настройка .env файлов

```env
# .env.development
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development

# .env.production
REACT_APP_API_URL=https://api.box4kids.com
REACT_APP_ENV=production

# .env.test
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENV=test
```

### Конфигурация API клиента

```typescript
// src/config/api.ts
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
};

// Можно добавить разные конфиги для разных окружений
export const getApiConfig = () => {
  const env = process.env.REACT_APP_ENV || "development";

  switch (env) {
    case "production":
      return { ...API_CONFIG, timeout: 60000 };
    case "test":
      return { ...API_CONFIG, timeout: 5000 };
    default:
      return API_CONFIG;
  }
};
```

## 🧪 Мокирование для тестов

### Мок сервисов

```typescript
// src/services/__mocks__/authService.ts
export const authService = {
  sendOtp: jest.fn().mockResolvedValue({ message: "Код отправлен" }),
  verifyOtp: jest.fn().mockResolvedValue({
    id: 1,
    phone_number: "+7999999999",
    name: "Test User",
    role: "parent",
  }),
  getCurrentUser: jest.fn().mockResolvedValue({
    id: 1,
    phone_number: "+7999999999",
    name: "Test User",
    role: "parent",
  }),
};
```

### Использование в тестах

```typescript
// src/hooks/api/__tests__/useAuth.test.ts
import { renderHook } from "@testing-library/react";
import { useAuth } from "../useAuth";

jest.mock("../../services/authService");

describe("useAuth", () => {
  it("should send OTP successfully", async () => {
    const { result } = renderHook(() => useAuth());

    await result.current.sendOtp("+7999999999");

    expect(result.current.isLoading).toBe(false);
  });
});
```

## 📊 Логирование и мониторинг

### Interceptor для логирования

```typescript
// src/services/api.ts (дополнение)
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const response = await fetch(url, config);
      const duration = Date.now() - startTime;

      console.log(
        `API ${config.method} ${endpoint} - ${response.status} (${duration}ms)`
      );

      return response.json();
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `API ${config.method} ${endpoint} - ERROR (${duration}ms):`,
        error
      );
      throw error;
    }
  }
}
```
