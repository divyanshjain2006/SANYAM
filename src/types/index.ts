export type Persona = 'manager' | 'scientist';

export type SensorType = 'MODIS_TERRA' | 'MODIS_AQUA' | 'VIIRS_SNPP' | 'VIIRS_NOAA20' | 'VIIRS_NOAA21';
export type OpportunityState = 'valid_clear_sky' | 'cloud_obscured' | 'outside_swath';
export type DayNight = 'D' | 'N';
export type Collection = '6.1' | '2';
export type Processing = 'Standard' | 'NRT';
export type QAStatus = 'pass' | 'flag' | 'fail';
export type FootprintType = 'actual' | 'circular_buffer';
export type ScenarioType = 'many_to_many' | 'cloud_obscured' | 'sub_threshold';

export interface HOTSpot {
  id: string;
  sensor: SensorType;
  lat: number;
  lon: number;
  frp: number;
  brightness: number;
  confidence: 'low' | 'nominal' | 'high' | number;
  acqDate: string;
  acqTime: string;
  dayNight: DayNight;
  collection: Collection;
  processing: Processing;
  granuleId: string;
  footprintType: FootprintType;
  footprintGeoJSON: object;
}

export interface CandidateMatch {
  id: string;
  modisId: string;
  viirsIds: string[];
  deltaT: number;
  centroidDistance: number;
  iou: number;
  smallerFootprintOverlap: number;
  opportunityState: OpportunityState;
}

export interface CalendarDay {
  date: string;
  thermalActivityCount: number;
  validAreaFraction: number;
  cloudObscuredFraction: number;
  outsideSwathFraction: number;
  hotspots: string[];
}

export interface FRPRecord {
  id: string;
  rawFRP: number;
  adjustedFRP: number;
  pixelArea: number;
  detectionLimit: number;
  sensor: string;
  dayNight: DayNight;
}

export interface ProvenanceRecord {
  granuleId: string;
  sensor: string;
  collection: string;
  processing: string;
  acqDate: string;
  sha256: string;
  qaStatus: QAStatus;
  hotspotCount: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  scenarioType: ScenarioType;
  prefilterDate: string;
  prefilterRegion: [number, number, number, number];
  highlights: string[];
  badge: string;
}

export interface SensitivityConfig {
  spatialThresholdKm: number;
  temporalThresholdMin: number;
  gridSizeKm: number;
}

export interface MatchMetrics {
  precision: number;
  recall: number;
  f1: number;
  candidateCount: number;
}

export interface HotspotFilters {
  sensor?: SensorType[];
  dateFrom?: string;
  dateTo?: string;
  region?: [number, number, number, number];
  caseStudyId?: string;
}

export interface MatchFilters {
  opportunityState?: OpportunityState[];
  caseStudyId?: string;
}
