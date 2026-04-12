import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listFarms } from "../api/farm.api";
import { useFarmStore } from "../store/farmStore";

export function DashboardPage() {
  const setFarm = useFarmStore((s) => s.setFarm);
  const selectedFarmId = useFarmStore((s) => s.selectedFarmId);
  const { data, isLoading, error } = useQuery({ queryKey: ["farms"], queryFn: () => listFarms() });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-white/70">Select a farm to run analyses.</p>
      </div>
      <div className="rounded-lg border border-agri-border bg-agri-card p-4">
        {isLoading && <p className="text-sm text-white/70">Loading farms...</p>}
        {error && <p className="text-sm text-agri-red">{(error as Error).message}</p>}
        {data?.length === 0 && <p className="text-sm text-white/70">No farms found for this account.</p>}
        {data && (
          <div className="space-y-2">
            {data.map((farm) => (
              <button
                key={farm.id}
                type="button"
                className="flex w-full items-center justify-between rounded-md border border-agri-border px-3 py-2 text-left hover:bg-agri-surface"
                onClick={() => setFarm(farm.id)}
              >
                <div>
                  <div className="font-medium">{farm.name}</div>
                  <div className="text-xs text-white/60">
                    {farm.region} / {farm.soilType} / {farm.areaAcres} acres
                  </div>
                </div>
                <span className="text-xs text-agri-primary">{selectedFarmId === farm.id ? "Selected" : "Select"}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link className="rounded-md border border-agri-border px-3 py-2 hover:bg-agri-surface" to="/planner">
          Open Crop Planner
        </Link>
        <Link className="rounded-md border border-agri-border px-3 py-2 hover:bg-agri-surface" to="/risk">
          Open Risk Scorer
        </Link>
      </div>
    </div>
  );
}
