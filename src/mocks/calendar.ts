import type { CalendarDay } from '../types';

// October 2023 – Case Study 1: Punjab Agricultural Burning Mosaic
const octCalendar: CalendarDay[] = [
  { date: '2023-10-01', thermalActivityCount: 0, validAreaFraction: 0.12, cloudObscuredFraction: 0.72, outsideSwathFraction: 0.16, hotspots: [] },
  { date: '2023-10-02', thermalActivityCount: 2, validAreaFraction: 0.74, cloudObscuredFraction: 0.14, outsideSwathFraction: 0.12, hotspots: ['hs-001', 'hs-002'] },
  { date: '2023-10-03', thermalActivityCount: 0, validAreaFraction: 0.87, cloudObscuredFraction: 0.08, outsideSwathFraction: 0.05, hotspots: [] }, // Valid non-detection
  { date: '2023-10-04', thermalActivityCount: 5, validAreaFraction: 0.91, cloudObscuredFraction: 0.05, outsideSwathFraction: 0.04, hotspots: ['hs-003', 'hs-004', 'hs-005', 'hs-006', 'hs-007'] },
  { date: '2023-10-05', thermalActivityCount: 7, validAreaFraction: 0.82, cloudObscuredFraction: 0.11, outsideSwathFraction: 0.07, hotspots: ['hs-008', 'hs-009', 'hs-010', 'hs-011', 'hs-012', 'hs-013', 'hs-014'] },
  { date: '2023-10-06', thermalActivityCount: 12, validAreaFraction: 0.95, cloudObscuredFraction: 0.03, outsideSwathFraction: 0.02, hotspots: ['hs-015', 'hs-016', 'hs-017', 'hs-018', 'hs-019', 'hs-020', 'hs-021', 'hs-022', 'hs-023', 'hs-024', 'hs-025', 'hs-026'] },
  { date: '2023-10-07', thermalActivityCount: 9, validAreaFraction: 0.88, cloudObscuredFraction: 0.08, outsideSwathFraction: 0.04, hotspots: ['hs-027', 'hs-028', 'hs-029', 'hs-030', 'hs-031', 'hs-032', 'hs-033', 'hs-034', 'hs-035'] },
  { date: '2023-10-08', thermalActivityCount: 4, validAreaFraction: 0.65, cloudObscuredFraction: 0.25, outsideSwathFraction: 0.10, hotspots: ['hs-036', 'hs-037', 'hs-038', 'hs-039'] },
  { date: '2023-10-09', thermalActivityCount: 0, validAreaFraction: 0.20, cloudObscuredFraction: 0.68, outsideSwathFraction: 0.12, hotspots: [] },
  { date: '2023-10-10', thermalActivityCount: 1, validAreaFraction: 0.78, cloudObscuredFraction: 0.14, outsideSwathFraction: 0.08, hotspots: ['hs-040'] },
  { date: '2023-10-11', thermalActivityCount: 3, validAreaFraction: 0.83, cloudObscuredFraction: 0.10, outsideSwathFraction: 0.07, hotspots: ['hs-041', 'hs-042', 'hs-043'] },
  { date: '2023-10-12', thermalActivityCount: 8, validAreaFraction: 0.92, cloudObscuredFraction: 0.04, outsideSwathFraction: 0.04, hotspots: ['hs-044', 'hs-045', 'hs-046', 'hs-047', 'hs-048', 'hs-049', 'hs-050', 'hs-051'] },
  { date: '2023-10-13', thermalActivityCount: 14, validAreaFraction: 0.96, cloudObscuredFraction: 0.02, outsideSwathFraction: 0.02, hotspots: ['hs-052', 'hs-053', 'hs-054', 'hs-055', 'hs-056', 'hs-057', 'hs-058', 'hs-059', 'hs-060', 'hs-061', 'hs-062', 'hs-063', 'hs-064', 'hs-065'] },
  { date: '2023-10-14', thermalActivityCount: 11, validAreaFraction: 0.89, cloudObscuredFraction: 0.07, outsideSwathFraction: 0.04, hotspots: ['hs-066', 'hs-067', 'hs-068', 'hs-069', 'hs-070', 'hs-071', 'hs-072', 'hs-073', 'hs-074', 'hs-075', 'hs-076'] },
  { date: '2023-10-15', thermalActivityCount: 6, validAreaFraction: 0.72, cloudObscuredFraction: 0.18, outsideSwathFraction: 0.10, hotspots: ['hs-077', 'hs-078', 'hs-079', 'hs-080', 'hs-081', 'hs-082'] },
  { date: '2023-10-16', thermalActivityCount: 0, validAreaFraction: 0.84, cloudObscuredFraction: 0.10, outsideSwathFraction: 0.06, hotspots: [] }, // Valid non-detection
  { date: '2023-10-17', thermalActivityCount: 2, validAreaFraction: 0.81, cloudObscuredFraction: 0.12, outsideSwathFraction: 0.07, hotspots: ['hs-083', 'hs-084'] },
  { date: '2023-10-18', thermalActivityCount: 5, validAreaFraction: 0.90, cloudObscuredFraction: 0.06, outsideSwathFraction: 0.04, hotspots: ['hs-085', 'hs-086', 'hs-087', 'hs-088', 'hs-089'] },
  { date: '2023-10-19', thermalActivityCount: 10, validAreaFraction: 0.94, cloudObscuredFraction: 0.03, outsideSwathFraction: 0.03, hotspots: ['hs-090', 'hs-091', 'hs-092', 'hs-093', 'hs-094', 'hs-095', 'hs-096', 'hs-097', 'hs-098', 'hs-099'] },
  { date: '2023-10-20', thermalActivityCount: 18, validAreaFraction: 0.97, cloudObscuredFraction: 0.02, outsideSwathFraction: 0.01, hotspots: ['hs-100', 'hs-101', 'hs-102', 'hs-103', 'hs-104', 'hs-105', 'hs-106', 'hs-107', 'hs-108', 'hs-109', 'hs-110', 'hs-111', 'hs-112', 'hs-113', 'hs-114', 'hs-115', 'hs-116', 'hs-117'] },
  { date: '2023-10-21', thermalActivityCount: 15, validAreaFraction: 0.92, cloudObscuredFraction: 0.05, outsideSwathFraction: 0.03, hotspots: ['hs-118', 'hs-119', 'hs-120', 'hs-121', 'hs-122', 'hs-123', 'hs-124', 'hs-125', 'hs-126', 'hs-127', 'hs-128', 'hs-129', 'hs-130', 'hs-131', 'hs-132'] },
  { date: '2023-10-22', thermalActivityCount: 8, validAreaFraction: 0.79, cloudObscuredFraction: 0.14, outsideSwathFraction: 0.07, hotspots: ['hs-133', 'hs-134', 'hs-135', 'hs-136', 'hs-137', 'hs-138', 'hs-139', 'hs-140'] },
  { date: '2023-10-23', thermalActivityCount: 1, validAreaFraction: 0.45, cloudObscuredFraction: 0.42, outsideSwathFraction: 0.13, hotspots: ['hs-141'] },
  { date: '2023-10-24', thermalActivityCount: 0, validAreaFraction: 0.15, cloudObscuredFraction: 0.75, outsideSwathFraction: 0.10, hotspots: [] }, // Cloud-obscured
  { date: '2023-10-25', thermalActivityCount: 4, validAreaFraction: 0.86, cloudObscuredFraction: 0.08, outsideSwathFraction: 0.06, hotspots: ['hs-142', 'hs-143', 'hs-144', 'hs-145'] },
  { date: '2023-10-26', thermalActivityCount: 12, validAreaFraction: 0.93, cloudObscuredFraction: 0.04, outsideSwathFraction: 0.03, hotspots: ['hs-146', 'hs-147', 'hs-148', 'hs-149', 'hs-150', 'hs-151'] },
  { date: '2023-10-27', thermalActivityCount: 22, validAreaFraction: 0.98, cloudObscuredFraction: 0.01, outsideSwathFraction: 0.01, hotspots: ['hs-CS1-M1', 'hs-CS1-M2', 'hs-CS1-V1', 'hs-CS1-V2', 'hs-CS1-V3', 'hs-CS1-V4', 'hs-CS1-V5', 'hs-CS1-V6', 'hs-CS1-V7', 'hs-CS1-V8', 'hs-CS1-V9'] },
  { date: '2023-10-28', thermalActivityCount: 11, validAreaFraction: 0.96, cloudObscuredFraction: 0.02, outsideSwathFraction: 0.02, hotspots: ['M1-CS1-01', 'M2-CS1-02', 'V1-CS1-01', 'V2-CS1-02', 'V3-CS1-03', 'V4-CS1-04', 'V5-CS1-05', 'V6-CS1-06', 'V7-CS1-07', 'V8-CS1-08', 'V9-CS1-09'] }, // CS1 Anchor Date
  { date: '2023-10-29', thermalActivityCount: 0, validAreaFraction: 0.82, cloudObscuredFraction: 0.12, outsideSwathFraction: 0.06, hotspots: [] },
  { date: '2023-10-30', thermalActivityCount: 3, validAreaFraction: 0.70, cloudObscuredFraction: 0.20, outsideSwathFraction: 0.10, hotspots: ['hs-152', 'hs-153', 'hs-154'] },
  { date: '2023-10-31', thermalActivityCount: 6, validAreaFraction: 0.88, cloudObscuredFraction: 0.07, outsideSwathFraction: 0.05, hotspots: ['hs-155', 'hs-156', 'hs-157', 'hs-158', 'hs-159', 'hs-160'] },
];

