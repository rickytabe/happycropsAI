/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnalysisResult {
  status: "healthy" | "diseased";
  disease_name: string;
  confidence_score: number;
  risk_level: "low" | "medium" | "high";

  cause: {
    biological: string;
    environmental: string;
  };

  treatment_steps: string[];
  preventive_measures: string[];

  contextual_insight: string;

  untreated_impact: string;

  // 🔥 CRITICAL DIFFERENTIATORS
  location_context: string;
  seasonal_advice: string;
  
  // UI Metadata
  timestamp: number;
  imageUrl?: string;
}

export type Region = "West Africa" | "East Africa" | "Southern Africa" | "South Asia" | "Latin America";
