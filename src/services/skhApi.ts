/**
 * skhApi.ts – ISKHRepository interface + mock/real switchable implementation
 * Set USE_MOCK_DATA=true to use mock data; false to call real API endpoints.
 */

import type {
  HOTSpot,
  CandidateMatch,
  CalendarDay,
  FRPRecord,
  ProvenanceRecord,
  SensitivityConfig,
  MatchMetrics,
  HotspotFilters,
  MatchFilters,
} from '../types';

import mockHotspots from '../mocks/hotspots.ts';
import mockCalendar from '../mocks/calendar.ts';
import mockFrpData from '../mocks/frpData.ts';
import mockProvenance from '../mocks/provenance.ts';
import mockCandidateMatches from '../mocks/candidateMatches.ts';
import type {
  CandidateAssociation as DomainCandidateAssociation,
  CaseStudyScenario,
  CommonObservation,
  DailyCalendarCell,
  FRPComparisonResult,
  OpportunityState as DomainOpportunityState,
  RawAsset,
  SensorType as DomainSensorType,
} from '../types/skh';
import {
  calendarCells,
  candidateAssociations,
  caseStudies as skhCaseStudies,
  frpComparisonResults,
  observations,
  rawAssets,
  sensitivityGrid,
} from '../mocks/skhFixtures.ts';

export const USE_MOCK_DATA = true;
const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE) || 'http://localhost:8000';

// ---------------------------------------------------------------------------
// Repository interface
// ---------------------------------------------------------------------------

export interface ISKHRepository {
  /** Backend-shaped harmonization API. */
  getObservations(params: { bbox?: number[]; startUtc?: string; endUtc?: string; sensors?: DomainSensorType[]; includeNrt?: boolean }): Promise<CommonObservation[]>;
  getCandidateGraph(runId: string, caseId?: string): Promise<{ nodes: CommonObservation[]; edges: DomainCandidateAssociation[]; ambiguousGroups: string[][] }>;
  getBurningActivityCalendar(year: number, month?: number, gridKm?: number): Promise<DailyCalendarCell[]>;
  getFRPOperatorAnalysis(runId: string): Promise<{ points: FRPComparisonResult[]; metrics: { bias_mw: number; mae_mw: number; rmse_mw: number; symmetric_rd_pct: number } }>;
  getSensitivityGrid(): Promise<Array<{ spatial_km: number; temporal_min: number; candidate_count: number; ambiguous_groups: number; precision: number; recall: number; f1: number }>>;
  getProvenanceManifest(): Promise<RawAsset[]>;
  getCaseStudies(): Promise<CaseStudyScenario[]>;

  /** @deprecated UI-era API; retained until dashboard migration is complete. */
  getHotspots(filters?: HotspotFilters): Promise<HOTSpot[]>;
  getMatches(filters?: MatchFilters): Promise<CandidateMatch[]>;
  getCalendar(year: number, month: number): Promise<CalendarDay[]>;
  getFRPRecords(hotspotId?: string): Promise<FRPRecord[]>;
  getProvenance(granuleId?: string): Promise<ProvenanceRecord[]>;
  getMatchMetrics(config: SensitivityConfig, filters?: MatchFilters): Promise<MatchMetrics>;
}

/** Return connected components containing more than one bipartite node. */
export const buildAmbiguousGroups = (edges: DomainCandidateAssociation[]): string[][] => {
  const neighbours = new Map<string, Set<string>>();
  for (const edge of edges) {
    const left = neighbours.get(edge.modis_observation_id) ?? new Set<string>();
    const right = neighbours.get(edge.viirs_observation_id) ?? new Set<string>();
    left.add(edge.viirs_observation_id);
    right.add(edge.modis_observation_id);
    neighbours.set(edge.modis_observation_id, left);
    neighbours.set(edge.viirs_observation_id, right);
  }
  const visited = new Set<string>();
  const groups: string[][] = [];
  for (const start of neighbours.keys()) {
    if (visited.has(start)) continue;
    const stack = [start];
    const group: string[] = [];
    visited.add(start);
    while (stack.length) {
      const node = stack.pop()!;
      group.push(node);
      for (const neighbour of neighbours.get(node) ?? []) {
        if (!visited.has(neighbour)) {
          visited.add(neighbour);
          stack.push(neighbour);
        }
      }
    }
    if (group.length > 1) groups.push(group.sort());
  }
  return groups;
};

