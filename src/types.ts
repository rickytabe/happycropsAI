/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnalysisResult {
  is_crop?: boolean;
  status: "healthy" | "diseased";
  disease_name: string;
  confidence_score: number;
  risk_level: "low" | "medium" | "high";

  country: string;
  contextual_insight: string;
  
  image_analysis: {
    photo_id: string;
    description: string;
  };

  untreated_impact: {
    value_lost: string;
    description: string;
    risk_label: string;
    risk_percentage: number;
  };

  spread_factors: {
    icon_name: string;
    title: string;
    description: string;
  }[];

  treatment_steps: {
    title: string;
    description: string;
  }[];

  preventive_measures: string[];
  
  // UI Metadata
  timestamp: number;
  imageUrl?: string;
}

export type Country = string;

