import type { RefreshTokenRequest, TokenResponse } from "./model";

/**
 * Отдельный клиент для рефреша токенов, чтобы избежать циклической зависимости
 * Использует нативный fetch вместо customFetch
 */
export const refreshTokenClient = async (
  refreshTokenRequest: RefreshTokenRequest,
  signal?: AbortSignal
): Promise<TokenResponse> => {
  const baseUrl = import.meta.env.VITE_API_URL;

  if (!baseUrl) {
    throw new Error("VITE_API_URL is not set");
  }

  const response = await fetch(`${baseUrl}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(refreshTokenRequest),
    signal,
  });

  if (!response.ok) {
    let errorMessage = `API error ${response.status}`;
    try {
      const errorJson = await response.json();
      errorMessage =
        errorJson?.message ||
        errorJson?.detail ||
        errorJson?.error ||
        errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json() as Promise<TokenResponse>;
};
