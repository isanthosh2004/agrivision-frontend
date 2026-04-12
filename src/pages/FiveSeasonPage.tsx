import { useMutation } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { generateForecast } from "../api/ai.api";
import { useFarmStore } from "../store/farmStore";
import { useResultsStore } from "../store/resultsStore";
import type { ForecastResult, PlannerResult } from "../types/ai.types";

export function FiveSeasonPage() {
  const farmId = useFarmStore((s) => s.selectedFarmId);
  const params = useFarmStore((s) => s.params);
  const setResult = useResultsStore((s) => s.setResult);
  const plannerResult = useResultsStore((s) => s.plannerResult) as PlannerResult | null;
  const forecastResult = useResultsStore((s) => s.forecastResult) as ForecastResult | null;
  const recommendedCrop = plannerResult?.recommended_crop ?? plannerResult?.recommendedCrop ?? params.prevCrop ?? "Rice";

  const mutation = useMutation({
    mutationFn: async () => {
      if (!farmId) throw new Error("Select a farm on the dashboard first.");
      return generateForecast(farmId, { farmParams: params, recommendedCrop });
    },
    onSuccess: (res) => {
      setResult("FORECAST", res.data, farmId);
      toast.success(res.meta?.cached ? "Forecast loaded from cache" : "Forecast ready");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Forecast failed"),
  });

  const seasons = forecastResult?.seasons ?? [];
  const chartData = seasons.map((season) => ({
    season: season.season_name ?? season.seasonName,
    yield: season.yield_tons_per_acre ?? season.yieldTonsPerAcre ?? 0,
    profit: season.profit_inr_per_acre ?? season.profitInrPerAcre ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">5-Season Forecast</h1>
          <p className="text-sm text-white/70">Generate a crop rotation and revenue forecast from {recommendedCrop}.</p>
        </div>
        <button
          type="button"
          className="rounded-md bg-agri-primary px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Forecasting..." : "Generate forecast"}
        </button>
      </div>

      {forecastResult && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Metric label="5yr Revenue" value={`Rs ${forecastResult.total_5yr_revenue_inr ?? forecastResult.total5yrRevenueInr ?? 0}`} />
            <Metric label="5yr Profit" value={`Rs ${forecastResult.total_5yr_profit_inr ?? forecastResult.total5yrProfitInr ?? 0}`} />
            <Metric label="Yield Trend" value={forecastResult.avg_yield_trend ?? forecastResult.avgYieldTrend ?? "Stable"} />
            <Metric label="Sustainability" value={`${forecastResult.sustainability_index ?? forecastResult.sustainabilityIndex ?? 0}/100`} />
          </div>

          <div className="h-72 rounded-lg border border-agri-border bg-agri-card p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                <XAxis dataKey="season" stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="rgba(255,255,255,0.7)" />
                <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.7)" />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.18)" }} />
                <Line yAxisId="left" type="monotone" dataKey="yield" stroke="#4ade80" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#60a5fa" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3">
            {seasons.map((season) => (
              <div key={season.season_name ?? season.seasonName} className="rounded-lg border border-agri-border bg-agri-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold">
                    {season.season_name ?? season.seasonName}: {season.crop}
                  </h2>
                  <span className="text-sm text-white/60">Risk {season.risk_level ?? season.riskLevel}</span>
                </div>
                <p className="mt-2 text-sm text-white/70">{season.optimization_tip ?? season.optimizationTip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-agri-border bg-agri-card p-4">
      <div className="text-xs uppercase text-white/50">{label}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}
