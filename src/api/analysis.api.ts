import { apiClient } from "./client";
import type { ApiResponse } from "../types/common.types";
import type { AnalysisSummary } from "../types/ai.types";

export async function listAnalyses(farmId: string, page = 0, size = 20) {
  const res = await apiClient.get<ApiResponse<{ content: AnalysisSummary[] }>>(
    `/analyses?farmId=${farmId}&page=${page}&size=${size}`,
  );
  return res.data.data.content;
}