export const filterCalendarByOpportunityState = (
  cells: DailyCalendarCell[],
  state: DomainOpportunityState,
): DailyCalendarCell[] => cells.filter((cell) => cell.opportunity_summary_status === state);

// ---------------------------------------------------------------------------
// Mock implementation
// ---------------------------------------------------------------------------

export class MockSKHRepository implements ISKHRepository {
  async getObservations(params: { bbox?: number[]; startUtc?: string; endUtc?: string; sensors?: DomainSensorType[]; includeNrt?: boolean }): Promise<CommonObservation[]> {
    let result = [...observations];
    if (params.bbox?.length === 4) {
      const [west, south, east, north] = params.bbox;
      result = result.filter((item) => item.longitude >= west && item.longitude <= east && item.latitude >= south && item.latitude <= north);
    }
    if (params.startUtc) result = result.filter((item) => item.acquisition_time_utc >= params.startUtc!);
    if (params.endUtc) result = result.filter((item) => item.acquisition_time_utc <= params.endUtc!);
    if (params.sensors?.length) result = result.filter((item) => params.sensors!.includes(item.sensor));
    // Fixtures are STANDARD; includeNrt=false is therefore naturally deterministic.
    return result;
  }

  async getCandidateGraph(runId: string, caseId?: string): Promise<{ nodes: CommonObservation[]; edges: DomainCandidateAssociation[]; ambiguousGroups: string[][] }> {
    let edges = candidateAssociations.filter((edge) => edge.run_id === runId);
    if (caseId) {
      const scenario = skhCaseStudies.find((item) => item.case_id === caseId || item.id === caseId);
      const focusIds = new Set(scenario?.focus_observation_ids ?? []);
      edges = edges.filter((edge) => focusIds.has(edge.modis_observation_id) && focusIds.has(edge.viirs_observation_id));
    }
    const nodeIds = new Set(edges.flatMap((edge) => [edge.modis_observation_id, edge.viirs_observation_id]));
    return { nodes: observations.filter((item) => nodeIds.has(item.observation_id)), edges, ambiguousGroups: buildAmbiguousGroups(edges) };
  }

  async getBurningActivityCalendar(year: number, month?: number, gridKm?: number): Promise<DailyCalendarCell[]> {
    const prefix = month === undefined ? `${year}-` : `${year}-${String(month).padStart(2, '0')}-`;
    return calendarCells.filter((cell) => cell.date_utc.startsWith(prefix) && (gridKm === undefined || cell.grid_resolution_km === gridKm));
  }

  async getFRPOperatorAnalysis(_runId: string): Promise<{ points: FRPComparisonResult[]; metrics: { bias_mw: number; mae_mw: number; rmse_mw: number; symmetric_rd_pct: number } }> {
    const pairs = frpComparisonResults.filter((point) => point.frp_operator_adjusted_mw !== null);
    const diffs = pairs.map((point) => point.frp_operator_adjusted_mw! - point.frp_raw_mw);
    const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
    return {
      points: [...frpComparisonResults],
      metrics: {
        bias_mw: mean(diffs),
        mae_mw: mean(diffs.map(Math.abs)),
        rmse_mw: Math.sqrt(mean(diffs.map((value) => value ** 2))),
        symmetric_rd_pct: mean(pairs.map((point) => 200 * Math.abs(point.frp_operator_adjusted_mw! - point.frp_raw_mw) / (point.frp_operator_adjusted_mw! + point.frp_raw_mw))),
      },
    };
  }

