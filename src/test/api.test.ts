import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { skhApi, USE_MOCK_DATA } from '../services/skhApi.ts';

describe('SANYAM ISKHRepository Service Contract & Backend Readiness', () => {
  it('USE_MOCK_DATA is true for standalone operation', () => {
    assert.equal(USE_MOCK_DATA, true, 'Default configuration should use mock repository');
  });

  it('skhApi implements ISKHRepository interface methods', () => {
    assert.equal(typeof skhApi.getHotspots, 'function');
    assert.equal(typeof skhApi.getMatches, 'function');
    assert.equal(typeof skhApi.getCalendar, 'function');
    assert.equal(typeof skhApi.getFRPRecords, 'function');
    assert.equal(typeof skhApi.getProvenance, 'function');
    assert.equal(typeof skhApi.getCaseStudies, 'function');
    assert.equal(typeof skhApi.getMatchMetrics, 'function');
  });

  it('getHotspots: retrieves unfiltered and filtered datasets', async () => {
    const all = await skhApi.getHotspots();
    assert.ok(all.length >= 25, 'Unfiltered hotspots should return complete dataset');

    const cs1Only = await skhApi.getHotspots({ caseStudyId: 'cs1' });
    assert.equal(cs1Only.length, 11, 'CS1 filter should return exactly 11 hotspots (2 MODIS + 9 VIIRS)');
    for (const h of cs1Only) {
      assert.ok(h.id.includes('CS1'), `Hotspot ${h.id} should belong to CS1`);
    }

    const terraOnly = await skhApi.getHotspots({ sensor: ['MODIS_TERRA'] });
    for (const h of terraOnly) {
      assert.equal(h.sensor, 'MODIS_TERRA');
    }
  });

  it('getMatches: returns candidate associations with opportunity states', async () => {
    const matches = await skhApi.getMatches();
    assert.ok(matches.length >= 4, 'Should return candidate match scenarios');

    const clearSky = await skhApi.getMatches({ opportunityState: ['valid_clear_sky'] });
    for (const m of clearSky) {
      assert.equal(m.opportunityState, 'valid_clear_sky');
    }

    const cs2Matches = await skhApi.getMatches({ caseStudyId: 'cs2' });
    assert.equal(cs2Matches.length, 1);
    assert.equal(cs2Matches[0].opportunityState, 'cloud_obscured');
  });

  it('getCalendar: returns monthly observation opportunities', async () => {
    const oct2023 = await skhApi.getCalendar(2023, 10);
    assert.ok(oct2023.length > 0, 'Should return October 2023 days');
    for (const day of oct2023) {
      assert.match(day.date, /^2023-10-/);
    }
  });

  it('getCaseStudies: returns all 3 challenge demonstration cases', async () => {
    const cases = await skhApi.getCaseStudies();
    assert.equal(cases.length, 3);
    const ids = cases.map((c) => c.id);
    assert.ok(ids.includes('cs1') && ids.includes('cs2') && ids.includes('cs3'));
  });

  it('getMatchMetrics: demonstrates sensitivity parameter trade-off', async () => {
    const strictConfig = {
      spatialThresholdKm: 1.0,
      temporalThresholdMin: 15,
      gridSizeKm: 0.5,
    };
    const relaxedConfig = {
      spatialThresholdKm: 4.0,
      temporalThresholdMin: 60,
      gridSizeKm: 2.0,
    };

    const strictMetrics = await skhApi.getMatchMetrics(strictConfig);
    const relaxedMetrics = await skhApi.getMatchMetrics(relaxedConfig);

    assert.ok(strictMetrics.precision >= relaxedMetrics.precision, 'Strict spatial-temporal window should have >= precision');
    assert.ok(relaxedMetrics.recall >= strictMetrics.recall, 'Relaxed window should achieve >= recall');
    assert.ok(relaxedMetrics.candidateCount > strictMetrics.candidateCount, 'Relaxed window should find more candidate matches');
  });

  it('getProvenance: returns verified NASA granule records', async () => {
    const records = await skhApi.getProvenance();
    assert.equal(records.length, 10);

    const single = await skhApi.getProvenance('MOD14A1.A2023301.h24v05.061');
    assert.equal(single.length, 1);
    assert.equal(single[0].sensor, 'MODIS Terra MOD14');
  });
});
