import type { CaseStudy } from '../types';

const caseStudies: CaseStudy[] = [
  {
    id: 'cs1',
    title: 'Agricultural Burning Cluster — Many-to-Many Overlap',
    description:
      'A dense cluster of agricultural burns in Punjab, India (Oct 2023) where 2 MODIS 1-km pixels associate with 9 VIIRS 375-m pixels across a 1,800 ha field mosaic. Demonstrates why raw hotspot count ratios are misleading.',
    scenarioType: 'many_to_many',
    prefilterDate: '2023-10-28',
    prefilterRegion: [74.5, 30.2, 75.5, 31.0],
    badge: 'Case 1',
    highlights: [
      '2 MODIS pixels vs 9 VIIRS pixels — same fire cluster',
      'IoU ranges 0.31–0.68 across sub-pixel matches',
      'Both sensors observe valid clear-sky conditions',
      'FRP observation operator corrects 23% mean bias',
    ],
  },
  {
    id: 'cs2',
    title: 'Cloud-Obscured MODIS Pass vs. VIIRS Detection',
    description:
      'A forest fire in Mato Grosso, Brazil (Aug 2023) where the Terra MODIS overpass was fully cloud-obscured while the S-NPP VIIRS pass 47 minutes later captured 14 active fire pixels under partial cloud clearance.',
    scenarioType: 'cloud_obscured',
    prefilterDate: '2023-08-15',
    prefilterRegion: [-55.0, -13.0, -53.5, -11.8],
    badge: 'Case 2',
    highlights: [
      'MODIS cloud fraction: 0.94 → Valid non-detection, NOT zero fire',
      '14 VIIRS detections with 47-min Δt advantage',
      'Cloud-obscured opportunity state clearly flagged',
      'Calendar shows observation gap, not fire gap',
    ],
  },
  {
    id: 'cs3',
    title: 'Sub-Threshold Low-Intensity Fire below MODIS 5.7 MW Limit',
    description:
      'Prescribed burn in California chaparral (Mar 2024) with FRP 3–6 MW. MODIS detects nothing (below ~5.7 MW daytime detection limit for a 1-km pixel), while VIIRS 375-m pixels detect 6 hotspots at 3.1–5.9 MW.',
    scenarioType: 'sub_threshold',
    prefilterDate: '2024-03-12',
    prefilterRegion: [-120.5, 36.8, -119.2, 37.6],
    badge: 'Case 3',
    highlights: [
      'MODIS detection limit ~5.7 MW (1 km pixel, daytime)',
      '6 VIIRS detections at 375 m — below MODIS threshold',
      'Valid clear-sky for both sensors — not a coverage gap',
      'Demonstrates resolution-driven detection asymmetry',
    ],
  },
];

export default caseStudies;
