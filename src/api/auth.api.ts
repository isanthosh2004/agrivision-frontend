import { apiClient } from "./client";
import type { ApiResponse } from "../types/common.types";
import type { AuthResponse } from "../types/auth.types";

export type LoginBody = { email: string; password: string };
export type RegisterBody = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export async function login(body: LoginBody) {
  const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", body);
  return res.data.data;
}

export async function register(body: RegisterBody) {
  const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", body);
  return res.data.data;
}

export async function logout() {
  await apiClient.post("/auth/logout", {});
}
