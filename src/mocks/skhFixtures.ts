import type {
  CandidateAssociation,
  CaseStudyScenario,
  CommonObservation,
  DailyCalendarCell,
  FRPComparisonResult,
  GeoJSONPolygon,
  RawAsset,
} from '../types/skh';

const polygon = (west: number, south: number, east: number, north: number): GeoJSONPolygon => ({
  type: 'Polygon',
  coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]],
});

const sha = (digit: string) => digit.repeat(64);
const asset = (
  raw_asset_id: string,
  product_id: RawAsset['product_id'],
  platform: RawAsset['platform'],
  collection: RawAsset['collection'],
  acquisition_start_utc: string,
): RawAsset => ({
  raw_asset_id,
  original_filename: `${product_id}.${acquisition_start_utc.slice(0, 10).replace(/-/g, '')}.${collection}.hdf`,
  source_archive: product_id === 'MOD14' || product_id === 'MYD14' ? 'LAADS' : 'FIRMS',
  product_id,
  collection,
  platform,
  processing_type: 'STANDARD',
  acquisition_start_utc,
  acquisition_end_utc: acquisition_start_utc.replace(':00Z', ':05Z'),
  sha256: sha(String((raw_asset_id.length % 9) + 1)),
  ingestion_status: 'VALID',
});

export const rawAssets: RawAsset[] = [
  asset('asset-c1-modis', 'MOD14', 'Terra', '6.1', '2023-10-24T05:20:00Z'),
  asset('asset-c1-viirs', 'VNP14IMG', 'Suomi-NPP', '2', '2023-10-24T05:22:00Z'),
  asset('asset-c2-viirs', 'VJ114IMG', 'NOAA-20', '2', '2023-08-18T17:40:00Z'),
  asset('asset-c3-viirs', 'VJ214IMG', 'NOAA-21', '2', '2023-09-11T20:10:00Z'),
  asset('asset-c3-modis-opportunity', 'MYD14', 'Aqua', '6.1', '2023-09-11T20:15:00Z'),
];

const observation = (
  observation_id: string,
  raw_asset_id: string,
  sensor: CommonObservation['sensor'],
  platform: CommonObservation['platform'],
  product_id: CommonObservation['product_id'],
  collection: CommonObservation['collection'],
  latitude: number,
  longitude: number,
  footprint_polygon: GeoJSONPolygon,
  footprint_area_km2: number,
  acquisition_time_utc: string,
  frp_raw_mw: number,
  day_night: CommonObservation['day_night'],
): CommonObservation => ({
  observation_id,
  raw_asset_id,
  granule_id: `${product_id}.${acquisition_time_utc.replace(/[-:TZ]/g, '').slice(0, 12)}`,
  sensor,
  platform,
  product_id,
  collection,
  latitude,
  longitude,
  footprint_polygon,
  is_fallback_geometry: false,
  footprint_area_km2,
  scan_position: sensor === 'MODIS' ? 1180 : 1600,
  track_position: 1024,
  acquisition_time_utc,
  day_night,
  frp_raw_mw,
  brightness_temp_k: sensor === 'MODIS' ? { channel_21: 345.6, channel_31: 302.1 } : { i4: 343.2, i5: 298.8 },
  confidence_raw: sensor === 'MODIS' ? 'nominal' : 86,
  confidence_scheme: sensor === 'MODIS' ? 'MOD14-C6.1-categorical' : 'VIIRS-C2-percent',
  source_qa_flags: { land_water_mask: 1, source_quality: 'nominal' },
  qc_status: 'VALID',
});

// Punjab: an off-nadir MODIS footprint holds five individually resolved VIIRS detections.
const c1Modis = observation('c1-modis-offnadir-01', 'asset-c1-modis', 'MODIS', 'Terra', 'MOD14', '6.1', 30.914, 75.854, polygon(75.847, 30.909, 75.861, 30.919), 1.95, '2023-10-24T05:20:00Z', 42.8, 'DAY');
const c1Viirs = [0, 1, 2, 3, 4].map((index) => {
  const west = 75.848 + index * 0.0023;
  return observation(`c1-viirs-${index + 1}`, 'asset-c1-viirs', 'VIIRS', 'Suomi-NPP', 'VNP14IMG', '2', 30.912 + index * 0.001, west + 0.0008, polygon(west, 30.911 + index * 0.001, west + 0.0016, 30.913 + index * 0.001), 0.141, `2023-10-24T05:${22 + index}:00Z`, 7.4 + index, 'DAY');
});

