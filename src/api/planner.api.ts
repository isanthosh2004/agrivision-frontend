import { apiClient } from "./client";
import type { ApiResponse } from "../types/common.types";
import type { FarmParams } from "../types/farm.types";

export async function analyzePlanner(farmId: string, params: FarmParams) {
  const res = await apiClient.post<ApiResponse<unknown>>(`/planner/analyze?farmId=${farmId}`, params);
  return res.data;
}
