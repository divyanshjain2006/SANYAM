import type { CandidateMatch } from '../types';

export const candidateMatches: CandidateMatch[] = [
  // Case 1: Agricultural Burning Cluster (Punjab) - Many-to-Many Overlap
  {
    id: 'cm-CS1-01',
    modisId: 'M1-CS1-01',
    viirsIds: ['V1-CS1-01', 'V2-CS1-02', 'V3-CS1-03'],
    deltaT: 102,
    centroidDistance: 0.62,
    iou: 0.42,
    smallerFootprintOverlap: 0.64,
    opportunityState: 'valid_clear_sky',
  },
  {
    id: 'cm-CS1-02',
    modisId: 'M2-CS1-02',
    viirsIds: ['V4-CS1-04', 'V5-CS1-05', 'V6-CS1-06', 'V7-CS1-07'],
    deltaT: 24,
    centroidDistance: 0.47,
    iou: 0.61,
    smallerFootprintOverlap: 0.77,
    opportunityState: 'valid_clear_sky',
  },
  // Case 2: Forest Fire & Cloud Obstruction (Mato Grosso)
  {
    id: 'cm-CS2-01',
    modisId: 'NONE_CLOUD_OBSCURED',
    viirsIds: [
      'V10-CS2-01',
      'V11-CS2-02',
      'V12-CS2-03',
      'V13-CS2-04',
      'V14-CS2-05',
      'V15-CS2-06',
      'V16-CS2-07',
    ],
    deltaT: 47,
    centroidDistance: 0,
    iou: 0.0,
    smallerFootprintOverlap: 0.0,
    opportunityState: 'cloud_obscured',
  },
  // Case 3: Prescribed Burn & Sub-Threshold Detection (California)
  {
    id: 'cm-CS3-01',
    modisId: 'NONE_SUB_THRESHOLD',
    viirsIds: [
      'V24-CS3-01',
      'V25-CS3-02',
      'V26-CS3-03',
      'V27-CS3-04',
      'V28-CS3-05',
      'V29-CS3-06',
    ],
    deltaT: 17,
    centroidDistance: 0,
    iou: 0.0,
    smallerFootprintOverlap: 0.0,
    opportunityState: 'valid_clear_sky',
  },
];

export default candidateMatches;
