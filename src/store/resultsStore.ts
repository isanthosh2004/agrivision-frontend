import { create } from "zustand";

export type AnalysisType = "CROP_PLANNER" | "RISK_SCORER" | "XAI_EXPLAINER" | "FORECAST";

type ResultsState = {
  plannerResult: unknown | null;
  riskResult: unknown | null;
  xaiResult: unknown | null;
  forecastResult: unknown | null;
  lastRunFarmId: string | null;
  setResult: (type: AnalysisType, data: unknown, farmId: string | null) => void;
  clearAll: () => void;
};

export const useResultsStore = create<ResultsState>((set) => ({
  plannerResult: null,
  riskResult: null,
  xaiResult: null,
  forecastResult: null,
  lastRunFarmId: null,
  setResult: (type, data, farmId) =>
    set((s) => {
      const next = { ...s, lastRunFarmId: farmId };
      if (type === "CROP_PLANNER") return { ...next, plannerResult: data };
      if (type === "RISK_SCORER") return { ...next, riskResult: data };
      if (type === "XAI_EXPLAINER") return { ...next, xaiResult: data };
      return { ...next, forecastResult: data };
    }),
  clearAll: () =>
    set({
      plannerResult: null,
      riskResult: null,
      xaiResult: null,
      forecastResult: null,
      lastRunFarmId: null,
    }),
}));
