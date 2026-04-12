import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { explainXai } from "../api/ai.api";
import { useFarmStore } from "../store/farmStore";
import { useResultsStore } from "../store/resultsStore";
import type { PlannerResult, XaiResult } from "../types/ai.types";

export function XAIExplainerPage() {
  const farmId = useFarmStore((s) => s.selectedFarmId);
  const params = useFarmStore((s) => s.params);
  const setResult = useResultsStore((s) => s.setResult);
  const plannerResult = useResultsStore((s) => s.plannerResult) as PlannerResult | null;
  const xaiResult = useResultsStore((s) => s.xaiResult) as XaiResult | null;

  const recommendedCrop = plannerResult?.recommended_crop ?? plannerResult?.recommendedCrop ?? params.prevCrop ?? "Rice";

  const mutation = useMutation({
    mutationFn: async () => {
      if (!farmId) throw new Error("Select a farm on the dashboard first.");
      return explainXai(farmId, { farmParams: params, recommendedCrop });
    },
    onSuccess: (res) => {
      setResult("XAI_EXPLAINER", res.data, farmId);
      toast.success(res.meta?.cached ? "Explanation loaded from cache" : "Explanation ready");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "XAI explanation failed"),
  });

  const shapValues = xaiResult?.shap_values ?? xaiResult?.shapValues ?? [];
  const chartData = useMemo(
    () =>
      shapValues.map((item) => ({
        feature: item.feature,
        impact: item.shap_impact ?? item.shapImpact ?? 0,
      })),
    [shapValues],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">XAI Explainer</h1>
          <p className="text-sm text-white/70">Explain why {recommendedCrop} was selected for this farm.</p>
        </div>
        <button
          type="button"
          className="rounded-md bg-agri-primary px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Explaining..." : "Run SHAP explanation"}
        </button>
      </div>

      {!plannerResult && (
        <p className="rounded-md border border-agri-border p-4 text-sm text-white/70">
          Run Crop Planner first for the cleanest recommendation context. This page can still explain the previous crop.
        </p>
      )}

      {xaiResult && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Metric label="Prediction" value={xaiResult.prediction} />
            <Metric label="Top Support" value={xaiResult.top_positive_factor ?? xaiResult.topPositiveFactor ?? "N/A"} />
            <Metric label="Top Limiter" value={xaiResult.top_negative_factor ?? xaiResult.topNegativeFactor ?? "N/A"} />
          </div>

          <div className="h-80 rounded-lg border border-agri-border bg-agri-card p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                <XAxis dataKey="feature" stroke="rgba(255,255,255,0.7)" tick={{ fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.18)" }} />
                <Bar dataKey="impact" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border border-agri-border bg-agri-card p-4 text-sm text-white/80">
            <p>{xaiResult.lime_explanation ?? xaiResult.limeExplanation}</p>
            <p className="mt-2">{xaiResult.counterfactual}</p>
            <p className="mt-2">{xaiResult.decision_boundary ?? xaiResult.decisionBoundary}</p>
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
