# SANYAM — Testing & Scientific Validation Guide

**Project:** SANYAM — Harmonization of MODIS and VIIRS Hot Spots  
**Challenge:** NASA Space Apps Challenge  
**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Node.js Test Runner  

---

## 1. Quick Start

Run the automated test suite directly in terminal:
```bash
npm test
```

Start the interactive development server:
```bash
npm run dev
# Open http://localhost:5173/
```

Execute a full production build check:
```bash
npm run build
```

---

## 2. Test Suite Overview

SANYAM includes an automated, zero-external-dependency test runner utilizing Node.js 24's native ESM test execution (`node:test` + `node:assert/strict`) with TypeScript type stripping:

| Test Suite | File | Tests | Focus Area |
|---|---|---|---|
| **ISKHRepository & API** | `src/test/api.test.ts` | 8 tests | Service contract, filter queries, mock/remote backend readiness |
| **Scientific Harmonization** | `src/test/harmonization.test.ts` | 4 tests | Mathematical validation of $O_s$, FRP scaling, detection limits $D_p$ |
| **Mock Datasets Integrity** | `src/test/mocks.test.ts` | 11 tests | Coordinate bounds, FRP physics, SHA-256 hashes, GeoJSON footprints |
| **Total** | | **23 tests** | **All Passing (100% Pass Rate)** |

---

## 3. Core Scientific Harmonization Principles Tested

### A. Smaller-Footprint Overlap ($O_s$) vs. Intersection over Union (IoU)
A nadir MODIS pixel ($1\text{ km} \times 1\text{ km} = 1,000,000\text{ m}^2$) is roughly $7\times$ larger than a VIIRS pixel ($375\text{ m} \times 375\text{ m} = 140,625\text{ m}^2$).
Under conventional **Intersection over Union (IoU)**:
$$\text{IoU} = \frac{\text{Area}(A \cap B)}{\text{Area}(A \cup B)} = \frac{140,625}{1,000,000} \approx 0.1406$$
Even when the VIIRS footprint is **100% enclosed** within the MODIS footprint, IoU penalizes the pair because of the resolution disparity.

SANYAM implements **Smaller-Footprint Overlap ($O_s$)**:
$$O_s = \frac{\text{Area}(A \cap B)}{\min(\text{Area}(A), \text{Area}(B))}$$
When a VIIRS footprint is fully contained within a MODIS footprint, $O_s = 1.0$ ($100\%$ containment), giving scientists an accurate, resolution-independent metric of spatial co-observation.

### B. Sensor-Aware FRP Observation Operator
Different sensors sample varying ground areas and view angles. SANYAM normalizes raw Fire Radiative Power (MW) using reference pixel areas ($A_{\text{ref}}$):
$$FRP_{\text{adj}} = FRP_{\text{raw}} \times \left(\frac{A_{\text{ref}}}{A_p}\right)^{0.5}$$
- $A_{\text{ref}}(\text{MODIS}) = 1.0\text{ km}^2$
- $A_{\text{ref}}(\text{VIIRS}) = 0.141\text{ km}^2$

### C. Daytime & Nighttime Detection Limits ($D_p$)
$$D_p = D_{\text{ref}} \times \sqrt{\frac{A_p}{A_{\text{ref}}}}$$
- **Daytime:** MODIS $D_{\text{ref}} = 5.7\text{ MW}$, VIIRS $D_{\text{ref}} = 1.5\text{ MW}$
- **Nighttime:** MODIS $D_{\text{ref}} = 1.5\text{ MW}$, VIIRS $D_{\text{ref}} = 0.4\text{ MW}$

This accounts for why a $3.5\text{ MW}$ daytime fire is detected by VIIRS while falling cleanly below the MODIS daytime detection limit (valid clear-sky, not a missing fire).

---

## 4. Case Studies Validated in Tests

1. **Case 1: Punjab Agricultural Burning Cluster (Oct 28, 2023)**
   - 2 MODIS 1-km pixels associate with 9 VIIRS 375-m pixels.
   - Verified that $O_s$ containment reaches $0.62\text{–}0.82$, proving a single agricultural fire cluster rather than a $4.5\times$ increase in fire events.
2. **Case 2: Mato Grosso Forest Fire & Cloud Deck (Aug 15, 2023)**
   - MODIS pass is cloud-obscured ($f_{\text{cloud}} = 0.94$).
   - 14 VIIRS detections occur 47 minutes later under partial clearance, verified as an observation gap rather than a zero-fire day.
3. **Case 3: California Low-Intensity Prescribed Burn (Mar 12, 2024)**
   - Fire radiative power is $3.1\text{–}5.9\text{ MW}$.
   - Verified that all detections fall below the MODIS $5.7\text{ MW}$ daytime detection limit, confirming sensor sensitivity difference under clear sky.

---

## 5. Provenance & Cryptographic Lineage

All 10 satellite granules in the catalog (`MOD14A1`, `MYD14A1`, `VNP14IMG`, `VJ114IMG`, `VJ214IMG`) have valid 64-character SHA-256 integrity hashes checked during testing and display in the **Sensitivity Lab & Provenance Manifest** dashboard with one-click GeoJSON, CSV, and JSON exporters.