// Mato Grosso: MODIS had no valid retrieval because cloud obscured the opportunity.
const c2Viirs = [0, 1, 2].map((index) => observation(`c2-viirs-cloud-${index + 1}`, 'asset-c2-viirs', 'VIIRS', 'NOAA-20', 'VJ114IMG', '2', -11.854 + index * 0.002, -55.476 + index * 0.002, polygon(-55.477 + index * 0.002, -11.855 + index * 0.002, -55.4755 + index * 0.002, -11.8535 + index * 0.002), 0.141, `2023-08-18T17:${40 + index}:00Z`, 12.2 + index, 'DAY'));

// California: VIIRS senses a low-intensity burn below the 5.7 MW MODIS daytime limit.
const c3Viirs = [
  observation('c3-viirs-night-01', 'asset-c3-viirs', 'VIIRS', 'NOAA-21', 'VJ214IMG', '2', 36.778, -119.417, polygon(-119.418, 36.777, -119.4165, 36.7785), 0.141, '2023-09-11T20:10:00Z', 1.8, 'NIGHT'),
  observation('c3-viirs-day-01', 'asset-c3-viirs', 'VIIRS', 'NOAA-21', 'VJ214IMG', '2', 36.780, -119.414, polygon(-119.415, 36.779, -119.4135, 36.7805), 0.141, '2023-09-11T20:16:00Z', 1.8, 'DAY'),
];

export const observations: CommonObservation[] = [c1Modis, ...c1Viirs, ...c2Viirs, ...c3Viirs];

export const candidateAssociations: CandidateAssociation[] = c1Viirs.map((viirs, index) => ({
  candidate_id: `cand-c1-${index + 1}`,
  modis_observation_id: c1Modis.observation_id,
  viirs_observation_id: viirs.observation_id,
  time_diff_minutes: 2 + index,
  centroid_distance_km: 0.22 + index * 0.06,
  intersection_area_km2: 0.121,
  iou: 0.12,
  smaller_footprint_overlap: 0.86,
  boundary_distance_km: 0,
  matching_method: 'FOOTPRINT_AWARE',
  relationship_status: 'AMBIGUOUS_GROUP',
  evidence_category: 'GEOMETRY_DERIVED',
  run_id: 'run-harmonization-v1',
}));

export const calendarCells: DailyCalendarCell[] = [
  { date_utc: '2023-08-18', grid_resolution_km: 1, modis_detections: 0, viirs_detections: 3, candidate_groups_count: 0, modis_frp_sum_mw: 0, viirs_frp_sum_mw: 39.6, valid_observed_area_fraction: 0.16, cloud_obscured_fraction: 0.78, not_covered_fraction: 0.06, opportunity_summary_status: 'CLOUD_OBSCURED', is_anomalous_activity: false },
  { date_utc: '2023-09-11', grid_resolution_km: 1, modis_detections: 0, viirs_detections: 2, candidate_groups_count: 0, modis_frp_sum_mw: 0, viirs_frp_sum_mw: 3.6, valid_observed_area_fraction: 0.92, cloud_obscured_fraction: 0.04, not_covered_fraction: 0.04, opportunity_summary_status: 'VALID_NO_DETECTION', is_anomalous_activity: false },
  { date_utc: '2023-10-24', grid_resolution_km: 1, modis_detections: 1, viirs_detections: 5, candidate_groups_count: 1, modis_frp_sum_mw: 42.8, viirs_frp_sum_mw: 47, valid_observed_area_fraction: 0.96, cloud_obscured_fraction: 0.02, not_covered_fraction: 0.02, opportunity_summary_status: 'DETECTED', is_anomalous_activity: true },
];

