import { apiClient } from "./client";
import type { ApiResponse } from "../types/common.types";

export type FarmResponse = {
  id: string;
  name: string;
  region: string;
  soilType: string;
  areaAcres: number;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  active?: boolean;
};

export async function listFarms(page = 0, size = 50) {
  const res = await apiClient.get<ApiResponse<{ content: FarmResponse[] }>>(`/farms?page=${page}&size=${size}`);
  return res.data.data.content;
}
