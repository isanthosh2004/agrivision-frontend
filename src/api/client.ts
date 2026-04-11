import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { AuthResponse } from "../types/auth.types";
import type { ApiResponse } from "../types/common.types";
import { useAuthStore } from "../store/authStore";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081/api";

export const apiClient = axios.create({
  baseURL,
  timeout: 65000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const original = error.config as RetryableRequest | undefined;
    const status = error.response?.status;
    const url = original?.url ?? "";

    if (status === 401 && original && !original._retry && !url.includes("/auth/refresh")) {
      original._retry = true;
      try {
        const refreshRes = await axios.post<ApiResponse<AuthResponse>>(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true, headers: { "Content-Type": "application/json" } },
        );
        const access = refreshRes.data.data.accessToken;
        useAuthStore.getState().updateToken(access);
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${access}`;
        return apiClient(original);
      } catch {
        useAuthStore.getState().logout();
        window.location.assign("/login");
      }
    }

    const data = error.response?.data as { error?: { message?: string } } | undefined;
    const message = data?.error?.message;

    return Promise.reject(new Error(message || error.message || "Request failed"));
  },
);
