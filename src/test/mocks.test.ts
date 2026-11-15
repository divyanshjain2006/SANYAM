import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import hotspots from '../mocks/hotspots.ts';
import calendar from '../mocks/calendar.ts';
import frpData from '../mocks/frpData.ts';
import provenance from '../mocks/provenance.ts';
import caseStudies from '../mocks/caseStudies.ts';
import candidateMatches from '../mocks/candidateMatches.ts';

describe('SANYAM Mock Datasets Scientific Integrity', () => {
  it('Hotspots: contains at least 25 realistic satellite records', () => {
    assert.ok(hotspots.length >= 25, `Expected >= 25 hotspots, got ${hotspots.length}`);
  });

  it('Hotspots: all records have valid coordinates, sensor IDs, and positive FRP', () => {
    const validSensors = [
      'MODIS_TERRA',
      'MODIS_AQUA',
      'VIIRS_SNPP',
      'VIIRS_NOAA20',
      'VIIRS_NOAA21',
    ];

    for (const h of hotspots) {
      assert.ok(validSensors.includes(h.sensor), `Invalid sensor: ${h.sensor}`);
      assert.ok(h.lat >= -90 && h.lat <= 90, `Lat out of range: ${h.lat}`);
      assert.ok(h.lon >= -180 && h.lon <= 180, `Lon out of range: ${h.lon}`);
      assert.ok(h.frp > 0, `FRP must be positive: ${h.frp}`);
      assert.ok(h.brightness >= 250 && h.brightness <= 500, `BT out of plausible range: ${h.brightness}`);
      assert.ok(['D', 'N'].includes(h.dayNight), `Invalid dayNight: ${h.dayNight}`);
      assert.ok(['6.1', '2'].includes(h.collection), `Invalid collection: ${h.collection}`);
      assert.ok(['Standard', 'NRT'].includes(h.processing), `Invalid processing tier: ${h.processing}`);
      assert.ok(h.footprintGeoJSON && (h.footprintGeoJSON as any).type === 'Feature', 'Footprint must be a GeoJSON Feature');
    }
  });

  it('Hotspots: Case 1 (Punjab) includes 2 MODIS and 9 VIIRS hotspots', () => {
    const cs1 = hotspots.filter((h) => h.id.includes('CS1'));
    const modis = cs1.filter((h) => h.sensor.includes('MODIS'));
    const viirs = cs1.filter((h) => h.sensor.includes('VIIRS'));

    assert.equal(modis.length, 2, `Expected 2 MODIS hotspots in CS1, got ${modis.length}`);
    assert.equal(viirs.length, 9, `Expected 9 VIIRS hotspots in CS1, got ${viirs.length}`);
  });

  it('Hotspots: Case 2 (Mato Grosso) includes 14 VIIRS active fire detections', () => {
    const cs2 = hotspots.filter((h) => h.id.includes('CS2'));
    assert.equal(cs2.length, 14, `Expected 14 VIIRS hotspots in CS2, got ${cs2.length}`);
    for (const h of cs2) {
      assert.ok(h.sensor.includes('VIIRS'), 'CS2 should be VIIRS detections under partial clearance');
    }
  });

  it('Hotspots: Case 3 (California) fires are below MODIS 5.7 MW daytime detection limit', () => {
    const cs3 = hotspots.filter((h) => h.id.includes('CS3'));
    assert.ok(cs3.length >= 6, `Expected >= 6 VIIRS hotspots in CS3, got ${cs3.length}`);
    for (const h of cs3) {
      assert.ok(
        h.frp < 6.0,
        `Expected sub-threshold FRP (<6.0 MW), got ${h.frp} MW for hotspot ${h.id}`
      );
    }
  });

  it('Calendar: fractions are physically bounded [0, 1] and sum to ~1.0', () => {
    assert.ok(calendar.length >= 60, `Expected >= 60 calendar days, got ${calendar.length}`);

    for (const d of calendar) {
      assert.ok(d.validAreaFraction >= 0 && d.validAreaFraction <= 1, `Invalid validAreaFraction: ${d.validAreaFraction}`);
      assert.ok(d.cloudObscuredFraction >= 0 && d.cloudObscuredFraction <= 1, `Invalid cloudObscuredFraction: ${d.cloudObscuredFraction}`);
      assert.ok(d.outsideSwathFraction >= 0 && d.outsideSwathFraction <= 1, `Invalid outsideSwathFraction: ${d.outsideSwathFraction}`);
      const sum = d.validAreaFraction + d.cloudObscuredFraction + d.outsideSwathFraction;
      assert.ok(Math.abs(sum - 1.0) < 0.15, `Fractions must sum to ~1.0, got ${sum} for ${d.date}`);
    }
  });

  it('Calendar: distinguishes Valid Non-Detection from Cloud-Obscured days', () => {
    const validNonDetections = calendar.filter(
      (d) => d.thermalActivityCount === 0 && d.validAreaFraction >= 0.8
    );
    const cloudObscured = calendar.filter(
      (d) => d.thermalActivityCount === 0 && d.cloudObscuredFraction >= 0.5
    );

    assert.ok(validNonDetections.length > 0, 'Must have at least one valid non-detection day');
    assert.ok(cloudObscured.length > 0, 'Must have at least one cloud-obscured day');
  });

  it('FRP Data: exactly 80 calibrated records with sensor-dependent pixel areas', () => {
    assert.equal(frpData.length, 80, `Expected 80 FRP records, got ${frpData.length}`);

    for (const r of frpData) {
      assert.ok(r.rawFRP > 0 && r.adjustedFRP > 0, 'FRP must be strictly positive');
      if (r.sensor.includes('MODIS')) {
        assert.equal(r.pixelArea, 1.0, 'MODIS nadir pixel area must be 1.0 km²');
      } else {
        assert.ok(Math.abs(r.pixelArea - 0.141) < 0.01, 'VIIRS nadir pixel area must be ~0.141 km²');
      }
    }
  });

  it('Provenance: all 10 catalog granules have 64-char SHA-256 hashes and valid QA', () => {
    assert.equal(provenance.length, 10, `Expected 10 provenance granules, got ${provenance.length}`);

    for (const p of provenance) {
      assert.equal(p.sha256.length, 64, `SHA-256 must be 64 hex chars, got ${p.sha256.length}`);
      assert.match(p.sha256, /^[0-9a-f]{64}$/i, `Invalid SHA-256 format for granule ${p.granuleId}`);
      assert.ok(['pass', 'flag', 'fail'].includes(p.qaStatus), `Invalid QA status: ${p.qaStatus}`);
      assert.ok(p.hotspotCount >= 0, 'Hotspot count must be non-negative');
    }
  });

  it('Candidate Matches: includes bipartite containment metrics IoU and Os', () => {
    assert.ok(candidateMatches.length >= 4, `Expected >= 4 candidate match entries, got ${candidateMatches.length}`);

    for (const m of candidateMatches) {
      assert.ok(m.iou >= 0 && m.iou <= 1, `IoU must be in [0, 1], got ${m.iou}`);
      assert.ok(
        m.smallerFootprintOverlap >= 0 && m.smallerFootprintOverlap <= 1,
        `Smaller-Footprint Overlap (Os) must be in [0, 1], got ${m.smallerFootprintOverlap}`
      );
      assert.ok(
        ['valid_clear_sky', 'cloud_obscured', 'outside_swath'].includes(m.opportunityState),
        `Invalid opportunity state: ${m.opportunityState}`
      );
    }
  });

  it('Case Studies: has 3 predefined challenge scenarios', () => {
    assert.equal(caseStudies.length, 3);
    assert.equal(caseStudies[0].id, 'cs1');
    assert.equal(caseStudies[1].id, 'cs2');
    assert.equal(caseStudies[2].id, 'cs3');
  });
});
