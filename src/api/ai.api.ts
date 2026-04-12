import { apiClient } from "./client";
import type { ApiResponse } from "../types/common.types";
import type { FarmParams } from "../types/farm.types";
import type { ForecastRequest, ForecastResult, RiskResult, XaiRequest, XaiResult } from "../types/ai.types";

export async function analyzeRisk(farmId: string, params: FarmParams) {
  const res = await apiClient.post<ApiResponse<RiskResult>>(`/risk/analyze?farmId=${farmId}`, params);
  return res.data;
}

export async function explainXai(farmId: string, body: XaiRequest) {
  const res = await apiClient.post<ApiResponse<XaiResult>>(`/xai/explain?farmId=${farmId}`, body);
  return res.data;
}

export async function generateForecast(farmId: string, body: ForecastRequest) {
  const res = await apiClient.post<ApiResponse<ForecastResult>>(`/forecast/generate?farmId=${farmId}`, body);
  return res.data;
}
