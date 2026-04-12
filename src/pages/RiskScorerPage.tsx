import { useMutation } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { analyzeRisk } from "../api/ai.api";
import { useFarmStore } from "../store/farmStore";
import { useResultsStore } from "../store/resultsStore";
import type { RiskResult } from "../types/ai.types";

const value = (v: number | undefined) => v ?? 0;

export function RiskScorerPage() {
  const farmId = useFarmStore((s) => s.selectedFarmId);
  const params = useFarmStore((s) => s.params);
  const setResult = useResultsStore((s) => s.setResult);
  const riskResult = useResultsStore((s) => s.riskResult) as RiskResult | null;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!farmId) throw new Error("Select a farm on the dashboard first.");
      return analyzeRisk(farmId, params);
    },
    onSuccess: (res) => {
      setResult("RISK_SCORER", res.data, farmId);
      toast.success(res.meta?.cached ? "Risk result loaded from cache" : "Risk score ready");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Risk analysis failed"),
  });

  const breakdown = riskResult?.risk_breakdown ?? riskResult?.riskBreakdown;
  const chartData = [
    { name: "Drought", risk: value(breakdown?.drought_risk ?? breakdown?.droughtRisk) },
    { name: "Flood", risk: value(breakdown?.flood_risk ?? breakdown?.floodRisk) },
    { name: "Soil", risk: value(breakdown?.soil_degradation_risk ?? breakdown?.soilDegradationRisk) },
    { name: "Pest", risk: value(breakdown?.pest_disease_risk ?? breakdown?.pestDiseaseRisk) },
    { name: "Market", risk: value(breakdown?.market_risk ?? breakdown?.marketRisk) },
  ];

  const score = riskResult?.overall_risk_score ?? riskResult?.overallRiskScore;
  const category = riskResult?.risk_category ?? riskResult?.riskCategory;
  const grade = riskResult?.investment_grade ?? riskResult?.investmentGrade;
  const landValue = riskResult?.land_valuation_score ?? riskResult?.landValuationScore;
  const tips = riskResult?.mitigation_tips ?? riskResult?.mitigationTips ?? [];
  const schemes = riskResult?.government_schemes ?? riskResult?.governmentSchemes ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Risk Scorer</h1>
          <p className="text-sm text-white/70">Score land risk from the current Crop Planner parameters.</p>
        </div>
        <button
          type="button"
          className="rounded-md bg-agri-primary px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Scoring..." : "Run risk score"}
        </button>
      </div>

      {!farmId && <p className="rounded-md border border-agri-border p-4 text-sm text-white/70">Select a farm on the dashboard first.</p>}

      {riskResult && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Metric label="Overall Risk" value={`${score ?? 0}/100`} />
            <Metric label="Category" value={category ?? "N/A"} />
            <Metric label="Investment Grade" value={grade ?? "N/A"} />
            <Metric label="Land Value" value={`${landValue ?? 0}/100`} />
          </div>

          <div className="h-72 rounded-lg border border-agri-border bg-agri-card p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.7)" />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.18)" }} />
                <Bar dataKey="risk" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoList title="Mitigation Tips" items={tips} />
            <InfoList title="Government Schemes" items={schemes} />
          </div>

          <div className="rounded-lg border border-agri-border bg-agri-card p-4 text-sm text-white/80">
            <p>Insurance: {riskResult.insurance_recommendation ?? riskResult.insuranceRecommendation}</p>
            <p>Best season to invest: {riskResult.best_season_to_invest ?? riskResult.bestSeasonToInvest}</p>
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
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-agri-border bg-agri-card p-4">
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-white/75">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
