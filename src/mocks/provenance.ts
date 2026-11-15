import type { ProvenanceRecord } from '../types';

/**
 * Provenance manifest of satellite data granules referenced in SANYAM hotspot datasets.
 * Includes MODIS (Collection 6.1) and VIIRS (Collection 2) standard and NRT granules
 * with cryptographic SHA-256 integrity hashes, QA verification statuses, and hotspot counts.
 */
export const provenance: ProvenanceRecord[] = [
  // --- Case Study 1: Punjab agricultural fires (2023-10-28) ---
  {
    granuleId: 'MOD14A1.A2023301.h24v05.061',
    sensor: 'MODIS Terra MOD14',
    collection: '6.1',
    processing: 'Standard',
    acqDate: '2023-10-28',
    sha256: 'e3c8d7b333b223ecf5298e825a08b8170de478f8556c77b925d56261517add74',
    qaStatus: 'pass',
    hotspotCount: 1,
  },
  {
    granuleId: 'MYD14A1.A2023301.h24v05.061',
    sensor: 'MODIS Aqua MYD14',
    collection: '6.1',
    processing: 'Standard',
    acqDate: '2023-10-28',
    sha256: '4c6b68017b65080c15cbc0330d7cd0be5262dd434314a440674de94a0f769812',
    qaStatus: 'pass',
    hotspotCount: 1,
  },
  {
    granuleId: 'VNP14IMG.A2023301.0712.002',
    sensor: 'VIIRS S-NPP VNP14IMG',
    collection: '2',
    processing: 'Standard',
    acqDate: '2023-10-28',
    sha256: 'e7ab79b57b7978d8127c19fcda6045264d18f2e35f543ab4251b6d83b02ff744',
    qaStatus: 'pass',
    hotspotCount: 3,
  },
  {
    granuleId: 'VJ114IMG.A2023301.0824.002',
    sensor: 'VIIRS NOAA-20 VJ114IMG',
    collection: '2',
    processing: 'Standard',
    acqDate: '2023-10-28',
    sha256: '628d06ba5cac5cf22da1bb71bd48a11f422c6dbb18eaa5bbb9385009d1036755',
    qaStatus: 'pass',
    hotspotCount: 3,
  },
  {
    granuleId: 'VJ214IMG.A2023301.0901.002',
    sensor: 'VIIRS NOAA-21 VJ214IMG',
    collection: '2',
    processing: 'NRT',
    acqDate: '2023-10-28',
    sha256: '137765fc5e92dcc9528085d3fb146a61cd8dfc480c50b29184b93a4d26542f86',
    qaStatus: 'pass',
    hotspotCount: 3,
  },

  // --- Case Study 2: Mato Grosso forest fire (2023-08-15) ---
  {
    granuleId: 'VNP14IMG.A2023227.1402.002',
    sensor: 'VIIRS S-NPP VNP14IMG',
    collection: '2',
    processing: 'Standard',
    acqDate: '2023-08-15',
    sha256: 'eeed9a5d1e909524558bfd51baa2cdf8ef8aa9a4b708e5a07ac45c4dd0ea8824',
    qaStatus: 'flag',
    hotspotCount: 4,
  },
  {
    granuleId: 'VJ114IMG.A2023227.1428.002',
    sensor: 'VIIRS NOAA-20 VJ114IMG',
    collection: '2',
    processing: 'Standard',
    acqDate: '2023-08-15',
    sha256: '8bbd1a69f04e2df1464bde400912e50589030563f4f30c1772ddfef6ea8e04f3',
    qaStatus: 'pass',
    hotspotCount: 5,
  },
  {
    granuleId: 'VJ214IMG.A2023227.1449.002',
    sensor: 'VIIRS NOAA-21 VJ214IMG',
    collection: '2',
    processing: 'NRT',
    acqDate: '2023-08-15',
    sha256: 'd7973d20a5cdd886d82dba67c429fa7fe6328111fe0ba2d9ff35dd9785eaf612',
    qaStatus: 'pass',
    hotspotCount: 5,
  },

  // --- Case Study 3: California chaparral prescribed burn (2024-03-12) ---
  {
    granuleId: 'VNP14IMG.A2024072.2124.002',
    sensor: 'VIIRS S-NPP VNP14IMG',
    collection: '2',
    processing: 'Standard',
    acqDate: '2024-03-12',
    sha256: '88245d9399b6fe1ed1bcb27a1f99db1b736aedba84921f21361e2bc078931614',
    qaStatus: 'pass',
    hotspotCount: 3,
  },
  {
    granuleId: 'VJ114IMG.A2024072.2141.002',
    sensor: 'VIIRS NOAA-20 VJ114IMG',
    collection: '2',
    processing: 'Standard',
    acqDate: '2024-03-12',
    sha256: '91d65927e445a7cc3968fd8ac2ba165b2088fb790faccbfa4aef7905b9a11d68',
    qaStatus: 'pass',
    hotspotCount: 3,
  },
];

export default provenance;