  async getSensitivityGrid() { return [...sensitivityGrid]; }

  async getProvenanceManifest(): Promise<RawAsset[]> { return [...rawAssets]; }

  async getHotspots(filters?: HotspotFilters): Promise<HOTSpot[]> {
    let result = [...mockHotspots];
    if (filters?.sensor && filters.sensor.length > 0) {
      result = result.filter((h) => filters.sensor!.includes(h.sensor));
    }
    if (filters?.dateFrom) {
      result = result.filter((h) => h.acqDate >= filters.dateFrom!);
    }
    if (filters?.dateTo) {
      result = result.filter((h) => h.acqDate <= filters.dateTo!);
    }
    if (filters?.caseStudyId) {
      if (filters.caseStudyId === 'cs1') {
        result = result.filter((h) => h.id.includes('CS1'));
      } else if (filters.caseStudyId === 'cs2') {
        result = result.filter((h) => h.id.includes('CS2'));
      } else if (filters.caseStudyId === 'cs3') {
        result = result.filter((h) => h.id.includes('CS3'));
      }
    }
    return result;
  }

  async getMatches(filters?: MatchFilters): Promise<CandidateMatch[]> {
    let result = [...mockCandidateMatches];
    if (filters?.opportunityState && filters.opportunityState.length > 0) {
      result = result.filter((m) => filters.opportunityState!.includes(m.opportunityState));
    }
    if (filters?.caseStudyId) {
      if (filters.caseStudyId === 'cs1') {
        result = result.filter((m) => m.id.includes('CS1'));
      } else if (filters.caseStudyId === 'cs2') {
        result = result.filter((m) => m.id.includes('CS2'));
      } else if (filters.caseStudyId === 'cs3') {
        result = result.filter((m) => m.id.includes('CS3'));
      }
    }
    return result;
  }

  async getCalendar(year: number, month: number): Promise<CalendarDay[]> {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const filtered = mockCalendar.filter((d) => d.date.startsWith(prefix));
    return filtered.length > 0 ? filtered : mockCalendar;
  }

  async getFRPRecords(hotspotId?: string): Promise<FRPRecord[]> {
    if (hotspotId) {
      return mockFrpData.filter((r) => r.id === hotspotId);
    }
    return mockFrpData;
  }

  async getProvenance(granuleId?: string): Promise<ProvenanceRecord[]> {
    if (granuleId) {
      return mockProvenance.filter((p) => p.granuleId === granuleId);
    }
    return mockProvenance;
  }

  async getCaseStudies(): Promise<CaseStudyScenario[]> {
    return skhCaseStudies;
  }

  async getMatchMetrics(config: SensitivityConfig, _filters?: MatchFilters): Promise<MatchMetrics> {
    const baseCandidateCount = 11;
    const spatialFactor = config.spatialThresholdKm / 2.0;
    const temporalFactor = config.temporalThresholdMin / 30.0;
    const candidateCount = Math.round(baseCandidateCount * spatialFactor * temporalFactor);

    const precision = Math.min(
      0.98,
      Math.max(0.05, 0.72 + (5 - config.spatialThresholdKm) * 0.05 + (120 - config.temporalThresholdMin) * 0.001)
    );
    const recall = Math.min(
      0.95,
      Math.max(0.1, 0.55 + config.spatialThresholdKm * 0.06 + config.temporalThresholdMin * 0.003)
    );
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    return {
      candidateCount,
      precision,
      recall,
      f1,
    };
  }
}

// ---------------------------------------------------------------------------
// Real API implementation (placeholder)
// ---------------------------------------------------------------------------

