import { apiClient } from "./client";
import type { ApiResponse } from "../types/common.types";
import type { ReportSummary } from "../types/ai.types";

export async function listReports(page = 0, size = 20) {
  const res = await apiClient.get<ApiResponse<{ content: ReportSummary[] }>>(`/reports?page=${page}&size=${size}`);
  return res.data.data.content;
}

export async function generateReport(analysisId: string) {
  const res = await apiClient.post<ApiResponse<ReportSummary>>("/reports/generate", { analysisId });
  return res.data.data;
}

export async function getReportDownloadUrl(reportId: string) {
  const res = await apiClient.get<ApiResponse<{ downloadUrl: string }>>(`/reports/${reportId}/download`);
  return res.data.data.downloadUrl;
}

export async function openReport(reportId: string) {
  const url = await getReportDownloadUrl(reportId);
  if (!url.startsWith("/api/")) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  const apiPath = url.replace(/^\/api/, "");
  const res = await apiClient.get<Blob>(apiPath, { responseType: "blob" });
  const blobUrl = URL.createObjectURL(res.data);
  window.open(blobUrl, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}
