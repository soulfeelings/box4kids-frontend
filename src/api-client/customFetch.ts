import { clearPersistedStore } from "../store/store";
import { refreshTokenClient } from "./refreshClient";
import { notifications } from "../utils/notifications";
import i18n from "../i18n";

export interface CustomFetchParams {
  url: string;
  method: string;
  data?: any;
  params?: Record<string, any>;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

// Флаг для предотвращения бесконечного цикла рефреша
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshToken = async (): Promise<string | null> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshTokenValue = localStorage.getItem("refresh_token");
      if (!refreshTokenValue) {
        return null;
      }

      // Используем типизированный refreshClient вместо ручного fetch
      const response = await refreshTokenClient({
        refresh_token: refreshTokenValue,
      });

      const newAccessToken = response.access_token;
      const newRefreshToken = response.refresh_token;

      // Сохраняем новые токены
      localStorage.setItem("access_token", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("refresh_token", newRefreshToken);
      }

      console.log("[customFetch] ✅ Токены успешно обновлены");
      return newAccessToken;
    } catch (error) {
      console.error("[customFetch] Ошибка при обновлении токенов:", error);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const customFetch = async <T>({
  url,
  method,
  data,
  params,
  headers,
  signal,
}: CustomFetchParams): Promise<T> => {
  const baseUrl = import.meta.env.VITE_API_URL;

  if (!baseUrl) {
    throw new Error("VITE_API_URL is not set");
  }

  // 🧩 Собираем query string
  const queryString = params
    ? "?" +
      Object.entries(params)
        .flatMap(([key, value]) => {
          if (Array.isArray(value)) {
            // Для массивов создаем отдельный параметр для каждого элемента
            return value.map(
              (item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`
            );
          } else {
            // Для обычных значений создаем один параметр
            return [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`];
          }
        })
        .join("&")
    : "";

  const fullUrl = `${baseUrl}${url}${queryString}`;

  const makeRequest = async (token: string | null = null): Promise<T> => {
    // Для админских запросов используем админский токен, иначе обычный
    let authToken = token;
    if (!authToken) {
      if (url.includes("/admin/")) {
        authToken = localStorage.getItem("admin_token");
      } else {
        authToken = localStorage.getItem("access_token");
      }
    }

    const requestInit: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(headers || {}),
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        "Accept-Language": i18n.language.split("-")[0],
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
      signal,
    };

    // 🌐 dev-лог
    if (import.meta.env.DEV) {
      console.debug("[customFetch] →", method, fullUrl, requestInit);
    }

    let response: Response;
    try {
      response = await fetch(fullUrl, requestInit);
    } catch (err) {
      if (err instanceof Error && err.message.includes("signal is aborted")) {
        console.error("[customFetch] AbortError");
        return undefined as T;
      }

      console.error("[customFetch] Network error:", err);
      notifications.networkError();
      throw new Error("Network error");
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Для админских запросов просто возвращаем ошибку без попытки обновления
        if (url.includes("/admin/")) {
          console.warn("[customFetch] Админский токен недействителен");
          throw new Error("Недействительный админский токен");
        }

        // 🔄 Пытаемся обновить токен только если это не запрос на рефреш
        if (!url.includes("/auth/refresh")) {
          console.warn(
            "[customFetch] Unauthorized (401), пытаемся обновить токен"
          );

          const newToken = await refreshToken();
          if (newToken) {
            // Повторяем запрос с новым токеном
            console.log("[customFetch] Повторяем запрос с новым токеном");
            return makeRequest(newToken);
          }
        }

        // Если не удалось обновить токен или это запрос на рефреш - очищаем данные
        console.warn("[customFetch] Не удалось обновить токен, выходим");
        localStorage.clear();
        clearPersistedStore();
        window.location.href = "/";
        return undefined as T;
      }

      // 🔍 Обработка 404 - пользователь не найден (удален из БД или JWT устарел)
      if (response.status === 404 && url.includes("/users/profile")) {
        console.warn(
          "[customFetch] Пользователь не найден (404), делаем logout"
        );
        localStorage.clear();
        clearPersistedStore();
        window.location.href = "/";
        return undefined as T;
      }

      let errorMessage = `API error ${response.status}`;
      try {
        const errorJson = await response.json();
        errorMessage =
          errorJson?.message ||
          errorJson?.detail ||
          errorJson?.error ||
          errorMessage;
      } catch {}

      console.error("[customFetch] ❌", response.status, errorMessage);
      throw new Error(errorMessage);
    }

    // ⛔ 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    const json = await response.json();

    if (import.meta.env.DEV) {
      console.debug("[customFetch] ✅", json);
    }

    return json as T;
  };

  return makeRequest();
};
