import type { FarmParams } from "./farm.types";

export type CropAlternative = {
  crop: string;
  score?: number;
  probability?: number;
  reason?: string;
  rank?: number;
};

export type SuitabilityScores = {
  soil: number;
  climate: number;
  water: number;
  nutrient: number;
};

export type PlannerResult = {
  recommended_crop?: string;
  recommendedCrop?: string;
  confidence: number;
  top3: CropAlternative[];
  suitability_scores?: SuitabilityScores;
  suitabilityScores?: SuitabilityScores;
  expected_yield_tons_per_acre?: number;
  expectedYieldTonsPerAcre?: number;
  profit_estimate_inr_per_acre?: number;
  profitEstimateInrPerAcre?: number;
  growing_period_days?: number;
  growingPeriodDays?: number;
  water_requirement?: string;
  waterRequirement?: string;
  fertilizer_recommendation?: string;
  fertilizerRecommendation?: string;
  intercropping_suggestion?: string;
  intercroppingSuggestion?: string;
  key_insight?: string;
  keyInsight?: string;
};

export type RiskBreakdown = {
  drought_risk?: number;
  droughtRisk?: number;
  flood_risk?: number;
  floodRisk?: number;
  soil_degradation_risk?: number;
  soilDegradationRisk?: number;
  pest_disease_risk?: number;
  pestDiseaseRisk?: number;
  market_risk?: number;
  marketRisk?: number;
};

export type RiskResult = {
  overall_risk_score?: number;
  overallRiskScore?: number;
  risk_category?: string;
  riskCategory?: string;
  risk_breakdown?: RiskBreakdown;
  riskBreakdown?: RiskBreakdown;
  land_valuation_score?: number;
  landValuationScore?: number;
  investment_grade?: string;
  investmentGrade?: string;
  mitigation_tips?: string[];
  mitigationTips?: string[];
  insurance_recommendation?: string;
  insuranceRecommendation?: string;
  best_season_to_invest?: string;
  bestSeasonToInvest?: string;
  government_schemes?: string[];
  governmentSchemes?: string[];
};

export type ShapValue = {
  feature: string;
  value: string;
  shap_impact?: number;
  shapImpact?: number;
  direction: string;
  importance_rank?: number;
  importanceRank?: number;
};

export type XaiResult = {
  prediction: string;
  base_value?: number;
  baseValue?: number;
  shap_values?: ShapValue[];
  shapValues?: ShapValue[];
  lime_explanation?: string;
  limeExplanation?: string;
  decision_boundary?: string;
  decisionBoundary?: string;
  confidence_interval?: { lower: number; upper: number };
  confidenceInterval?: { lower: number; upper: number };
  counterfactual: string;
  top_positive_factor?: string;
  topPositiveFactor?: string;
  top_negative_factor?: string;
  topNegativeFactor?: string;
};

export type SeasonForecast = {
  season_name?: string;
  seasonName?: string;
  crop: string;
  yield_tons_per_acre?: number;
  yieldTonsPerAcre?: number;
  revenue_inr_per_acre?: number;
  revenueInrPerAcre?: number;
  input_cost_inr_per_acre?: number;
  inputCostInrPerAcre?: number;
  profit_inr_per_acre?: number;
  profitInrPerAcre?: number;
  risk_level?: string;
  riskLevel?: string;
  water_need_mm?: number;
  waterNeedMm?: number;
  optimization_tip?: string;
  optimizationTip?: string;
};

export type ForecastResult = {
  seasons: SeasonForecast[];
  total_5yr_revenue_inr?: number;
  total5yrRevenueInr?: number;
  total_5yr_profit_inr?: number;
  total5yrProfitInr?: number;
  avg_yield_trend?: string;
  avgYieldTrend?: string;
  land_productivity_score?: number;
  landProductivityScore?: number;
  fallow_recommendation?: string;
  fallowRecommendation?: string;
  sustainability_index?: number;
  sustainabilityIndex?: number;
  carbon_footprint_note?: string;
  carbonFootprintNote?: string;
  soil_health_projection?: string;
  soilHealthProjection?: string;
};

export type XaiRequest = {
  farmParams: FarmParams;
  recommendedCrop: string;
};

export type ForecastRequest = XaiRequest;

export type AnalysisSummary = {
  id: string;
  analysisType: "CROP_PLANNER" | "RISK_SCORER" | "XAI_EXPLAINER" | "FORECAST";
  cacheHit: boolean;
  createdAt: string;
};

export type ReportSummary = {
  id: string;
  analysisId: string;
  cloudinaryUrl: string;
  fileSizeBytes: number;
  createdAt: string;
};
