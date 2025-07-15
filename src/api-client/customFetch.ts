import { clearPersistedStore } from "../store/store";
import { refreshTokenClient } from "./refreshClient";

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
  const baseUrl = process.env.REACT_APP_API_URL;

  if (!baseUrl) {
    throw new Error("REACT_APP_API_URL is not set");
  }

  // 🧩 Собираем query string
  const queryString = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";

  const fullUrl = `${baseUrl}${url}${queryString}`;

  const makeRequest = async (token: string | null = null): Promise<T> => {
    // Используем переданный токен или берем из localStorage
    const authToken = token || localStorage.getItem("access_token");

    const requestInit: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(headers || {}),
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
      signal,
    };

    // 🌐 dev-лог
    if (process.env.NODE_ENV === "development") {
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
      throw new Error("Network error");
    }

    if (!response.ok) {
      if (response.status === 401) {
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

    if (process.env.NODE_ENV === "development") {
      console.debug("[customFetch] ✅", json);
    }

    return json as T;
  };

  return makeRequest();
};
