import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listAnalyses } from "../api/analysis.api";
import { generateReport, listReports, openReport } from "../api/report.api";
import { useFarmStore } from "../store/farmStore";

export function ReportsPage() {
  const queryClient = useQueryClient();
  const farmId = useFarmStore((s) => s.selectedFarmId);
  const {
    data: analyses = [],
    isLoading: analysesLoading,
    error: analysesError,
  } = useQuery({
    queryKey: ["analyses", farmId],
    queryFn: () => listAnalyses(farmId as string),
    enabled: !!farmId,
  });
  const { data: reports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => listReports(),
  });

  const generateMutation = useMutation({
    mutationFn: (analysisId: string) => generateReport(analysisId),
    onSuccess: () => {
      toast.success("Report generated");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Report generation failed"),
  });

  const downloadMutation = useMutation({
    mutationFn: (reportId: string) => openReport(reportId),
    onSuccess: () => toast.success("Report opened"),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Download link failed"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-white/70">Generate PDF reports from completed analyses.</p>
      </div>

      {!farmId && <p className="rounded-md border border-agri-border p-4 text-sm text-white/70">Select a farm on the dashboard first.</p>}
      {analysesError && <p className="text-sm text-agri-red">{(analysesError as Error).message}</p>}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Completed Analyses</h2>
        {analysesLoading && <p className="text-sm text-white/60">Loading analyses...</p>}
        {farmId && analyses.length === 0 && !analysesLoading && (
          <p className="rounded-md border border-agri-border p-4 text-sm text-white/70">
            Run Crop Planner, Risk, XAI, or Forecast first. Reports are generated from saved analysis results.
          </p>
        )}
        <div className="grid gap-3">
          {analyses.map((analysis) => (
            <div key={analysis.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-agri-border bg-agri-card p-4">
              <div>
                <div className="font-medium">{analysis.analysisType.replaceAll("_", " ")}</div>
                <div className="text-xs text-white/55">{new Date(analysis.createdAt).toLocaleString()}</div>
              </div>
              <button
                type="button"
                className="rounded-md bg-agri-primary px-3 py-2 text-sm font-semibold text-black disabled:opacity-50"
                disabled={generateMutation.isPending}
                onClick={() => generateMutation.mutate(analysis.id)}
              >
                Generate PDF
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Generated Reports</h2>
        {reportsLoading && <p className="text-sm text-white/60">Loading reports...</p>}
        <div className="grid gap-3">
          {reports.map((report) => (
            <div key={report.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-agri-border bg-agri-card p-4">
              <div>
                <div className="font-medium">Report {report.id.slice(0, 8)}</div>
                <div className="text-xs text-white/55">
                  {Math.round((report.fileSizeBytes ?? 0) / 1024)} KB / {new Date(report.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-agri-border px-3 py-2 text-sm hover:bg-agri-surface disabled:opacity-50"
                disabled={downloadMutation.isPending}
                onClick={() => downloadMutation.mutate(report.id)}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
