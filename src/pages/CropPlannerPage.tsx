import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { analyzePlanner } from "../api/planner.api";
import { useFarmStore } from "../store/farmStore";
import { useResultsStore } from "../store/resultsStore";
import type { PlannerResult } from "../types/ai.types";

export function CropPlannerPage() {
  const farmId = useFarmStore((s) => s.selectedFarmId);
  const params = useFarmStore((s) => s.params);
  const setParam = useFarmStore((s) => s.setParam);
  const setResult = useResultsStore((s) => s.setResult);
  const plannerResult = useResultsStore((s) => s.plannerResult) as PlannerResult | null;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!farmId) throw new Error("Select a farm on the dashboard first.");
      return analyzePlanner(farmId, params);
    },
    onSuccess: (res) => {
      setResult("CROP_PLANNER", res.data, farmId);
      toast.success(res.meta?.cached ? "Planner result loaded from cache" : "Planner result ready");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Planner failed"),
  });

  const crop = plannerResult?.recommended_crop ?? plannerResult?.recommendedCrop;
  const scores = plannerResult?.suitability_scores ?? plannerResult?.suitabilityScores;
  const yieldValue = plannerResult?.expected_yield_tons_per_acre ?? plannerResult?.expectedYieldTonsPerAcre;
  const profitValue = plannerResult?.profit_estimate_inr_per_acre ?? plannerResult?.profitEstimateInrPerAcre;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Crop Planner</h1>
        <p className="text-sm text-white/70">Tune soil and climate inputs, then run the crop recommendation model.</p>
      </div>
      {!farmId && <p className="rounded-md border border-agri-border p-4 text-sm text-white/70">Select a farm on the dashboard first.</p>}
      <div className="grid max-w-3xl grid-cols-2 gap-3">
        {(
          [
            ["nitrogen", "Nitrogen"],
            ["phosphorus", "Phosphorus"],
            ["potassium", "Potassium"],
            ["temperature", "Temperature (C)"],
            ["humidity", "Humidity (%)"],
            ["ph", "pH"],
            ["rainfall", "Rainfall (mm)"],
            ["areaAcres", "Area (acres)"],
            ["fallowSeasons", "Fallow seasons"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-sm">
            <div className="text-white/70">{label}</div>
            <input
              className="mt-1 w-full rounded-md border border-agri-border bg-agri-surface px-3 py-2"
              type="number"
              value={params[key] as number}
              onChange={(e) => setParam(key, Number(e.target.value) as never)}
            />
          </label>
        ))}
        {(
          [
            ["soilType", "Soil type"],
            ["region", "Region"],
            ["prevCrop", "Previous crop"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-sm">
            <div className="text-white/70">{label}</div>
            <input
              className="mt-1 w-full rounded-md border border-agri-border bg-agri-surface px-3 py-2"
              value={params[key]}
              onChange={(e) => setParam(key, e.target.value as never)}
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        className="rounded-md bg-agri-primary px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? "Running..." : "Run analysis"}
      </button>

      {plannerResult && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Metric label="Recommended Crop" value={crop ?? "N/A"} />
            <Metric label="Confidence" value={`${Math.round((plannerResult.confidence ?? 0) * 100)}%`} />
            <Metric label="Yield" value={`${yieldValue ?? 0} tons/acre`} />
            <Metric label="Profit" value={`Rs ${profitValue ?? 0}/acre`} />
          </div>

          {scores && (
            <div className="grid gap-3 md:grid-cols-4">
              <Metric label="Soil" value={`${scores.soil}/100`} />
              <Metric label="Climate" value={`${scores.climate}/100`} />
              <Metric label="Water" value={`${scores.water}/100`} />
              <Metric label="Nutrient" value={`${scores.nutrient}/100`} />
            </div>
          )}

          <div className="rounded-lg border border-agri-border bg-agri-card p-4">
            <h2 className="font-semibold">Top Alternatives</h2>
            <div className="mt-3 grid gap-3">
              {(plannerResult.top3 ?? []).map((alt) => (
                <div key={alt.crop} className="rounded-md border border-agri-border p-3 text-sm text-white/75">
                  <div className="font-medium text-white">{alt.crop}</div>
                  <div>{alt.reason ?? `Score ${Math.round(((alt.score ?? alt.probability ?? 0) as number) * 100)}%`}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-agri-border bg-agri-card p-4 text-sm text-white/80">
            <p>{plannerResult.key_insight ?? plannerResult.keyInsight}</p>
            <p className="mt-2">{plannerResult.fertilizer_recommendation ?? plannerResult.fertilizerRecommendation}</p>
            <p className="mt-2">{plannerResult.intercropping_suggestion ?? plannerResult.intercroppingSuggestion}</p>
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
