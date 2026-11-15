/**
 * SANYAM harmonization domain types.  Field names deliberately mirror the
 * normalized FastAPI/PostgreSQL/PostGIS API payloads (snake_case).
 */

export type SensorType = 'MODIS' | 'VIIRS';
export type PlatformType = 'Terra' | 'Aqua' | 'Suomi-NPP' | 'NOAA-20' | 'NOAA-21';
export type ProductId = 'MOD14' | 'MYD14' | 'VNP14IMG' | 'VJ114IMG' | 'VJ214IMG';
export type ProcessingStream = 'STANDARD' | 'NRT';
export type QCStatus = 'VALID' | 'VALID_WITH_WARNINGS' | 'INVALID' | 'INCOMPLETE' | 'QUARANTINED';
export type OpportunityState =
  | 'DETECTED'
  | 'VALID_NO_DETECTION'
  | 'CLOUD_OBSCURED'
  | 'INVALID_QUALITY'
  | 'NOT_COVERED'
  | 'UNKNOWN';
export type RelationshipStatus =
  | 'UNMATCHED'
  | 'SINGLE_CANDIDATE'
  | 'MULTIPLE_CANDIDATES'
  | 'AMBIGUOUS_GROUP'
  | 'REJECTED';
export type EvidenceCategory =
  | 'DIRECT_SOURCE_OBSERVATION'
  | 'SOURCE_QA_SUPPORTED'
  | 'GEOMETRY_DERIVED'
  | 'CANDIDATE_ASSOCIATION'
  | 'MODEL_ADJUSTED'
  | 'INDEPENDENTLY_VALIDATED'
  | 'UNKNOWN_OR_INSUFFICIENT';

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface RawAsset {
  raw_asset_id: string;
  original_filename: string;
  source_archive: 'LAADS' | 'LP_DAAC' | 'FIRMS';
  product_id: ProductId;
  collection: '6.1' | '2';
  platform: PlatformType;
  processing_type: ProcessingStream;
  acquisition_start_utc: string;
  acquisition_end_utc: string;
  sha256: string;
  ingestion_status: QCStatus;
}

/** A native observation; derived values never replace the source values. */
export interface CommonObservation {
  observation_id: string;
  raw_asset_id: string;
  granule_id: string;
  sensor: SensorType;
  platform: PlatformType;
  product_id: ProductId;
  collection: '6.1' | '2';
  latitude: number;
  longitude: number;
  footprint_polygon: GeoJSONPolygon;
  is_fallback_geometry: boolean;
  footprint_area_km2: number;
  scan_position: number;
  track_position: number;
  acquisition_time_utc: string;
  day_night: 'DAY' | 'NIGHT';
  frp_raw_mw: number;
  brightness_temp_k: Record<string, number>;
  confidence_raw: string | number;
  confidence_scheme: string;
  source_qa_flags: Record<string, string | number | boolean>;
  qc_status: QCStatus;
}

export interface CandidateAssociation {
  candidate_id: string;
  modis_observation_id: string;
  viirs_observation_id: string;
  time_diff_minutes: number;
  centroid_distance_km: number;
  intersection_area_km2: number;
  iou: number;
  smaller_footprint_overlap: number;
  boundary_distance_km: number;
  matching_method: 'BASELINE_HAVERSINE' | 'FOOTPRINT_AWARE';
  relationship_status: RelationshipStatus;
  evidence_category: EvidenceCategory;
  run_id: string;
}

export interface FRPComparisonResult {
  measurement_result_id: string;
  observation_id: string;
  frp_raw_mw: number;
  detection_limit_dp_mw: number;
  frp_operator_adjusted_mw: number | null;
  operator_direction: 'MODIS_TO_VIIRS_SPACE' | 'VIIRS_TO_MODIS_SPACE' | null;
  operator_version: string;
  uncertainty_bounds: [number, number] | null;
}

export interface DailyCalendarCell {
  date_utc: string;
  grid_resolution_km: number;
  modis_detections: number;
  viirs_detections: number;
  candidate_groups_count: number;
  modis_frp_sum_mw: number;
  viirs_frp_sum_mw: number;
  valid_observed_area_fraction: number;
  cloud_obscured_fraction: number;
  not_covered_fraction: number;
  opportunity_summary_status: OpportunityState;
  is_anomalous_activity: boolean;
}

export interface CaseStudyScenario {
  case_id: string;
  title: string;
  subtitle: string;
  region_name: string;
  date_range_utc: [string, string];
  bbox: [number, number, number, number];
  focus_observation_ids: string[];
  key_takeaway: string;
  scientific_explanation: string;
}
