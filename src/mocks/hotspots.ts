import type { HOTSpot } from '../types';

// Helper: create a rectangular GeoJSON polygon footprint
function makeFootprint(
  lat: number,
  lon: number,
  halfDegLat: number,
  halfDegLon: number
): object {
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [lon - halfDegLon, lat - halfDegLat],
          [lon + halfDegLon, lat - halfDegLat],
          [lon + halfDegLon, lat + halfDegLat],
          [lon - halfDegLon, lat + halfDegLat],
          [lon - halfDegLon, lat - halfDegLat],
        ],
      ],
    },
    properties: {},
  };
}

// MODIS 1 km pixel: ~0.009° per side → half = 0.0045°
const MODIS_HALF = 0.0045;
// VIIRS 375 m pixel: ~0.00338° per side → half = 0.00169°
const VIIRS_HALF = 0.00169;

const hotspots: HOTSpot[] = [
  // ===================================================================
  // CASE 1: Punjab agricultural burns — Many-to-Many (2023-10-28)
  // 2 MODIS pixels + 9 VIIRS pixels across same ~1800 ha cluster
  // ===================================================================

  // --- MODIS Terra overpass ~05:30 UTC ---
  {
    id: 'M1-CS1-01',
    sensor: 'MODIS_TERRA',
    lat: 30.612,
    lon: 74.981,
    frp: 87.3,
    brightness: 326.8,
    confidence: 85,
    acqDate: '2023-10-28',
    acqTime: '0530',
    dayNight: 'D',
    collection: '6.1',
    processing: 'Standard',
    granuleId: 'MOD14A1.A2023301.h24v05.061',
    footprintType: 'actual',
    footprintGeoJSON: makeFootprint(30.612, 74.981, MODIS_HALF, MODIS_HALF),
  },
  // --- MODIS Aqua overpass ~08:00 UTC ---
  {
    id: 'M2-CS1-02',
    sensor: 'MODIS_AQUA',
    lat: 30.638,
    lon: 75.023,
    frp: 102.1,
    brightness: 334.2,
    confidence: 92,
    acqDate: '2023-10-28',
    acqTime: '0800',
    dayNight: 'D',
    collection: '6.1',
    processing: 'Standard',
    granuleId: 'MYD14A1.A2023301.h24v05.061',
    footprintType: 'actual',
    footprintGeoJSON: makeFootprint(30.638, 75.023, MODIS_HALF, MODIS_HALF),
  },

  // --- VIIRS S-NPP overpass ~07:12 UTC (3 pixels overlapping M1) ---
  {
    id: 'V1-CS1-01',
    sensor: 'VIIRS_SNPP',
    lat: 30.608,
    lon: 74.976,
    frp: 11.2,
    brightness: 318.4,
    confidence: 'nominal',
    acqDate: '2023-10-28',
    acqTime: '0712',
    dayNight: 'D',
    collection: '2',
    processing: 'Standard',
    granuleId: 'VNP14IMG.A2023301.0712.002',
    footprintType: 'actual',
    footprintGeoJSON: makeFootprint(30.608, 74.976, VIIRS_HALF, VIIRS_HALF),
  },
  {
    id: 'V2-CS1-02',
    sensor: 'VIIRS_SNPP',
    lat: 30.613,
    lon: 74.983,
    frp: 9.8,
    brightness: 315.9,
    confidence: 'nominal',
    acqDate: '2023-10-28',
    acqTime: '0712',
    dayNight: 'D',
    collection: '2',
    processing: 'Standard',
    granuleId: 'VNP14IMG.A2023301.0712.002',
    footprintType: 'actual',
    footprintGeoJSON: makeFootprint(30.613, 74.983, VIIRS_HALF, VIIRS_HALF),
  },
  {
    id: 'V3-CS1-03',
    sensor: 'VIIRS_SNPP',
    lat: 30.619,
    lon: 74.979,
    frp: 13.4,
    brightness: 321.2,
    confidence: 'high',
    acqDate: '2023-10-28',
    acqTime: '0712',
    dayNight: 'D',
    collection: '2',
    processing: 'Standard',
    granuleId: 'VNP14IMG.A2023301.0712.002',
    footprintType: 'actual',
    footprintGeoJSON: makeFootprint(30.619, 74.979, VIIRS_HALF, VIIRS_HALF),
  },

  // --- VIIRS NOAA-20 overpass ~08:24 UTC (3 pixels overlapping M2) ---
  {
    id: 'V4-CS1-04',
    sensor: 'VIIRS_NOAA20',
    lat: 30.631,
    lon: 75.018,
    frp: 10.5,
    brightness: 317.6,
    confidence: 'nominal',
    acqDate: '2023-10-28',
    acqTime: '0824',
    dayNight: 'D',
    collection: '2',
    processing: 'Standard',
    granuleId: 'VJ114IMG.A2023301.0824.002',
    footprintType: 'actual',
    footprintGeoJSON: makeFootprint(30.631, 75.018, VIIRS_HALF, VIIRS_HALF),
  },
  {
    id: 'V5-CS1-05',
    sensor: 'VIIRS_NOAA20',
    lat: 30.636,
    lon: 75.025,
    frp: 12.1,
    brightness: 319.8,
    confidence: 'nominal',
    acqDate: '2023-10-28',
    acqTime: '0824',
    dayNight: 'D',
    collection: '2',
    processing: 'Standard',
    granuleId: 'VJ114IMG.A2023301.0824.002',
    footprintType: 'actual',
    footprintGeoJSON: makeFootprint(30.636, 75.025, VIIRS_HALF, VIIRS_HALF),
  },
  {
    id: 'V6-CS1-06',
    sensor: 'VIIRS_NOAA20',
    lat: 30.641,
    lon: 75.021,
    frp: 8.9,
    brightness: 314.3,
    confidence: 'low',
    acqDate: '2023-10-28',
    acqTime: '0824',
    dayNight: 'D',
    collection: '2',
    processing: 'Standard',
    granuleId: 'VJ114IMG.A2023301.0824.002',
    footprintType: 'actual',
    footprintGeoJSON: makeFootprint(30.641, 75.021, VIIRS_HALF, VIIRS_HALF),
  },

  // --- VIIRS NOAA-21 overpass ~09:01 UTC (3 pixels across both M1+M2) ---
  {
    id: 'V7-CS1-07',
    sensor: 'VIIRS_NOAA21',
    lat: 30.615,
    lon: 74.988,
    frp: 15.6,
    brightness: 323.1,
    confidence: 'high',
    acqDate: '2023-10-28',
    acqTime: '0901',
    dayNight: 'D',
    collection: '2',
    processing: 'NRT',
    granuleId: 'VJ214IMG.A2023301.0901.002',
    footprintType: 'actual',
    footprintGeoJSON: makeFootprint(30.615, 74.988, VIIRS_HALF, VIIRS_HALF),
  },
  {
    id: 'V8-CS1-08',
    sensor: 'VIIRS_NOAA21',
    lat: 30.628,
    lon: 75.012,
    frp: 11.8,
    brightness: 318.9,
    confidence: 'nominal',
    acqDate: '2023-10-28',
    acqTime: '0901',
    dayNight: 'D',
    collection: '2',
    processing: 'NRT',
    granuleId: 'VJ214IMG.A2023301.0901.002',
    footprintType: 'actual',
    footprintGeoJSON: makeFootprint(30.628, 75.012, VIIRS_HALF, VIIRS_HALF),
  },
  {
    id: 'V9-CS1-09',
    sensor: 'VIIRS_NOAA21',
    lat: 30.644,
    lon: 75.028,
    frp: 7.3,
    brightness: 312.1,
    confidence: 'nominal',
    acqDate: '2023-10-28',
    acqTime: '0901',
    dayNight: 'D',
    collection: '2',
    processing: 'NRT',
    granuleId: 'VJ214IMG.A2023301.0901.002',
    footprintType: 'actual',
    footprintGeoJSON: makeFootprint(30.644, 75.028, VIIRS_HALF, VIIRS_HALF),
  },

  // ===================================================================
  // CASE 2: Mato Grosso forest fire — Cloud-Obscured MODIS (2023-08-15)
  // MODIS Terra overpass cloud fraction 0.94 → 0 hotspot records
  // 14 VIIRS detections across 3 overpasses under partial clearance
  // ===================================================================

  // --- VIIRS S-NPP overpass ~14:02 UTC (4 pixels) ---
  { id: 'V10-CS2-01', sensor: 'VIIRS_SNPP', lat: -12.234, lon: -54.312, frp: 28.4, brightness: 338.2, confidence: 'high', acqDate: '2023-08-15', acqTime: '1402', dayNight: 'D', collection: '2', processing: 'Standard', granuleId: 'VNP14IMG.A2023227.1402.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.234, -54.312, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V11-CS2-02', sensor: 'VIIRS_SNPP', lat: -12.241, lon: -54.318, frp: 35.7, brightness: 341.6, confidence: 'high', acqDate: '2023-08-15', acqTime: '1402', dayNight: 'D', collection: '2', processing: 'Standard', granuleId: 'VNP14IMG.A2023227.1402.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.241, -54.318, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V12-CS2-03', sensor: 'VIIRS_SNPP', lat: -12.248, lon: -54.308, frp: 42.1, brightness: 345.3, confidence: 'high', acqDate: '2023-08-15', acqTime: '1402', dayNight: 'D', collection: '2', processing: 'Standard', granuleId: 'VNP14IMG.A2023227.1402.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.248, -54.308, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V13-CS2-04', sensor: 'VIIRS_SNPP', lat: -12.255, lon: -54.323, frp: 31.8, brightness: 339.7, confidence: 'nominal', acqDate: '2023-08-15', acqTime: '1402', dayNight: 'D', collection: '2', processing: 'Standard', granuleId: 'VNP14IMG.A2023227.1402.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.255, -54.323, VIIRS_HALF, VIIRS_HALF) },

  // --- VIIRS NOAA-20 overpass ~14:28 UTC (5 pixels, 47 min after MODIS Terra) ---
  { id: 'V14-CS2-05', sensor: 'VIIRS_NOAA20', lat: -12.238, lon: -54.315, frp: 29.3, brightness: 337.9, confidence: 'nominal', acqDate: '2023-08-15', acqTime: '1428', dayNight: 'D', collection: '2', processing: 'Standard', granuleId: 'VJ114IMG.A2023227.1428.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.238, -54.315, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V15-CS2-06', sensor: 'VIIRS_NOAA20', lat: -12.244, lon: -54.321, frp: 38.2, brightness: 342.8, confidence: 'high', acqDate: '2023-08-15', acqTime: '1428', dayNight: 'D', collection: '2', processing: 'Standard', granuleId: 'VJ114IMG.A2023227.1428.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.244, -54.321, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V16-CS2-07', sensor: 'VIIRS_NOAA20', lat: -12.251, lon: -54.311, frp: 44.7, brightness: 346.2, confidence: 'high', acqDate: '2023-08-15', acqTime: '1428', dayNight: 'D', collection: '2', processing: 'Standard', granuleId: 'VJ114IMG.A2023227.1428.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.251, -54.311, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V17-CS2-08', sensor: 'VIIRS_NOAA20', lat: -12.258, lon: -54.326, frp: 33.5, brightness: 340.1, confidence: 'nominal', acqDate: '2023-08-15', acqTime: '1428', dayNight: 'D', collection: '2', processing: 'Standard', granuleId: 'VJ114IMG.A2023227.1428.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.258, -54.326, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V18-CS2-09', sensor: 'VIIRS_NOAA20', lat: -12.228, lon: -54.302, frp: 26.9, brightness: 336.5, confidence: 'nominal', acqDate: '2023-08-15', acqTime: '1428', dayNight: 'D', collection: '2', processing: 'Standard', granuleId: 'VJ114IMG.A2023227.1428.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.228, -54.302, VIIRS_HALF, VIIRS_HALF) },

  // --- VIIRS NOAA-21 overpass ~14:49 UTC (5 pixels) ---
  { id: 'V19-CS2-10', sensor: 'VIIRS_NOAA21', lat: -12.236, lon: -54.317, frp: 31.1, brightness: 339.4, confidence: 'nominal', acqDate: '2023-08-15', acqTime: '1449', dayNight: 'D', collection: '2', processing: 'NRT', granuleId: 'VJ214IMG.A2023227.1449.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.236, -54.317, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V20-CS2-11', sensor: 'VIIRS_NOAA21', lat: -12.243, lon: -54.313, frp: 37.8, brightness: 342.4, confidence: 'high', acqDate: '2023-08-15', acqTime: '1449', dayNight: 'D', collection: '2', processing: 'NRT', granuleId: 'VJ214IMG.A2023227.1449.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.243, -54.313, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V21-CS2-12', sensor: 'VIIRS_NOAA21', lat: -12.249, lon: -54.320, frp: 41.3, brightness: 344.9, confidence: 'high', acqDate: '2023-08-15', acqTime: '1449', dayNight: 'D', collection: '2', processing: 'NRT', granuleId: 'VJ214IMG.A2023227.1449.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.249, -54.320, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V22-CS2-13', sensor: 'VIIRS_NOAA21', lat: -12.256, lon: -54.308, frp: 28.7, brightness: 337.2, confidence: 'nominal', acqDate: '2023-08-15', acqTime: '1449', dayNight: 'D', collection: '2', processing: 'NRT', granuleId: 'VJ214IMG.A2023227.1449.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.256, -54.308, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V23-CS2-14', sensor: 'VIIRS_NOAA21', lat: -12.263, lon: -54.325, frp: 24.5, brightness: 334.8, confidence: 'nominal', acqDate: '2023-08-15', acqTime: '1449', dayNight: 'D', collection: '2', processing: 'NRT', granuleId: 'VJ214IMG.A2023227.1449.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(-12.263, -54.325, VIIRS_HALF, VIIRS_HALF) },

  // ===================================================================
  // CASE 3: California chaparral prescribed burn — Sub-Threshold (2024-03-12)
  // MODIS detects 0 (FRP 3–6 MW < 5.7 MW detection limit at 1 km daytime)
  // 6 VIIRS 375-m pixels detect all sub-threshold hotspots (nighttime pass)
  // ===================================================================

  // --- VIIRS S-NPP overpass ~21:24 UTC (3 pixels) ---
  { id: 'V24-CS3-01', sensor: 'VIIRS_SNPP', lat: 37.124, lon: -119.843, frp: 3.1, brightness: 302.4, confidence: 'low', acqDate: '2024-03-12', acqTime: '2124', dayNight: 'N', collection: '2', processing: 'Standard', granuleId: 'VNP14IMG.A2024072.2124.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(37.124, -119.843, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V25-CS3-02', sensor: 'VIIRS_SNPP', lat: 37.129, lon: -119.838, frp: 4.7, brightness: 305.8, confidence: 'nominal', acqDate: '2024-03-12', acqTime: '2124', dayNight: 'N', collection: '2', processing: 'Standard', granuleId: 'VNP14IMG.A2024072.2124.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(37.129, -119.838, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V26-CS3-03', sensor: 'VIIRS_SNPP', lat: 37.134, lon: -119.847, frp: 5.9, brightness: 308.3, confidence: 'nominal', acqDate: '2024-03-12', acqTime: '2124', dayNight: 'N', collection: '2', processing: 'Standard', granuleId: 'VNP14IMG.A2024072.2124.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(37.134, -119.847, VIIRS_HALF, VIIRS_HALF) },

  // --- VIIRS NOAA-20 overpass ~21:41 UTC (3 pixels) ---
  { id: 'V27-CS3-04', sensor: 'VIIRS_NOAA20', lat: 37.126, lon: -119.841, frp: 3.8, brightness: 303.7, confidence: 'low', acqDate: '2024-03-12', acqTime: '2141', dayNight: 'N', collection: '2', processing: 'Standard', granuleId: 'VJ114IMG.A2024072.2141.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(37.126, -119.841, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V28-CS3-05', sensor: 'VIIRS_NOAA20', lat: 37.131, lon: -119.845, frp: 4.2, brightness: 304.9, confidence: 'nominal', acqDate: '2024-03-12', acqTime: '2141', dayNight: 'N', collection: '2', processing: 'Standard', granuleId: 'VJ114IMG.A2024072.2141.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(37.131, -119.845, VIIRS_HALF, VIIRS_HALF) },
  { id: 'V29-CS3-06', sensor: 'VIIRS_NOAA20', lat: 37.137, lon: -119.839, frp: 5.4, brightness: 307.6, confidence: 'nominal', acqDate: '2024-03-12', acqTime: '2141', dayNight: 'N', collection: '2', processing: 'Standard', granuleId: 'VJ114IMG.A2024072.2141.002', footprintType: 'actual', footprintGeoJSON: makeFootprint(37.137, -119.839, VIIRS_HALF, VIIRS_HALF) },
];

export default hotspots;
