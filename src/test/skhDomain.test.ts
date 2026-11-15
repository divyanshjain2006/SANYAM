import { describe, expect, it } from 'vitest';

import { calendarCells, candidateAssociations } from '../mocks/skhFixtures';
import {
  buildAmbiguousGroups,
  filterCalendarByOpportunityState,
  MockSKHRepository,
} from '../services/skhApi';

describe('SKH deterministic scientific mock engine', () => {
  it('groups the many-to-many bipartite cluster as one connected component', () => {
    const groups = buildAmbiguousGroups(candidateAssociations);

    expect(groups).toHaveLength(1);
    expect(groups[0]).toHaveLength(6); // one MODIS node plus five VIIRS nodes
    expect(groups[0]).toContain('c1-modis-offnadir-01');
    expect(groups[0]).toContain('c1-viirs-5');
  });

  it('preserves cloud-obscured and valid-no-detection opportunity states', async () => {
    const repository = new MockSKHRepository();
    const august = await repository.getBurningActivityCalendar(2023, 8, 1);
    const cloudObscured = filterCalendarByOpportunityState(calendarCells, 'CLOUD_OBSCURED');
    const validNoDetection = filterCalendarByOpportunityState(calendarCells, 'VALID_NO_DETECTION');

    expect(august).toEqual(cloudObscured);
    expect(cloudObscured[0]).toMatchObject({ modis_detections: 0, viirs_detections: 3 });
    expect(validNoDetection[0]).toMatchObject({ modis_detections: 0, viirs_detections: 2 });
    expect(validNoDetection[0].valid_observed_area_fraction).toBeGreaterThan(0.9);
  });
});