export const frpComparisonResults: FRPComparisonResult[] = observations.map((item, index) => ({
  measurement_result_id: `frp-result-${index + 1}`,
  observation_id: item.observation_id,
  frp_raw_mw: item.frp_raw_mw,
  detection_limit_dp_mw: item.sensor === 'MODIS' ? 5.7 : item.day_night === 'NIGHT' ? 0.4 : 1.5,
  frp_operator_adjusted_mw: item.sensor === 'MODIS' ? item.frp_raw_mw * 0.84 : item.frp_raw_mw * 1.08,
  operator_direction: item.sensor === 'MODIS' ? 'MODIS_TO_VIIRS_SPACE' : 'VIIRS_TO_MODIS_SPACE',
  operator_version: 'skh-frp-op-1.0.0',
  uncertainty_bounds: [item.frp_raw_mw * 0.8, item.frp_raw_mw * 1.2],
}));

export const caseStudies: Array<CaseStudyScenario & { id: string }> = [
  { case_id: 'many-to-many-agricultural-cluster', id: 'cs1', title: 'Many-to-Many Agricultural Cluster', subtitle: 'Off-nadir MODIS versus resolved VIIRS field burns', region_name: 'Punjab, India', date_range_utc: ['2023-10-24T00:00:00Z', '2023-10-24T23:59:59Z'], bbox: [75.84, 30.90, 75.87, 30.93], focus_observation_ids: [c1Modis.observation_id, ...c1Viirs.map((item) => item.observation_id)], key_takeaway: 'Low IoU does not imply weak association when the smaller VIIRS footprint is substantially contained.', scientific_explanation: 'The 1.95 km² off-nadir MODIS footprint intersects five 375 m VIIRS footprints; each edge has IoU near 0.12 but smaller-footprint overlap of 0.86.' },
  { case_id: 'cloud-obscured-modis-disagreement', id: 'cs2', title: 'Cloud-Obscured MODIS Disagreement', subtitle: 'No MODIS detection is not evidence of no fire', region_name: 'Mato Grosso, Brazil', date_range_utc: ['2023-08-18T00:00:00Z', '2023-08-18T23:59:59Z'], bbox: [-55.49, -11.87, -55.46, -11.84], focus_observation_ids: c2Viirs.map((item) => item.observation_id), key_takeaway: 'The MODIS opportunity is CLOUD_OBSCURED, so a zero MODIS count cannot refute the three VIIRS detections.', scientific_explanation: 'Cloud contamination removes a valid MODIS observation opportunity; the calendar records missing observability separately from a valid non-detection.' },
  { case_id: 'sub-threshold-low-intensity-burning', id: 'cs3', title: 'Sub-Threshold Low-Intensity Burning', subtitle: 'VIIRS resolves 1.8 MW activity beneath MODIS daytime sensitivity', region_name: 'Central Valley, California, USA', date_range_utc: ['2023-09-11T00:00:00Z', '2023-09-11T23:59:59Z'], bbox: [-119.43, 36.77, -119.40, 36.79], focus_observation_ids: c3Viirs.map((item) => item.observation_id), key_takeaway: 'A VALID_NO_DETECTION opportunity is scientifically different from cloud-obscured coverage.', scientific_explanation: 'The 1.8 MW VIIRS records exceed its detection capability but remain below the 5.7 MW MODIS daytime detection limit.' },
];

export const sensitivityGrid = [
  { spatial_km: 0.5, temporal_min: 5, candidate_count: 4, ambiguous_groups: 0, precision: 0.97, recall: 0.45, f1: 0.61 },
  { spatial_km: 1, temporal_min: 15, candidate_count: 5, ambiguous_groups: 1, precision: 0.93, recall: 0.71, f1: 0.81 },
  { spatial_km: 2, temporal_min: 30, candidate_count: 8, ambiguous_groups: 1, precision: 0.82, recall: 0.88, f1: 0.85 },
  { spatial_km: 4, temporal_min: 60, candidate_count: 15, ambiguous_groups: 4, precision: 0.64, recall: 0.95, f1: 0.76 },
];
