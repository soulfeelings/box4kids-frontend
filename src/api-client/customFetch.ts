import { clearPersistedStore } from "../store/store";

export interface CustomFetchParams {
  url: string;
  method: string;
  data?: any;
  params?: Record<string, any>;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

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

  // Получаем токен из localStorage
  const token = localStorage.getItem("access_token");

  const requestInit: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
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
      console.warn("[customFetch] Unauthorized (401)");

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
