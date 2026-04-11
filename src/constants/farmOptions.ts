import type { FarmParams } from "../types/farm.types";

export const defaultFarmParams: FarmParams = {
  nitrogen: 90,
  phosphorus: 42,
  potassium: 40,
  temperature: 28,
  humidity: 65,
  ph: 6.5,
  rainfall: 120,
  areaAcres: 25,
  fallowSeasons: 1,
  soilType: "Alluvial",
  region: "Andhra Pradesh",
  prevCrop: "Paddy",
};