class RealSKHRepository implements ISKHRepository {
  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
    return res.json() as Promise<T>;
  }

  async getHotspots(filters?: HotspotFilters): Promise<HOTSpot[]> {
    const params = new URLSearchParams();
    if (filters?.sensor) params.set('sensor', filters.sensor.join(','));
    if (filters?.dateFrom) params.set('date_from', filters.dateFrom);
    if (filters?.dateTo) params.set('date_to', filters.dateTo);
    if (filters?.caseStudyId) params.set('case_study_id', filters.caseStudyId);
    return this.get<HOTSpot[]>(`/hotspots?${params}`);
  }

  async getMatches(filters?: MatchFilters): Promise<CandidateMatch[]> {
    const params = new URLSearchParams();
    if (filters?.opportunityState) params.set('opportunity_state', filters.opportunityState.join(','));
    if (filters?.caseStudyId) params.set('case_study_id', filters.caseStudyId);
    return this.get<CandidateMatch[]>(`/matches?${params}`);
  }

  async getCalendar(year: number, month: number): Promise<CalendarDay[]> {
    return this.get<CalendarDay[]>(`/calendar?year=${year}&month=${month}`);
  }

  async getFRPRecords(hotspotId?: string): Promise<FRPRecord[]> {
    const path = hotspotId ? `/frp/${hotspotId}` : '/frp';
    return this.get<FRPRecord[]>(path);
  }

  async getProvenance(granuleId?: string): Promise<ProvenanceRecord[]> {
    const q = granuleId ? `?granule_id=${granuleId}` : '';
    return this.get<ProvenanceRecord[]>(`/provenance${q}`);
  }

  async getObservations(params: { bbox?: number[]; startUtc?: string; endUtc?: string; sensors?: DomainSensorType[]; includeNrt?: boolean }): Promise<CommonObservation[]> {
    const query = new URLSearchParams();
    if (params.bbox) query.set('bbox', params.bbox.join(','));
    if (params.startUtc) query.set('start_utc', params.startUtc);
    if (params.endUtc) query.set('end_utc', params.endUtc);
    if (params.sensors) query.set('sensors', params.sensors.join(','));
    if (params.includeNrt !== undefined) query.set('include_nrt', String(params.includeNrt));
    return this.get<CommonObservation[]>(`/observations?${query}`);
  }

  async getCandidateGraph(runId: string, caseId?: string): Promise<{ nodes: CommonObservation[]; edges: DomainCandidateAssociation[]; ambiguousGroups: string[][] }> {
    return this.get(`/candidate-graph/${encodeURIComponent(runId)}${caseId ? `?case_id=${encodeURIComponent(caseId)}` : ''}`);
  }

  async getBurningActivityCalendar(year: number, month?: number, gridKm?: number): Promise<DailyCalendarCell[]> {
    const query = new URLSearchParams({ year: String(year) });
    if (month !== undefined) query.set('month', String(month));
    if (gridKm !== undefined) query.set('grid_km', String(gridKm));
    return this.get<DailyCalendarCell[]>(`/burning-activity-calendar?${query}`);
  }

  async getFRPOperatorAnalysis(runId: string): Promise<{ points: FRPComparisonResult[]; metrics: { bias_mw: number; mae_mw: number; rmse_mw: number; symmetric_rd_pct: number } }> {
    return this.get(`/frp-operator-analysis/${encodeURIComponent(runId)}`);
  }

  async getSensitivityGrid() { return this.get<typeof sensitivityGrid>('/sensitivity-grid'); }
  async getProvenanceManifest(): Promise<RawAsset[]> { return this.get<RawAsset[]>('/provenance-manifest'); }

  async getCaseStudies(): Promise<CaseStudyScenario[]> {
    return this.get<CaseStudyScenario[]>('/case-studies');
  }

  async getMatchMetrics(config: SensitivityConfig, filters?: MatchFilters): Promise<MatchMetrics> {
    const res = await fetch(`${API_BASE}/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config, filters }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}: /metrics`);
    return res.json() as Promise<MatchMetrics>;
  }
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------

export const skhApi: ISKHRepository = USE_MOCK_DATA
  ? new MockSKHRepository()
  : new RealSKHRepository();
