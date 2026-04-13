import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { createFarm, listFarms } from "../api/farm.api";
import { regionOptions } from "../constants/farmOptions";
import { useFarmStore } from "../store/farmStore";

export function DashboardPage() {
  const queryClient = useQueryClient();
  const setFarm = useFarmStore((s) => s.setFarm);
  const setParams = useFarmStore((s) => s.setParams);
  const selectedFarmId = useFarmStore((s) => s.selectedFarmId);
  const [farmForm, setFarmForm] = useState({
    name: "",
    region: regionOptions[0] ?? "",
    soilType: "",
    areaAcres: "",
  });
  const { data, isLoading, error } = useQuery({ queryKey: ["farms"], queryFn: () => listFarms() });

  useEffect(() => {
    if (!data?.length || !selectedFarmId) return;
    const selectedFarm = data.find((farm) => farm.id === selectedFarmId);
    if (!selectedFarm) return;
    setParams({
      region: selectedFarm.region,
      soilType: selectedFarm.soilType,
      areaAcres: Number(selectedFarm.areaAcres),
    });
  }, [data, selectedFarmId, setParams]);
  const createFarmMutation = useMutation({
    mutationFn: async () => {
      const area = Number(farmForm.areaAcres);
      if (!farmForm.name || !farmForm.region || !farmForm.soilType || !farmForm.areaAcres) {
        throw new Error("Fill all farm fields before creating.");
      }
      if (!Number.isFinite(area) || area <= 0) {
        throw new Error("Area must be a valid positive number.");
      }
      return createFarm({
        name: farmForm.name.trim(),
        region: farmForm.region.trim(),
        soilType: farmForm.soilType.trim(),
        areaAcres: area,
      });
    },
    onSuccess: async (farm) => {
      setFarm(farm.id);
      setParams({
        region: farm.region,
        soilType: farm.soilType,
        areaAcres: Number(farm.areaAcres),
      });
      setFarmForm({ name: "", region: regionOptions[0] ?? "", soilType: "", areaAcres: "" });
      await queryClient.invalidateQueries({ queryKey: ["farms"] });
      toast.success("Farm created and selected.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Unable to create farm"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-white/70">Select a farm to run analyses.</p>
      </div>
      <div className="rounded-lg border border-agri-border bg-agri-card p-4">
        {isLoading && <p className="text-sm text-white/70">Loading farms...</p>}
        {error && <p className="text-sm text-agri-red">{(error as Error).message}</p>}
        {data?.length === 0 && <p className="text-sm text-white/70">No farms found for this account. Create your first farm below.</p>}
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
      <div className="rounded-lg border border-agri-border bg-agri-card p-4">
        <h2 className="text-lg font-semibold">Add farm</h2>
        <p className="mt-1 text-sm text-white/60">New accounts can create farms here and start analysis immediately.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            <div className="text-white/70">Farm name</div>
            <input
              className="mt-1 w-full rounded-md border border-agri-border bg-agri-surface px-3 py-2"
              value={farmForm.name}
              onChange={(e) => setFarmForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <div className="text-white/70">Region</div>
            <select
              className="mt-1 w-full rounded-md border border-agri-border bg-agri-surface px-3 py-2"
              value={farmForm.region}
              onChange={(e) => setFarmForm((prev) => ({ ...prev, region: e.target.value }))}
            >
              {regionOptions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <div className="text-white/70">Soil type</div>
            <input
              className="mt-1 w-full rounded-md border border-agri-border bg-agri-surface px-3 py-2"
              value={farmForm.soilType}
              onChange={(e) => setFarmForm((prev) => ({ ...prev, soilType: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <div className="text-white/70">Area (acres)</div>
            <input
              className="mt-1 w-full rounded-md border border-agri-border bg-agri-surface px-3 py-2"
              type="number"
              min="0.01"
              step="0.01"
              value={farmForm.areaAcres}
              onChange={(e) => setFarmForm((prev) => ({ ...prev, areaAcres: e.target.value }))}
            />
          </label>
        </div>
        <button
          type="button"
          className="mt-4 rounded-md bg-agri-primary px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          disabled={createFarmMutation.isPending}
          onClick={() => createFarmMutation.mutate()}
        >
          {createFarmMutation.isPending ? "Creating..." : "Create farm"}
        </button>
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