// August 2023 – Case Study 2: Mato Grosso Amazon Deforestation & Forest Fires
const augCalendar: CalendarDay[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const dateStr = `2023-08-${String(day).padStart(2, '0')}`;

  if (day === 15) {
    // Case 2 Anchor Date: MODIS pass cloud obscured (0.94), VIIRS captured 14 hotspots
    return {
      date: dateStr,
      thermalActivityCount: 14,
      validAreaFraction: 0.04,
      cloudObscuredFraction: 0.94,
      outsideSwathFraction: 0.02,
      hotspots: [
        'V10-CS2-01', 'V11-CS2-02', 'V12-CS2-03', 'V13-CS2-04',
        'V14-CS2-05', 'V15-CS2-06', 'V16-CS2-07', 'V17-CS2-08',
        'V18-CS2-09', 'V19-CS2-10', 'V20-CS2-11', 'V21-CS2-12',
        'V22-CS2-13', 'V23-CS2-14',
      ],
    };
  }

  const isCloudy = day >= 13 && day <= 16;
  const cloudFrac = isCloudy ? 0.85 : parseFloat((0.1 + Math.sin(day) * 0.1).toFixed(2));
  const validFrac = parseFloat((1.0 - cloudFrac - 0.05).toFixed(2));
  const activity = isCloudy ? 1 : Math.round(8 + Math.cos(day) * 6);

  return {
    date: dateStr,
    thermalActivityCount: Math.max(0, activity),
    validAreaFraction: Math.max(0.05, validFrac),
    cloudObscuredFraction: cloudFrac,
    outsideSwathFraction: 0.05,
    hotspots: Array.from({ length: Math.max(0, activity) }, (_, idx) => `hs-aug-${day}-${idx + 1}`),
  };
});

