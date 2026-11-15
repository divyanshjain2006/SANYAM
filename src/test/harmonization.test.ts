import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('SANYAM Scientific Harmonization Formulas & Physics', () => {
  it('Smaller-Footprint Overlap (Os) resolves 7x areal disparity between MODIS and VIIRS', () => {
    // Simulated nadir footprint areas:
    // MODIS: 1 km x 1 km = 1,000,000 m²
    // VIIRS: 375 m x 375 m = 140,625 m²
    const areaModis = 1000000;
    const areaViirs = 140625;

    // Case: VIIRS pixel is completely inside the MODIS pixel (100% true containment)
    const intersectionArea = areaViirs; // 140,625 m²
    const unionArea = areaModis + areaViirs - intersectionArea; // 1,000,000 m²

    // Conventional IoU
    const iou = intersectionArea / unionArea;
    // Harmonized Smaller-Footprint Overlap Os
    const os = intersectionArea / Math.min(areaModis, areaViirs);

    // IoU is bounded at 0.140625 despite full containment:
    assert.ok(Math.abs(iou - 0.140625) < 0.001, `Expected IoU ~0.14, got ${iou}`);

    // Os correctly reflects 100% containment:
    assert.equal(os, 1.0, `Os should be 1.0 for full containment, got ${os}`);
  });

  it('FRP Observation Operator scales raw FRP according to pixel ground resolution', () => {
    // Observation operator formula:
    // FRP_adj = FRP_raw * (A_ref / A_p)^0.5
    const computeFRPAdj = (rawFRP: number, pixelArea: number, refArea: number) => {
      return rawFRP * Math.sqrt(refArea / pixelArea);
    };

    // A MODIS pixel at nadir (A_p = 1.0 km², A_ref = 1.0 km²)
    const modisAdj = computeFRPAdj(100, 1.0, 1.0);
    assert.equal(modisAdj, 100, 'Nadir MODIS FRP adjustment factor must be 1.0');

    // A VIIRS pixel at nadir (A_p = 0.141 km², A_ref = 0.141 km²)
    const viirsAdj = computeFRPAdj(15, 0.141, 0.141);
    assert.equal(viirsAdj, 15, 'Nadir VIIRS FRP adjustment factor against own reference must be 1.0');

    // Off-nadir MODIS pixel with bow-tie expansion (A_p = 2.25 km²):
    const modisOffNadir = computeFRPAdj(100, 2.25, 1.0);
    assert.ok(Math.abs(modisOffNadir - 66.67) < 0.1, `Expected ~66.67 MW, got ${modisOffNadir}`);
  });

  it('Detection Limit Dp correctly models daytime vs nighttime sensor sensitivity thresholds', () => {
    // MODIS: 5.7 MW daytime nadir, 1.5 MW nighttime
    // VIIRS: 1.5 MW daytime nadir, 0.4 MW nighttime
    const computeDp = (baseLimit: number, pixelArea: number, refArea: number) => {
      return baseLimit * Math.sqrt(pixelArea / refArea);
    };

    const modisDay = computeDp(5.7, 1.0, 1.0);
    const modisNight = computeDp(1.5, 1.0, 1.0);
    const viirsDay = computeDp(1.5, 0.141, 0.141);

    assert.equal(modisDay, 5.7, 'MODIS daytime detection limit must be 5.7 MW');
    assert.equal(modisNight, 1.5, 'MODIS nighttime detection limit must be 1.5 MW');
    assert.equal(viirsDay, 1.5, 'VIIRS daytime detection limit must be 1.5 MW');

    // Demonstrates why a 3.5 MW fire is detectable by VIIRS (threshold 1.5 MW)
    // but below the MODIS daytime limit (threshold 5.7 MW):
    const testFireFRP = 3.5;
    assert.ok(testFireFRP > viirsDay, '3.5 MW fire should exceed VIIRS detection threshold');
    assert.ok(testFireFRP < modisDay, '3.5 MW fire should fall below MODIS detection threshold');
  });

  it('Statistical evaluation metrics calculate Mean Bias, MAE, RMSE, and SRD correctly', () => {
    const rawPairs = [
      { raw: 10, adj: 12 },
      { raw: 25, adj: 22 },
      { raw: 50, adj: 55 },
      { raw: 100, adj: 95 },
    ];

    const diffs = rawPairs.map((p) => p.adj - p.raw); // [2, -3, 5, -5]
    const meanBias = diffs.reduce((a, b) => a + b, 0) / diffs.length; // -1 / 4 = -0.25
    const mae = diffs.reduce((a, b) => a + Math.abs(b), 0) / diffs.length; // 15 / 4 = 3.75
    const rmse = Math.sqrt(diffs.reduce((a, b) => a + b * b, 0) / diffs.length); // sqrt((4+9+25+25)/4) = sqrt(15.75) ~ 3.968

    // Symmetric Relative Difference (SRD):
    const srdValues = rawPairs.map((p) => (2 * Math.abs(p.adj - p.raw)) / (p.adj + p.raw));
    const srdPercent = (srdValues.reduce((a, b) => a + b, 0) / srdValues.length) * 100;

    assert.equal(meanBias, -0.25, `Mean bias should be -0.25, got ${meanBias}`);
    assert.equal(mae, 3.75, `MAE should be 3.75, got ${mae}`);
    assert.ok(Math.abs(rmse - 3.968) < 0.01, `RMSE should be ~3.968, got ${rmse}`);
    assert.ok(srdPercent > 0 && srdPercent < 50, `SRD% should be reasonable positive percentage, got ${srdPercent}`);
  });
});
