import { GitMerge, Layers, Flame, ArrowUpRight } from 'lucide-react';

interface HighlightItem {
  id: string;
  badge: string;
  icon: typeof GitMerge;
  title: string;
  description: string;
  formula: string;
  formulaName: string;
  takeaway: string;
}

const HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'bipartite',
    badge: '01',
    icon: GitMerge,
    title: 'Many-to-Many Bipartite Matching (Footprint-Level)',
    description:
      'Unlike centroid-based approaches, SANYAM matches actual elliptical ground footprints, accounting for scan-angle deformation and spatial overlap across instruments.',
    formula: 'IoU(F_MODIS, F_VIIRS) ≥ θ_spatial  |  W_ij = IoU_ij × exp(-Δt² / 2σ_t²)',
    formulaName: 'Scan-Deformed Footprint Overlap',
    takeaway: 'Resolves 1:N pixel dilation & bow-tie overlap at off-nadir scan angles',
  },
  {
    id: 'opportunity',
    badge: '02',
    icon: Layers,
    title: 'Observation-Opportunity Tensor',
    description:
      'Per-pass cloud fraction + swath geometry recorded for every MODIS and VIIRS granule, distinguishing true fire-free periods from cloud-obscured passes.',
    formula: 'O(x, y, t) = (1 - f_cloud) × I_in_swath × cos(θ_VZA)',
    formulaName: 'Spatio-Temporal Observability Kernel',
    takeaway: '0 hotspots ≠ 0 fire: prevents misleading fire trend calculations',
  },
  {
    id: 'frp-operators',
    badge: '03',
    icon: Flame,
    title: 'Sensor-Aware FRP Observation Operators',
    description:
      'Physically-grounded transfer functions normalize raw FRP to a common radiometric scale, correcting for sensor point-spread functions and detection limits.',
    formula: 'FRP_adj = β(θ) × FRP_raw + γ × √(A_pixel / A_ref) [MW]',
    formulaName: 'Radiometric Scale Normalization',
    takeaway: 'Aligns 375 m VIIRS detections with 1 km MODIS detection limits',
  },
];

export function ScienceHighlights() {
  return (
    <section
      id="science-highlights"
      className="py-20 px-6 relative"
      style={{
        background: '#111827',
        borderTop: '1px solid rgba(148, 163, 184, 0.08)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border"
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              borderColor: 'rgba(245, 158, 11, 0.25)',
              color: '#F59E0B',
            }}
          >
            <span>Core Science Innovations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F8FAFC]">
            Beyond Naïve Point Aggregation
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Satellite fire science requires accounting for orbital physics, optical distortions, and cloud mechanics.
            SANYAM implements three mathematically rigorous calibration pillars.
          </p>
        </div>

        {/* 3 Innovations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl p-6 transition-all duration-200 border hover:border-amber-500/40 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(25, 34, 52, 0.6)',
                  borderColor: 'rgba(148, 163, 184, 0.12)',
                }}
              >
                <div>
                  {/* Top: Amber Number Badge + Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold font-mono border"
                      style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        borderColor: 'rgba(245, 158, 11, 0.35)',
                        color: '#F59E0B',
                      }}
                    >
                      {item.badge}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-amber-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-[#F8FAFC] leading-snug mb-2.5">
                    {item.title}
                  </h3>

                  {/* Description: 2 lines */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div>
                  {/* Mathematical Formula Box */}
                  <div
                    className="rounded-lg p-3 border mb-3"
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      borderColor: 'rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-400/90 mb-1 flex items-center justify-between">
                      <span>{item.formulaName}</span>
                      <ArrowUpRight className="w-3 h-3 text-amber-400/60" />
                    </div>
                    <code className="text-[11px] font-mono text-emerald-300 break-all leading-tight block">
                      {item.formula}
                    </code>
                  </div>

                  {/* Takeaway / Impact */}
                  <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">✓</span>
                    <span>{item.takeaway}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ScienceHighlights;
