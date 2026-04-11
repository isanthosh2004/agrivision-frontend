import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultFarmParams } from "../constants/farmOptions";
import type { FarmParams } from "../types/farm.types";

type FarmState = {
  selectedFarmId: string | null;
  params: FarmParams;
  setFarm: (id: string | null) => void;
  setParam: <K extends keyof FarmParams>(key: K, value: FarmParams[K]) => void;
  resetParams: () => void;
};

export const useFarmStore = create<FarmState>()(
  persist(
    (set) => ({
      selectedFarmId: null,
      params: defaultFarmParams,
      setFarm: (id) => set({ selectedFarmId: id }),
      setParam: (key, value) =>
        set((s) => ({
          params: { ...s.params, [key]: value },
        })),
      resetParams: () => set({ params: defaultFarmParams }),
    }),
    { name: "agrivision_farm" },
  ),
);
