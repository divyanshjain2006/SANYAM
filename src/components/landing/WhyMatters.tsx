import { Layers, CloudOff, Activity, AlertTriangle } from 'lucide-react';

export const WhyMatters = () => {
  return (
    <section id="about" className="py-20 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Visual Illustration Card (DNA / Satellite Sensor Footprint graphic) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white min-h-[460px] flex flex-col justify-between">
              {/* Decorative background grid and glowing circles */}
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-300 border border-white/15 backdrop-blur-md">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Remote Sensing Disparity
                </span>
                <span className="text-xs font-mono text-slate-400">7.1× Area Ratio</span>
              </div>

              {/* Center Infographic Diagram */}
              <div className="relative z-10 my-auto py-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                    <span className="text-amber-400 font-semibold">MODIS 1 km Pixel</span>
                    <span className="text-cyan-400 font-semibold">VIIRS 375 m Pixels (×7+)</span>
                  </div>
                  {/* Schematic representation of 1 MODIS pixel containing multiple VIIRS pixels */}
                  <div className="w-full aspect-square max-h-[140px] mx-auto border-2 border-amber-500/80 rounded-lg p-1.5 grid grid-cols-3 gap-1 bg-amber-500/10">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded border text-[9px] flex items-center justify-center font-mono font-bold transition-all ${
                          i === 4 || i === 1 || i === 7
                            ? 'bg-cyan-500/40 border-cyan-400 text-cyan-200'
                            : 'bg-slate-800/60 border-slate-700 text-slate-500'
                        }`}
                      >
                        {i === 4 || i === 1 || i === 7 ? '🔥' : '375m'}
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-[11px] text-slate-400 mt-2">
                    One 1 km MODIS detection vs multiple 375 m VIIRS detections of the same fire front.
                  </div>
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="relative z-10 border-t border-white/10 pt-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Without spatial containment matching, temporal alignment, and observation-opportunity masks, cross-sensor analysis produces severe false trends."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Problem Pillars */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-2.5">
                Scientific Context
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Why This Matters for Fire Observation
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
                Raw satellite counts deceive analysts. Understanding these three physical disparities is fundamental to accurate wildfire reporting and carbon budgeting.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              {/* Card 1 */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      1. Resolution Mismatch (1 km vs. 375 m)
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      MODIS pixels cover roughly 1 km² at nadir; VIIRS pixels cover 0.14 km². Because a single MODIS pixel contains over seven VIIRS footprints, a fire cluster detected as 1 MODIS hotspot naturally splits into 5–10 VIIRS detections. Raw counts are mathematically incomparable.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                    <CloudOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      2. The Missing-Data Trap (Clouds & Swath Gaps)
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      "0 hotspots detected" does <strong className="text-slate-800">NOT</strong> mean zero fire. Cloud cover frequently conceals active combustion, while equatorial orbital swath gaps leave whole landscapes unobserved. SANYAM separates valid non-detections from cloud-obscured passes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-violet-100 text-violet-700 shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      3. Measurement Discrepancies (Raw FRP & Overpass Timing)
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Terra observes at ~10:30 local time before the diurnal fire peak, while Aqua and JPSS observe at ~13:30. Sensor detection thresholds (5.7 MW vs 1.5 MW) and edge-of-swath pixel growth require explicit observation operators rather than raw summation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMatters;