// March 2024 – Case Study 3: California Chaparral Prescribed Fire (Sub-Threshold)
const marCalendar: CalendarDay[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const dateStr = `2024-03-${String(day).padStart(2, '0')}`;

  if (day === 12) {
    // Case 3 Anchor Date: Low FRP fire (FRP 3.1-5.9 MW), 6 VIIRS hotspots detected, MODIS sub-threshold
    return {
      date: dateStr,
      thermalActivityCount: 6,
      validAreaFraction: 0.92,
      cloudObscuredFraction: 0.05,
      outsideSwathFraction: 0.03,
      hotspots: ['V24-CS3-01', 'V25-CS3-02', 'V26-CS3-03', 'V27-CS3-04', 'V28-CS3-05', 'V29-CS3-06'],
    };
  }

  const isRain = day === 5 || day === 6 || day === 21;
  const cloudFrac = isRain ? 0.78 : parseFloat((0.15 + (day % 4) * 0.05).toFixed(2));
  const validFrac = parseFloat((1.0 - cloudFrac - 0.05).toFixed(2));
  const activity = isRain ? 0 : (day % 7 === 0 ? 0 : Math.round(1 + (day % 3)));

  return {
    date: dateStr,
    thermalActivityCount: activity,
    validAreaFraction: Math.max(0.1, validFrac),
    cloudObscuredFraction: cloudFrac,
    outsideSwathFraction: 0.05,
    hotspots: Array.from({ length: activity }, (_, idx) => `hs-mar-${day}-${idx + 1}`),
  };
});

export const calendar: CalendarDay[] = [
  ...augCalendar,
  ...octCalendar,
  ...marCalendar,
];

export default calendar;
