import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { analyzePlanner } from "../api/planner.api";
import { useFarmStore } from "../store/farmStore";
import { useResultsStore } from "../store/resultsStore";

export function CropPlannerPage() {
  const farmId = useFarmStore((s) => s.selectedFarmId);
  const params = useFarmStore((s) => s.params);
  const setParam = useFarmStore((s) => s.setParam);
  const setResult = useResultsStore((s) => s.setResult);
  const plannerResult = useResultsStore((s) => s.plannerResult);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!farmId) throw new Error("Select a farm on the dashboard first.");
      return analyzePlanner(farmId, params);
    },
    onSuccess: (res) => {
      setResult("CROP_PLANNER", res.data, farmId);
      toast.success(res.meta?.cached ? "Planner result (cached)" : "Planner result ready");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Planner failed"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Crop Planner</h1>
        <p className="text-sm text-white/70">Parameters are persisted locally for convenience.</p>
      </div>
      <div className="grid max-w-3xl grid-cols-2 gap-3">
        {(
          [
            ["nitrogen", "Nitrogen"],
            ["phosphorus", "Phosphorus"],
            ["potassium", "Potassium"],
            ["temperature", "Temperature (°C)"],
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
        Run analysis
      </button>
      <pre className="overflow-auto rounded-md border border-agri-border bg-black/30 p-4 text-xs text-white/80">
        {JSON.stringify(plannerResult, null, 2)}
      </pre>
    </div>
  );
}
