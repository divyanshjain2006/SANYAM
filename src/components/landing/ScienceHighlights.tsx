import { GitMerge, Flame } from 'lucide-react';

export function ScienceHighlights() {
  const metrics = [
    { label: 'Footprint Areal Ratio', value: '7.1×', subtext: 'MODIS 1km vs VIIRS 375m', color: 'text-amber-600' },
    { label: 'Edge-of-Swath Growth', value: '4.8×', subtext: 'Off-nadir pixel broadening', color: 'text-blue-600' },
    { label: 'MODIS Detection Limit', value: '5.7 MW', subtext: 'Daytime nominal threshold', color: 'text-violet-600' },
    { label: 'Cross-Calibrated Bias', value: '+5.2%', subtext: 'After FRP observation operator', color: 'text-emerald-600' },
  ];

  return (
    <section id="science-highlights" className="py-20 px-6 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            Physical Principles
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Vision & Insights: Decoding Cross-Sensor Synergy
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            The mathematical and physical formulations bridging MODIS and VIIRS telemetry into a coherent climate data record.
          </p>
        </div>

        {/* 4 Metric KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                <span className={m.color}>{m.value}</span>
              </div>
              <div className="text-xs font-bold text-slate-700 mt-1">{m.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{m.subtext}</div>
            </div>
          ))}
        </div>

        {/* Two Deep-Dive Scientific Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Card 1: Smaller-Footprint Overlap */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold text-xs uppercase tracking-wider">
                <GitMerge className="w-4 h-4" />
                <span>Formulation 01</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Smaller-Footprint Overlap (O<sub>s</sub>) Formulation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Conventional Intersection-over-Union (IoU) unfairly penalizes mismatched footprints. SANYAM evaluates containment of the smaller VIIRS footprint inside the broader MODIS footprint.
              </p>
            </div>

            {/* Formatted Mathematical Block */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5">
              <div className="text-[10px] text-slate-500 font-sans uppercase font-bold tracking-wider">
                Mathematical Overlap Kernel:
              </div>

              {/* Nicely Rendered Fraction Formula */}
              <div className="flex items-center gap-3 py-1 font-serif text-slate-900 text-base sm:text-lg">
                <span className="font-bold italic text-blue-700">O<sub>s</sub></span>
                <span className="text-slate-400">=</span>
                <div className="inline-flex flex-col items-center">
                  <span className="border-b-2 border-slate-800 px-3 pb-1 text-xs sm:text-sm font-sans font-semibold text-blue-800 tracking-wide">
                    Area( F<sub>MODIS</sub> ∩ F<sub>VIIRS</sub> )
                  </span>
                  <span className="pt-1 text-xs sm:text-sm font-sans font-semibold text-cyan-800 tracking-wide">
                    Area( F<sub>VIIRS</sub> )
                  </span>
                </div>
                <span className="font-sans font-bold text-slate-800 text-sm sm:text-base ml-1">
                  ≥ 0.50
                </span>
              </div>

              {/* Explanatory Variable Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 font-sans">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span><strong>Numerator:</strong> Overlapping fire footprint area</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                  <span><strong>Denominator:</strong> Smaller VIIRS footprint (0.14 km²)</span>
                </div>
              </div>

              {/* Sub-Equation: Spatiotemporal Weight */}
              <div className="pt-2 border-t border-slate-200/80">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                  Spatiotemporal Decay Weight:
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-slate-800 font-medium">
                  <span className="font-serif italic font-bold text-blue-600 text-sm">W<sub>ij</sub></span>
                  <span>=</span>
                  <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                    O<sub>s</sub>(i, j)
                  </span>
                  <span>×</span>
                  <span>exp</span>
                  <span className="text-base font-light">(</span>
                  <div className="inline-flex flex-col items-center text-[10px]">
                    <span className="border-b border-slate-700 px-1 text-amber-700 font-bold">−Δt²</span>
                    <span className="text-slate-600">2σ<sub>t</sub>²</span>
                  </div>
                  <span className="text-base font-light">)</span>
                  <span className="text-[10px] text-slate-500 ml-auto">
                    Δt ≤ 30 min, σ<sub>t</sub> = 30 min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: FRP Radiometric Observation Operator */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-amber-700 font-bold text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                <span>Formulation 02</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                FRP Radiometric Observation Operator
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Normalizes raw Fire Radiative Power (MW) across differing view zenith angles and pixel point-spread functions to prevent undercounting small sub-pixel fires.
              </p>
            </div>

            {/* Formatted Mathematical Block */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5">
              <div className="text-[10px] text-slate-500 font-sans uppercase font-bold tracking-wider">
                Radiometric Transfer Function:
              </div>

              {/* Nicely Rendered Equation */}
              <div className="flex items-center gap-2 py-1 font-serif text-slate-900 text-base sm:text-lg flex-wrap">
                <span className="font-bold italic text-amber-700">FRP<sub>adj</sub></span>
                <span className="text-slate-400">=</span>
                <span className="font-sans font-semibold text-amber-800 text-sm sm:text-base">β(θ)</span>
                <span>×</span>
                <span className="font-sans font-semibold text-slate-800 text-sm sm:text-base">FRP<sub>raw</sub></span>
                <span className="text-slate-500">+</span>
                <span className="font-sans font-semibold text-purple-700 text-sm sm:text-base">γ</span>
                <span>×</span>
                <div className="inline-flex items-center gap-0.5 text-xs sm:text-sm font-sans font-bold">
                  <span className="text-base sm:text-xl font-light">√</span>
                  <div className="border-t border-slate-800 inline-flex flex-col items-center px-1">
                    <span className="border-b border-slate-600 px-1 text-[11px] font-sans text-slate-800">
                      A<sub>pixel</sub>
                    </span>
                    <span className="text-[11px] font-sans text-slate-600">
                      A<sub>ref</sub>
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 ml-auto">
                  MW
                </span>
              </div>

              {/* Explanatory Variable Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 font-sans">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span><strong>β(θ):</strong> Atmospheric view zenith angle transmission</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span><strong>A<sub>pixel</sub> / A<sub>ref</sub>:</strong> Instantaneous pixel area ratio</span>
                </div>
              </div>

              {/* Sub-Equation: Detection Threshold */}
              <div className="pt-2 border-t border-slate-200/80">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                  Dynamic Detection Limit Threshold:
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-slate-800 font-medium">
                  <span className="font-serif italic font-bold text-emerald-700 text-sm">D<sub>p</sub>(A<sub>p</sub>)</span>
                  <span>=</span>
                  <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                    D<sub>0</sub>
                  </span>
                  <span>×</span>
                  <div className="inline-flex items-center gap-0.5 text-xs font-sans">
                    <span className="text-base font-light">√</span>
                    <div className="border-t border-slate-700 inline-flex flex-col items-center px-1 text-[10px]">
                      <span className="border-b border-slate-600 font-sans">A<sub>p</sub></span>
                      <span className="font-sans text-slate-600">A<sub>0</sub></span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 ml-auto">
                    MODIS: D<sub>0</sub> = 5.7 MW | VIIRS: D<sub>0</sub> = 1.5 MW
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScienceHighlights;
