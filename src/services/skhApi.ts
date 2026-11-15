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
  CaseStudy,
  SensitivityConfig,
  MatchMetrics,
  HotspotFilters,
  MatchFilters,
} from '../types';

import mockHotspots from '../mocks/hotspots.ts';
import mockCalendar from '../mocks/calendar.ts';
import mockFrpData from '../mocks/frpData.ts';
import mockProvenance from '../mocks/provenance.ts';
import mockCaseStudies from '../mocks/caseStudies.ts';
import mockCandidateMatches from '../mocks/candidateMatches.ts';

export const USE_MOCK_DATA = true;
const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE) || 'http://localhost:8000';

// ---------------------------------------------------------------------------
// Repository interface
// ---------------------------------------------------------------------------

export interface ISKHRepository {
  getHotspots(filters?: HotspotFilters): Promise<HOTSpot[]>;
  getMatches(filters?: MatchFilters): Promise<CandidateMatch[]>;
  getCalendar(year: number, month: number): Promise<CalendarDay[]>;
  getFRPRecords(hotspotId?: string): Promise<FRPRecord[]>;
  getProvenance(granuleId?: string): Promise<ProvenanceRecord[]>;
  getCaseStudies(): Promise<CaseStudy[]>;
  getMatchMetrics(config: SensitivityConfig, filters?: MatchFilters): Promise<MatchMetrics>;
}

// ---------------------------------------------------------------------------
// Mock implementation
// ---------------------------------------------------------------------------

class MockSKHRepository implements ISKHRepository {
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

  async getCaseStudies(): Promise<CaseStudy[]> {
    return mockCaseStudies;
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

  async getCaseStudies(): Promise<CaseStudy[]> {
    return this.get<CaseStudy[]>('/case-studies');
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
